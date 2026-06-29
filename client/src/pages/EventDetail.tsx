import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  UserRound
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event, getEvent, registerForEvent } from "@/api/events";
import { useToast } from "@/hooks/useToast";

type RegistrationForm = {
  name: string;
  email: string;
  phone?: string;
};

type AgendaRow = {
  time: string;
  title: string;
  description: string;
};

const fallbackLearning = [
  "Architecting AI-native application infrastructure.",
  "Optimizing prompt engineering for complex logic.",
  "Implementing automated AI code reviews.",
  "Evaluating AI security and data privacy risks."
];

function formatDate(date: string) {
  if (!date) return "Date TBA";
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function parseAgenda(items: string[] = [], startTime = "10:00") {
  if (!items.length) {
    return [
      {
        time: startTime,
        title: "Registration & Welcome",
        description: "Check in, meet the team, and get settled for the session."
      },
      {
        time: "11:00",
        title: "Main Session",
        description: "A focused walkthrough of the event topic with practical examples."
      },
      {
        time: "01:00",
        title: "Networking & Discussion",
        description: "Open discussion, questions, and next steps with attendees."
      }
    ];
  }

  return items.map((item, index) => {
    const parts = item.split("|").map((part) => part.trim());
    if (parts.length >= 3) {
      return { time: parts[0], title: parts[1], description: parts.slice(2).join(" | ") };
    }

    return {
      time: index === 0 ? startTime : `${String(10 + index).padStart(2, "0")}:00`,
      title: item,
      description: "Session details will be shared with registered attendees."
    };
  });
}

function learningPoints(event: Event) {
  const agendaItems = event.agenda?.slice(0, 4).map((item) => item.split("|").at(-1)?.trim() || item) || [];
  if (agendaItems.length >= 4) return agendaItems;
  return [...agendaItems, ...fallbackLearning].slice(0, 4);
}

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RegistrationForm>();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const response = await getEvent(id);
        setEvent(response.event);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const agenda = useMemo(() => parseAgenda(event?.agenda, event?.time), [event?.agenda, event?.time]);
  const learn = useMemo(() => (event ? learningPoints(event) : fallbackLearning), [event]);
  const seatsRemaining =
    event?.maxAttendees !== undefined
      ? Math.max(Number(event.maxAttendees) - Number(event.currentAttendees || 0), 0)
      : null;

  const onSubmit = async (data: RegistrationForm) => {
    if (!event) return;

    setRegistering(true);
    try {
      const response = await registerForEvent(event._id, data);
      toast({
        title: "Registration Successful",
        description: response.message
      });
      reset();
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register for event",
        variant: "destructive"
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-[440px] animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-96 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white py-20 dark:bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Event Not Found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">The event you are looking for is unavailable.</p>
          <Link to="/events">
            <Button className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[420px] overflow-hidden border border-slate-300 bg-slate-900 shadow-sm dark:border-white/10">
          <img src={event.image} alt={event.title} className="absolute inset-0 h-full w-full object-cover opacity-55 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          <div className="relative flex min-h-[420px] max-w-4xl flex-col justify-end px-6 py-10 text-white sm:px-12">
            <Link to="/events" className="mb-5 inline-flex w-fit items-center text-sm font-semibold text-white/85 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
            <Badge variant="outline" className="mb-5 w-fit border-white/55 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-white">
              {event.type}
            </Badge>
            <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-12">
          <section>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-8 w-1 bg-black dark:bg-white" />
              <h2 className="text-2xl font-black">About the Event</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              <p>{event.description}</p>
              <p>
                This session is designed for teams who want practical, grounded insight they can bring back into real product and engineering workflows.
              </p>
            </div>
          </section>

          <section className="border-l-4 border-black bg-slate-100 p-6 dark:border-white dark:bg-white/5">
            <h3 className="mb-6 text-xl font-black">What You'll Learn</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {learn.map((item) => (
                <div key={item} className="flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none fill-black text-white dark:fill-white dark:text-slate-950" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-8 w-1 bg-black dark:bg-white" />
              <h2 className="text-2xl font-black">Agenda</h2>
            </div>
            <div className="border border-slate-300 dark:border-white/10">
              {agenda.map((row, index) => (
                <div
                  key={`${row.time}-${row.title}`}
                  className={`grid gap-3 border-b border-slate-300 p-6 last:border-b-0 dark:border-white/10 md:grid-cols-[110px_1fr] ${
                    index % 2 === 1 ? "bg-slate-100 dark:bg-white/5" : "bg-white dark:bg-slate-950"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{row.time}</p>
                  <div>
                    <h3 className="text-xl font-black">{row.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{row.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-2 border-black bg-white p-7 dark:border-white dark:bg-slate-950">
            <div className="space-y-7">
              <InfoRow icon={<Calendar className="h-5 w-5" />} label="Date" value={formatDate(event.date)} />
              <InfoRow icon={<Clock className="h-5 w-5" />} label="Time" value={event.time || "Time TBA"} />
              <InfoRow icon={<MapPin className="h-5 w-5" />} label="Location" value={event.location || "Location TBA"} />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="mt-8 h-14 w-full rounded-none bg-black text-lg font-black text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                  disabled={Boolean(event.maxAttendees && event.currentAttendees >= event.maxAttendees)}
                >
                  {event.maxAttendees && event.currentAttendees >= event.maxAttendees ? "Event Full" : "Register Now"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white dark:bg-slate-900">
                <DialogHeader>
                  <DialogTitle>Register for {event.title}</DialogTitle>
                  <DialogDescription>Please fill out the form below to reserve your seat.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="event-detail-name">Full Name *</Label>
                    <Input id="event-detail-name" {...register("name", { required: "Name is required" })} className="mt-1" />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="event-detail-email">Email Address *</Label>
                    <Input
                      id="event-detail-email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                      })}
                      className="mt-1"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="event-detail-phone">Phone Number</Label>
                    <Input id="event-detail-phone" {...register("phone")} className="mt-1" />
                  </div>
                  <Button type="submit" className="w-full" disabled={registering}>
                    {registering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Register
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {seatsRemaining !== null && (
              <p className="mt-4 text-center text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                {seatsRemaining} seats remaining
              </p>
            )}

            {event.speakers && event.speakers.length > 0 && (
              <div className="mt-8 border-t border-slate-300 pt-8 dark:border-white/10">
                <h2 className="mb-6 text-xl font-black">Speakers</h2>
                <div className="space-y-5">
                  {event.speakers.map((speaker) => (
                    <div key={speaker} className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-400 dark:border-white/30">
                        <UserRound className="h-5 w-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-black">{speaker}</p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Event Speaker</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 text-slate-500 dark:text-slate-400">{icon}</div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 font-black">{value}</p>
      </div>
    </div>
  );
}

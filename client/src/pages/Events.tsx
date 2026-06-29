import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { getEvents, registerForEvent, Event } from "@/api/events";
import { useToast } from "@/hooks/useToast";

interface RegistrationForm {
  name: string;
  email: string;
  phone?: string;
}

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationForm>();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events...");
        const response = (await getEvents()) as { events: Event[] };
        setEvents(response.events);

        const now = new Date();
        const upcoming = response.events.filter(
          (event) => new Date(event.date) >= now,
        );
        const past = response.events.filter(
          (event) => new Date(event.date) < now,
        );

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const onSubmit = async (data: RegistrationForm) => {
    if (!selectedEvent) return;

    setRegistering(true);
    try {
      console.log("Registering for event:", selectedEvent._id, data);
      const response = (await registerForEvent(selectedEvent._id, data)) as {
        success: boolean;
        message: string;
      };

      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: response.message,
        });
        reset();
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to register for event",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const EventCard = ({
    event,
    isPast = false,
  }: {
    event: Event;
    isPast?: boolean;
  }) => (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${isPast ? "opacity-75" : ""}`}
    >
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge
            className={
              isPast
                ? "bg-slate-500"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/30 shadow-sm"
            }
          >
            {event.type}
          </Badge>
        </div>
        {!isPast && event.registrationRequired && event.maxAttendees && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90">
              {event.currentAttendees}/{event.maxAttendees}
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
          {event.title}
        </CardTitle>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          {!isPast && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{event.currentAttendees} attending</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {event.description}
        </p>
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
              Speakers:
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map((speaker) => (
                <Badge key={speaker} variant="outline" className="text-xs">
                  {speaker}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {!isPast && event.registrationRequired ? (
          <div className="grid gap-3">
            <Link to={`/events/${event._id}`}>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30"
                  disabled={
                    event.maxAttendees
                      ? event.currentAttendees >= event.maxAttendees
                      : false
                  }
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.maxAttendees &&
                  event.currentAttendees >= event.maxAttendees
                    ? "Event Full"
                    : "Register Now"}
                </Button>
              </DialogTrigger>
            <DialogContent className="bg-white dark:bg-slate-800">
              <DialogHeader>
                <DialogTitle>Register for {event.title}</DialogTitle>
                <DialogDescription>
                  Please fill out the form below to register for this event.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" {...register("phone")} className="mt-1" />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30"
                  disabled={registering}
                >
                  {registering ? "Registering..." : "Register"}
                </Button>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        ) : !isPast ? (
          <Link to={`/events/${event._id}`}>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
          </Link>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Event Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-[600px] mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900/60 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-slate-200 dark:bg-gray-800/60"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-gray-800/60 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-gray-800/60 rounded mb-4"></div>
                  <div className="h-10 bg-slate-200 dark:bg-gray-800/60 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Events
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Join us for workshops, seminars, and networking events designed to
            help you stay ahead in technology
          </p>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event._id} event={event} isPast />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              No events scheduled at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

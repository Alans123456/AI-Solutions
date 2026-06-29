import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, ChevronDown, Linkedin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Faq, getFaqs, getTeamMembers, TeamMember } from "@/api/about";
import { useToast } from "@/hooks/useToast";

const values = [
  {
    title: "Useful AI first",
    description: "We build AI around real workflows, measurable outcomes, and practical adoption.",
    icon: BrainCircuit
  },
  {
    title: "Reliable delivery",
    description: "Every project is planned with clear scope, maintainable code, and production support.",
    icon: ShieldCheck
  },
  {
    title: "Human partnership",
    description: "We work closely with teams so the finished product feels native to the business.",
    icon: Users
  }
];

const milestones = [
  "Discovery sessions that turn rough ideas into practical product scope.",
  "Full-stack development for web platforms, dashboards, and automation tools.",
  "AI integrations that improve support, operations, analytics, and content workflows."
];

export function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const [teamResponse, faqResponse] = await Promise.all([getTeamMembers(), getFaqs()]);
        setTeam(teamResponse.members);
        setFaqs(faqResponse.faqs);
      } catch (error) {
        console.error("Error fetching about page content:", error);
        toast({
          title: "Error",
          description: "Failed to load about page content",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, [toast]);

  const sortedTeam = useMemo(
    () => [...team].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)),
    [team]
  );
  const sortedFaqs = useMemo(
    () => [...faqs].sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)),
    [faqs]
  );

  return (
    <div className="min-h-screen py-20">
      <section className="container mx-auto px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge className="mb-5 bg-indigo-600 text-white">About AI Solution</Badge>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              We turn business workflows into reliable AI-powered products.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              AI Solution helps teams add useful AI to existing products and launch new digital platforms from strategy through production.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  Start a Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline">Explore Services</Button>
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-white/20 bg-slate-950 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(79,70,229,0.35),transparent_40%),radial-gradient(circle_at_80%_15%,rgba(34,211,238,0.25),transparent_30%)]" />
            <div className="relative">
              <Sparkles className="mb-8 h-10 w-10 text-cyan-300" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Our Story</p>
              <h2 className="mt-4 text-3xl font-bold">Built for companies that need AI to be practical.</h2>
              <p className="mt-5 text-slate-200">
                We started with a simple belief: AI should remove friction from everyday work. Our team combines product thinking, full-stack engineering, and AI implementation to ship tools people can trust and use.
              </p>
              <div className="mt-8 grid gap-4">
                {milestones.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-slate-100">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-cyan-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white/70 py-16 dark:border-white/10 dark:bg-slate-950/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Vision</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">Make advanced technology feel simple to operate.</h2>
            </div>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
              Our vision is to help growing teams use AI without extra complexity. We focus on clear interfaces, secure data flow, measurable business value, and long-term maintainability.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-0 bg-white/80 shadow-lg dark:bg-gray-900/60">
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 dark:text-white">{value.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Team</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">The people behind the work</h2>
          </div>
          <p className="max-w-xl text-slate-600 dark:text-slate-300">
            This section is managed from the admin dashboard, so your public team profiles can stay fresh.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {sortedTeam.map((member) => (
              <Card key={member._id} className="overflow-hidden border-0 bg-white/80 shadow-lg dark:bg-gray-900/60">
                <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                  <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white">{member.name}</h3>
                      <p className="mt-1 text-sm font-medium text-indigo-600">{member.role}</p>
                    </div>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-600" aria-label={`${member.name} LinkedIn`}>
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{member.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(member.expertise || []).map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold">Common questions</h2>
            <p className="mt-4 text-slate-300">These questions are managed from the backend so the answers can evolve with the business.</p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="space-y-3">
              {sortedFaqs.map((faq) => (
                <div key={faq._id} className="rounded-lg border border-white/10 bg-white/5 px-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-white"
                    onClick={() => setOpenFaqId((current) => (current === faq._id ? null : faq._id))}
                    aria-expanded={openFaqId === faq._id}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 flex-none transition-transform ${openFaqId === faq._id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaqId === faq._id && (
                    <div className="pb-5 text-sm leading-6 text-slate-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BriefcaseBusiness, Calendar, FileText, Loader2, MapPin, Upload, Users } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Career, applyForCareer, getCareers } from "@/api/careers";
import { useToast } from "@/hooks/useToast";

type ApplicationForm = {
  name: string;
  email: string;
  phone?: string;
  coverLetter?: string;
};

type CvFile = {
  name: string;
  type: string;
  data: string;
};

function formatDate(date?: string) {
  if (!date) return "Open";
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function Careers() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [cvFile, setCvFile] = useState<CvFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ApplicationForm>();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getCareers();
        setJobs(response.jobs);
      } catch (error) {
        console.error("Error fetching careers:", error);
        toast({
          title: "Error",
          description: "Failed to load vacancies",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [toast]);

  const departments = useMemo(() => Array.from(new Set(jobs.map((job) => job.department).filter(Boolean))), [jobs]);

  function handleCvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2500000) {
      toast({
        title: "CV is too large",
        description: "Please upload a PDF/DOC file below 2.5MB.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCvFile({
        name: file.name,
        type: file.type || "application/octet-stream",
        data: String(reader.result || "")
      });
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: ApplicationForm) {
    if (!selectedJob || !cvFile) {
      toast({
        title: "CV required",
        description: "Please upload your CV before submitting.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const response = await applyForCareer(selectedJob._id, {
        ...data,
        cvName: cvFile.name,
        cvType: cvFile.type,
        cvData: cvFile.data
      });
      toast({
        title: "Application submitted",
        description: `${response.message} ${response.confirmationNumber}`
      });
      reset();
      setCvFile(null);
      setSelectedJob(null);
    } catch (error) {
      toast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "Failed to submit your application.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen py-20">
      <section className="container mx-auto px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Badge className="mb-5 bg-slate-950 text-white dark:bg-amber-300 dark:text-slate-950">Careers</Badge>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Build useful AI products with a team that ships.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Explore open vacancies at AI Solution and apply with your CV. We are looking for people who care about practical software, clean interfaces, and real customer outcomes.
            </p>
          </div>

          <div className="grid gap-4 rounded-lg border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-white/10 dark:bg-gray-900/60 sm:grid-cols-3">
            <Stat icon={<BriefcaseBusiness className="h-5 w-5" />} label="Open Roles" value={String(jobs.length)} />
            <Stat icon={<Users className="h-5 w-5" />} label="Departments" value={String(departments.length || 1)} />
            <Stat icon={<FileText className="h-5 w-5" />} label="CV Apply" value="Online" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <article key={job._id} className="grid gap-6 rounded-lg border border-slate-200 bg-white/85 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-gray-900/60 lg:grid-cols-[1fr_260px]">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{job.department}</Badge>
                    <Badge variant="outline">{job.employmentType}</Badge>
                    <Badge variant="outline">{job.experienceLevel}</Badge>
                  </div>
                  <h2 className="text-2xl font-black text-slate-950 dark:text-white">{job.title}</h2>
                  <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">{job.summary}</p>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <JobList title="Responsibilities" items={job.responsibilities} />
                    <JobList title="Requirements" items={job.requirements} />
                  </div>
                </div>

                <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-950/60">
                  <div className="space-y-4 text-sm">
                    <Info icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location} />
                    <Info icon={<Calendar className="h-4 w-4" />} label="Closing" value={formatDate(job.closingDate)} />
                    <Info icon={<BriefcaseBusiness className="h-4 w-4" />} label="Salary" value={job.salaryRange || "Discussed after screening"} />
                  </div>

                  <Dialog open={selectedJob?._id === job._id} onOpenChange={(open) => {
                    setSelectedJob(open ? job : null);
                    if (!open) setCvFile(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="mt-6 w-full bg-slate-950 text-white hover:bg-slate-800 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
                        Apply with CV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white dark:bg-slate-900">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.title}</DialogTitle>
                        <DialogDescription>Upload your CV and share a few details with the hiring team.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="career-name">Full Name *</Label>
                            <Input id="career-name" {...register("name", { required: "Name is required" })} className="mt-1" />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                          </div>
                          <div>
                            <Label htmlFor="career-email">Email *</Label>
                            <Input
                              id="career-email"
                              type="email"
                              {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                              })}
                              className="mt-1"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="career-phone">Phone</Label>
                          <Input id="career-phone" {...register("phone")} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="career-cover">Cover Letter</Label>
                          <Textarea id="career-cover" {...register("coverLetter")} className="mt-1 min-h-28" placeholder="Tell us why this role fits you..." />
                        </div>
                        <div>
                          <Label htmlFor="career-cv">CV / Resume *</Label>
                          <label className="mt-1 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
                            <input id="career-cv" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvUpload} />
                            <span className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              {cvFile ? cvFile.name : "Upload PDF, DOC, or DOCX under 2.5MB"}
                            </span>
                          </label>
                        </div>
                        <Button disabled={submitting}>
                          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Submit Application
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </aside>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white/80 p-10 text-center dark:border-white/10 dark:bg-gray-900/60">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">No vacancies right now</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Please check back soon for new roles.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="mb-3 text-slate-500">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function JobList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 font-black text-slate-950 dark:text-white">{title}</h3>
      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {(items || []).slice(0, 4).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-950 dark:bg-amber-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-slate-500">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

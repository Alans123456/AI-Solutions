import { useEffect, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CareerApplication, getCareerApplications } from "@/api/careers";

export function AdminApplications() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getCareerApplications();
        setApplications(response.applications);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  function openCv(application: CareerApplication) {
    const link = document.createElement("a");
    link.href = application.cvData;
    link.download = application.cvName;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.click();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Career Applications</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Review submitted candidate details and download CV files.
        </p>
      </div>

      {notice && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice}
        </div>
      )}

      <Card className="honey-panel border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white">
            <FileText className="h-5 w-5" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 py-14 text-sm text-slate-500 dark:border-white/10">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading applications...
            </div>
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application._id} className="honey-card grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-950 dark:text-white">{application.name}</h3>
                      <Badge>{application.status || "New"}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {application.careerTitle} · {application.email} {application.phone ? `· ${application.phone}` : ""}
                    </p>
                    {application.coverLetter && (
                      <p className="mt-3 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                        {application.coverLetter}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      Submitted {new Date(application.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-xl" onClick={() => openCv(application)}>
                    <Download className="mr-2 h-4 w-4" />
                    CV
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 py-14 text-center text-sm text-slate-500 dark:border-white/10">
              No applications submitted yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

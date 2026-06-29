import { useEffect, useState } from "react";
import { ExternalLink, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getProjects, Project } from "@/api/projects";
import { useToast } from "@/hooks/useToast";

const industries = ["All", "E-commerce", "Healthcare", "Finance", "Technology"]; // Product page cards dark bg matches Home card tone

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log("Fetching projects...");
        const response = (await getProjects()) as { projects: Project[] };
        setProjects(response.projects);
        setFilteredProjects(response.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  useEffect(() => {
    let filtered = projects;

    if (selectedIndustry !== "All") {
      filtered = filtered.filter(
        (project) => project.industry === selectedIndustry,
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    setFilteredProjects(filtered);
  }, [selectedIndustry, searchTerm, projects]);

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
                  <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-gray-800/60 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded w-16"></div>
                    <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded w-20"></div>
                  </div>
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
            Our Projects
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Explore our portfolio of successful projects and see how we've
            helped businesses transform through technology
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? "default" : "outline"}
                onClick={() => setSelectedIndustry(industry)}
                className={
                  selectedIndustry === industry
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                    : ""
                }
              >
                {industry}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project._id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-white dark:bg-slate-800 max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          {project.title}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          {project.description}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${project.title} screenshot ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                              Challenge
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300">
                              {project.challenge}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                              Solution
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300">
                              {project.solution}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="outline">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {project.testimonial && (
                          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Client Testimonial
                            </h4>
                            <p className="text-slate-600 dark:text-slate-300 italic">
                              "{project.testimonial}"
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                              - {project.client}
                            </p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {project.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {project.industry}
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.technologies.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              No projects found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

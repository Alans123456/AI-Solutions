import { useEffect, useMemo, useState } from "react";
import { Globe, Smartphone, Cloud, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getServices, Service } from "@/api/services";
import { useToast } from "@/hooks/useToast";

const iconMap = {
  Globe,
  Smartphone,
  Cloud,
  Brain,
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = (await getServices()) as { services: Service[] };
        setServices(response.services);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

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
                className="bg-white dark:bg-gray-900/60 rounded-xl p-6 animate-pulse"
              >
                <div className="w-16 h-16 bg-slate-200 dark:bg-gray-800/60 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-gray-800/60 rounded mb-4"></div>
                <div className="h-10 bg-slate-200 dark:bg-gray-800/60 rounded"></div>
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
            Our Services
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive software solutions designed to transform your business
            and drive growth in the digital age
          </p>
        </div>

        {/* Category sections */}
        {categories.map((category) => {
          const servicesInCategory = services.filter(
            (s) => s.category === category,
          );

          return (
            <div key={category} className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {category}
                </h2>
                <Badge variant="secondary">
                  {servicesInCategory.length} items
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesInCategory.map((service) => {
                  const IconComponent =
                    iconMap[service.icon as keyof typeof iconMap] || Globe;

                  return (
                    <Card
                      key={service._id}
                      className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg"
                    >
                      <CardHeader>
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                            {service.title}
                          </CardTitle>
                          <Badge variant="secondary">{service.category}</Badge>
                        </div>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                              Technologies:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {service.technologies.map((tech) => (
                                <Badge
                                  key={tech}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-300">
                            <strong>Starting from:</strong> {service.pricing}
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full group-hover:bg-blue-600 transition-colors">
                                Learn More
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white dark:bg-slate-800">
                              <DialogHeader>
                                <DialogTitle className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <IconComponent className="h-6 w-6 text-white" />
                                  </div>
                                  <span>{service.title}</span>
                                </DialogTitle>
                                <DialogDescription className="text-base">
                                  {service.description}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                    Key Features:
                                  </h4>
                                  <ul className="space-y-2">
                                    {service.features.map((feature, index) => (
                                      <li
                                        key={index}
                                        className="flex items-center space-x-2"
                                      >
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="text-slate-600 dark:text-slate-300">
                                          {feature}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                                    Technologies Used:
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {service.technologies.map((tech) => (
                                      <Badge key={tech} variant="outline">
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="pt-4 border-t">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                      {service.pricing}
                                    </span>
                                    <Link to="/contact">
                                      <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30">
                                        Get Quote
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <div className="text-center text-slate-600 dark:text-slate-300">
            No services found.
          </div>
        )}
      </div>
    </div>
  );
}

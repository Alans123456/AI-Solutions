import { useEffect, useState } from "react";
import { Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getTestimonials, Testimonial } from "@/api/testimonials";
import { useToast } from "@/hooks/useToast";

const filters = [
  "All",
  "5 Stars",
  "Technology",
  "Healthcare",
  "E-commerce",
  "Finance",
];
const serviceTypes = [
  "All Services",
  "Web Development",
  "Mobile Development",
  "Cloud Solutions",
  "AI/ML Solutions",
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<
    Testimonial[]
  >([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedService, setSelectedService] = useState("All Services");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log("Fetching testimonials...");
        const response = (await getTestimonials()) as {
          testimonials: Testimonial[];
        };
        setTestimonials(response.testimonials);
        setFilteredTestimonials(response.testimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        toast({
          title: "Error",
          description: "Failed to load testimonials",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [toast]);

  useEffect(() => {
    let filtered = testimonials;

    if (selectedFilter === "5 Stars") {
      filtered = filtered.filter((testimonial) => testimonial.rating === 5);
    } else if (selectedFilter !== "All") {
      filtered = filtered.filter(
        (testimonial) => testimonial.industry === selectedFilter,
      );
    }

    if (selectedService !== "All Services") {
      filtered = filtered.filter(
        (testimonial) => testimonial.serviceType === selectedService,
      );
    }

    setFilteredTestimonials(filtered);
  }, [selectedFilter, selectedService, testimonials]);

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-slate-200 dark:bg-gray-800/60 rounded w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 dark:bg-gray-800/60 rounded w-[600px] mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900/60 rounded-xl p-6 animate-pulse"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-800/60 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-gray-800/60 rounded mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-gray-800/60 rounded"></div>
                  </div>
                </div>
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
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
            Client Testimonials
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Hear what our clients have to say about their experience working
            with us
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center mr-2">
              <Filter className="h-4 w-4 mr-1" />
              Industry:
            </span>
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className={
                  selectedFilter === filter
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                    : ""
                }
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center mr-2">
              Service:
            </span>
            {serviceTypes.map((service) => (
              <Button
                key={service}
                variant={selectedService === service ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedService(service)}
                className={
                  selectedService === service
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                    : ""
                }
              >
                {service}
              </Button>
            ))}
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <Card
              key={testimonial._id}
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-lg"
            >
              <CardContent className="p-6">
                {/* Header with client info */}
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={testimonial.clientImage}
                      alt={testimonial.clientName}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      {testimonial.clientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.clientName}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.clientTitle}, {testimonial.clientCompany}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                    {testimonial.rating}/5
                  </span>
                </div>

                {/* Testimonial text */}
                <blockquote className="text-slate-700 dark:text-slate-300 mb-4 italic">
                  "{testimonial.testimonial}"
                </blockquote>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {testimonial.industry}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.serviceType}
                  </Badge>
                </div>

                {/* Date */}
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(testimonial.date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              No testimonials found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

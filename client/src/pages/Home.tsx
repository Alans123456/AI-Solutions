import { HeroSection } from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { StatsSection } from "@/components/home/StatsSection";

export function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      {/* Ensure the HeroSection is at the top and covers the full viewport height */}
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Cpu,
  ShieldCheck,
  Rocket,
  Sparkles,
  Zap,
  LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-transparent">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-transparent blur-3xl"></div>

      {/* Main dramatic light beam from right */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-400/30 via-blue-500/10 via-slate-400/5 to-transparent opacity-80 transform rotate-12 scale-150"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/10 via-blue-300/8 via-slate-300/3 to-transparent opacity-60 transform -rotate-6 scale-125"></div>
      </div>

      {/* Flowing smoke streams */}
      <div className="absolute inset-0">
        {/* Large flowing smoke from right to left */}
        <div className="absolute top-1/4 right-0 w-[120%] h-[200px] bg-gradient-to-l from-slate-300/20 via-slate-400/8 via-gray-500/4 to-transparent blur-2xl transform -rotate-3 animate-pulse opacity-70"></div>
        <div className="absolute top-1/2 right-0 w-[130%] h-[300px] bg-gradient-to-l from-blue-200/15 via-slate-300/6 via-gray-400/3 to-transparent blur-3xl transform rotate-2 animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute bottom-1/4 right-0 w-[110%] h-[250px] bg-gradient-to-l from-white/12 via-slate-200/5 via-gray-300/2 to-transparent blur-2xl transform -rotate-1 animate-pulse delay-2000 opacity-50"></div>
      </div>

      {/* Particle streams */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              right: `${Math.random() * 30}%`,
              top: `${Math.random() * 100}%`,
              animation: `drift ${6 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          ></div>
        ))}
      </div>

      {/* Volumetric light rays */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute right-0 origin-right opacity-20"
            style={{
              top: `${20 + i * 10}%`,
              width: "150%",
              height: "2px",
              background: `linear-gradient(to left, rgba(255,255,255,0.3) 0%, rgba(148,163,184,0.2) 30%, rgba(100,116,139,0.1) 60%, transparent 100%)`,
              transform: `rotate(${-15 + i * 4}deg)`,
              filter: "blur(1px)",
              animation: `shimmer ${
                4 + Math.random() * 2
              }s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  color: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  color,
}: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="group relative bg- backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 hover:bg-black/60 transition-all duration-500 hover:scale-105 hover:border-gray-700/60">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-gray-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative z-10">
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-7 h-7 text-white " />
          </div>

          <h4 className="text-xl font-bold text-gray-500 mb-2 group-hover:text-gray-300 transition-colors duration-500">
            {title}
          </h4>

          <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Text Animation Component
interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedText = ({ children, delay = 0 }: AnimatedTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

// Main About Section Component
const AboutSection = () => {
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTitleVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: BrainCircuit,
      title: "Cognitive AI",
      description:
        "Advanced neural networks that think, learn, and evolve with unprecedented intelligence.",
      color: "from-purple-600 to-pink-600",
      delay: 400,
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      description:
        "Lightning-fast processing at the edge, bringing AI closer to your data than ever before.",
      color: "from-blue-600 to-cyan-600",
      delay: 600,
    },
    {
      icon: ShieldCheck,
      title: "Quantum Security",
      description:
        "Next-generation encryption and privacy protocols that protect your most sensitive information.",
      color: "from-green-600 to-emerald-600",
      delay: 800,
    },
    {
      icon: Rocket,
      title: "Infinite Scale",
      description:
        "Seamlessly expand across galaxies of data with our revolutionary scaling architecture.",
      color: "from-orange-600 to-red-600",
      delay: 1000,
    },
  ];

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      <AnimatedBackground />

      {/* Add floating animation keyframe */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(0.5deg); }
          50% { transform: translate(-5px, -15px) rotate(-0.5deg); }
          75% { transform: translate(-10px, 5px) rotate(0.5deg); }
        }
        
        @keyframes drift {
          0% { transform: translateX(0) translateY(0); opacity: 1; }
          50% { opacity: 0.3; }
          100% { transform: translateX(-200vw) translateY(-20px); opacity: 0; }
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left Side - Content */}
          <div className="space-y-8 text-left">
            {/* Main Title */}
            <AnimatedText delay={100}>
              <div className="relative">
                <h1
                  className={`text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-600 via-blue-200 to-indigo-300 transform transition-all duration-1000 ${
                    titleVisible
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                  }`}
                >
                  AI Solution
                </h1>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>
            </AnimatedText>

            {/* Subtitle */}
            <AnimatedText delay={300}>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-500 dark:text-gray-100 leading-tight">
                The Future of{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Artificial Intelligence
                </span>
              </h2>
            </AnimatedText>

            {/* Description */}
            <AnimatedText delay={500}>
              <div className="space-y-4">
                <p className="text-xl text-gray-500 leading-relaxed">
                  We help companies add AI into products they already depend on
                  and create complete AI-first products from the ground up. Our
                  team connects strategy, automation, model integration, and
                  polished user experience into production-ready solutions.
                </p>

                <div className="flex items-center space-x-2 text-gray-400">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Practical AI integration and end-to-end AI product delivery
                  </span>
                </div>
              </div>
            </AnimatedText>

            {/* CTA Button */}
            <AnimatedText delay={700}>
              <Link
                to="/services"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full border border-indigo-400/30 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 hover:border-indigo-500"
              >
                <span className="relative z-10">Explore AI</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-500" />
              </Link>
            </AnimatedText>
          </div>

          {/* Right Side - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-gray-900/20 to-transparent blur-3xl"></div>
    </section>
  );
};

export default AboutSection;

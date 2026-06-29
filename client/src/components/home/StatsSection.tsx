"use client";

import { Users, Briefcase, Award, Clock, Zap, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Users,
    label: "Happy Clients",
    value: "150+",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Briefcase,
    label: "Projects",
    value: "300+",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-600 dark:text-slate-300",
  },
  {
    icon: Award,
    label: "Awards",
    value: "25",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Clock,
    label: "Years",
    value: "12",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Zap,
    label: "Solutions",
    value: "75+",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: Sparkles,
    label: "Innovations",
    value: "42+",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
];

// Triple the array so the seamless loop never shows a gap
const repeated = [...stats, ...stats, ...stats];

export function StatsSection() {
  return (
    <section className="relative py-16 overflow-hidden ">
      {/* Subtle radial glow — CSS only, no JS */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div className="h-72 w-72 rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Quantifying excellence through measurable achievements and
            continuous innovation
          </p>
        </div>

        {/* Ticker */}
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="flex gap-4 w-max"
            style={{
              animation: "stats-ticker 30s linear infinite",
            }}
          >
            {repeated.map((stat, idx) => {
              const Icon = stat.icon;
              // Stagger the rotateY spin per card
              const delay = `${-((idx % stats.length) * 1.4).toFixed(1)}s`;
              return (
                <div
                  key={idx}
                  className="min-w-[160px] flex flex-col items-center gap-2 px-5 py-5 rounded-xl
                             border border-gray-200 dark:border-gray-800
                             bg-white/80 dark:bg-gray-900/80
                             shadow-sm"
                  style={{
                    animation: `stats-spinX 8s ease-in-out ${delay} infinite`,
                    willChange: "transform",
                  }}
                >
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 tracking-wide">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pure CSS keyframes — no Framer Motion needed */}
      <style>{`
        @keyframes stats-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes stats-spinX {
          0%, 100% { transform: rotateY(0deg); }
          50%       { transform: rotateY(14deg); }
        }
      `}</style>
    </section>
  );
}

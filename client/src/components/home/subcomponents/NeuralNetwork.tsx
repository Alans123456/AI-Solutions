import React, { useRef, useEffect } from "react";

export const NeuralNetwork: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Neural network setup could be implemented here if needed
    return () => {};
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 w-full h-full opacity-30"
      style={{ mixBlendMode: "screen" }}
    >
      <defs>
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Neural network connections */}
      {Array.from({ length: 30 }, (_, i) => (
        <line
          key={i}
          x1={`${Math.random() * 100}%`}
          y1={`${Math.random() * 100}%`}
          x2={`${Math.random() * 100}%`}
          y2={`${Math.random() * 100}%`}
          stroke="url(#nodeGradient)"
          strokeWidth="1"
          opacity="0.3"
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}

      {/* Neural network nodes */}
      {Array.from({ length: 15 }, (_, i) => (
        <circle
          key={i}
          cx={`${Math.random() * 100}%`}
          cy={`${Math.random() * 100}%`}
          r="4"
          fill="url(#nodeGradient)"
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
};

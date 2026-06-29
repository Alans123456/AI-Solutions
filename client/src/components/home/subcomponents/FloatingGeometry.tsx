import React, { useState, useEffect } from "react";

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  color: string;
  shape: "circle" | "triangle" | "square" | "hexagon";
}

export const FloatingGeometry: React.FC = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    const newShapes: FloatingShape[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      rotation: Math.random() * 360,
      speed: Math.random() * 0.5 + 0.2,
      color: ["#6366F1", "#8B5CF6", "#3B82F6", "#06B6D4", "#10B981"][
        Math.floor(Math.random() * 5)
      ],
      shape: ["circle", "triangle", "square", "hexagon"][
        Math.floor(Math.random() * 4)
      ] as FloatingShape["shape"],
    }));
    setShapes(newShapes);
  }, []);

  const getShapeElement = (shape: FloatingShape) => {
    const baseClasses = "absolute opacity-20 animate-pulse";
    const style = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      transform: `rotate(${shape.rotation}deg)`,
      animation: `float ${4 + shape.speed * 4}s ease-in-out infinite, rotate ${
        10 + shape.speed * 10
      }s linear infinite`,
    };

    switch (shape.shape) {
      case "circle":
        return (
          <div
            key={shape.id}
            className={`${baseClasses} rounded-full`}
            style={{
              ...style,
              background: `radial-gradient(circle, ${shape.color}40, transparent)`,
              border: `2px solid ${shape.color}60`,
            }}
          />
        );
      case "triangle":
        return (
          <div
            key={shape.id}
            className={baseClasses}
            style={{
              ...style,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}40`,
            }}
          />
        );
      case "square":
        return (
          <div
            key={shape.id}
            className={`${baseClasses} rounded-lg`}
            style={{
              ...style,
              background: `linear-gradient(45deg, ${shape.color}40, transparent)`,
              border: `2px solid ${shape.color}60`,
            }}
          />
        );
      case "hexagon":
        return (
          <div
            key={shape.id}
            className={baseClasses}
            style={{
              ...style,
              background: `${shape.color}40`,
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {shapes.map(getShapeElement)}
      </div>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) rotate(3deg);
          }
          50% {
            transform: translateY(-15px) rotate(0deg);
          }
          75% {
            transform: translateY(-20px) rotate(-3deg);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

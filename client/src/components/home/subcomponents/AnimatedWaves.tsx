import React, { useRef, useEffect } from "react";

export const AnimatedWaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      timeRef.current += 0.02;

      // Clear frame depending on current theme to keep wave animation visible
      // in both light and dark mode.
      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark
        ? "rgba(0, 0, 0, 0.02)"
        : "rgba(255, 255, 255, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw multiple wave layers
      const colors = [
        "rgba(99, 102, 241, 0.3)",
        "rgba(139, 92, 246, 0.2)",
        "rgba(59, 130, 246, 0.25)",
      ];

      colors.forEach((color, index) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const amplitude = 50 + index * 20;
        const frequency = 0.01 + index * 0.005;
        const offset = (index * Math.PI) / 3;

        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin(x * frequency + timeRef.current + offset) * amplitude +
            Math.sin(x * frequency * 2 + timeRef.current * 1.5 + offset) *
              (amplitude / 3);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

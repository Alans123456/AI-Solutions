"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export function HoneycombBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const [resolvedDark, setResolvedDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setResolvedDark(isDark);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const isInitialDark = typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false;

  // Track current colors and interpolate them towards target colors for a premium smooth transition
  const colorsRef = useRef({
    r: isInitialDark ? 255 : 0,
    g: isInitialDark ? 255 : 0,
    b: isInitialDark ? 255 : 0,
    targetR: isInitialDark ? 255 : 0,
    targetG: isInitialDark ? 255 : 0,
    targetB: isInitialDark ? 255 : 0,
  });

  useEffect(() => {
    if (resolvedDark) {
      colorsRef.current.targetR = 255;
      colorsRef.current.targetG = 255;
      colorsRef.current.targetB = 255;
    } else {
      colorsRef.current.targetR = 0;
      colorsRef.current.targetG = 0;
      colorsRef.current.targetB = 0;
    }
  }, [resolvedDark]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Handle Resize using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        for (const entry of entries) {
          const { width: entryWidth, height: entryHeight } = entry.contentRect;
          width = entryWidth;
          height = entryHeight;
          canvas.width = entryWidth;
          canvas.height = entryHeight;
        }
      });
    });

    resizeObserver.observe(container);

    // Track mouse move globally on window to prevent interaction hijacking
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();

      // Calculate coordinates relative to the background container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Apply coordinates if mouse is actually over the page bounds
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseRef.current.targetX = x;
        mouseRef.current.targetY = y;
      } else {
        mouseRef.current.targetX = -1000;
        mouseRef.current.targetY = -1000;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Initial mouse coordinate centered/inactive
    mouseRef.current.targetX = -1000;
    mouseRef.current.targetY = -1000;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;

    // Drawing helper for a single hexagon
    const drawHexagon = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      alpha: number,
      highlightFactor: number,
      colorRGB: string,
    ) => {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.closePath();

      // Draw subtle fill if highlighted
      if (highlightFactor > 0) {
        context.fillStyle = `rgba(${colorRGB}, ${0.08 * highlightFactor})`;
        context.fill();
      }

      // Draw border
      if (highlightFactor > 0) {
        // Blended transition to fully lit golden highlights starting from base visibility
        const activeAlpha = 0.35 + 0.45 * highlightFactor;
        context.strokeStyle = `rgba(${colorRGB}, ${activeAlpha})`;
        context.lineWidth = 1 + highlightFactor * 1.5;
      } else {
        context.strokeStyle = `rgba(${colorRGB}, ${alpha})`;
        context.lineWidth = 1;
      }
      context.stroke();
    };

    // Animation Loop
    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation for color values
      const colors = colorsRef.current;
      colors.r += (colors.targetR - colors.r) * 0.08;
      colors.g += (colors.targetG - colors.g) * 0.08;
      colors.b += (colors.targetB - colors.b) * 0.08;
      const colorRGB = `${Math.round(colors.r)}, ${Math.round(colors.g)}, ${Math.round(colors.b)}`;

      // Smooth interpolation for mouse movement (inertia)
      const mouse = mouseRef.current;
      if (mouse.targetX === -1000) {
        // Slow return to dormant inactive coordinate
        mouse.x += (width / 2 - mouse.x) * 0.05;
        mouse.y += (height / 2 - mouse.y) * 0.05;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      // 1. Draw Glow Spot under cursor for immersive layout and feel
      if (mouse.targetX !== -1000) {
        const glowRad = 240;
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRad,
        );
        gradient.addColorStop(0, `rgba(${colorRGB}, 0.09)`);
        gradient.addColorStop(0.5, `rgba(${colorRGB}, 0.045)`);
        gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw large cozy ambient background spots
      // Circle A floating left-top
      const circleAX = width * 0.2 + Math.sin(Date.now() * 0.0002) * 50;
      const circleAY = height * 0.3 + Math.cos(Date.now() * 0.0003) * 50;
      const gradientA = ctx.createRadialGradient(
        circleAX,
        circleAY,
        0,
        circleAX,
        circleAY,
        width * 0.3,
      );
      gradientA.addColorStop(0, `rgba(${colorRGB}, 0.03)`);
      gradientA.addColorStop(1, `rgba(${colorRGB}, 0)`);
      ctx.fillStyle = gradientA;
      ctx.beginPath();
      ctx.arc(circleAX, circleAY, width * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Circle B floating right-bottom
      const circleBX = width * 0.8 + Math.cos(Date.now() * 0.00015) * 60;
      const circleBY = height * 0.7 + Math.sin(Date.now() * 0.00025) * 60;
      const gradientB = ctx.createRadialGradient(
        circleBX,
        circleBY,
        0,
        circleBX,
        circleBY,
        width * 0.35,
      );
      gradientB.addColorStop(0, `rgba(${colorRGB}, 0.02)`);
      gradientB.addColorStop(1, `rgba(${colorRGB}, 0)`);
      ctx.fillStyle = gradientB;
      ctx.beginPath();
      ctx.arc(circleBX, circleBY, width * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // 2. Hexagonal Grid Parameters
      const size = 32; // radius of hexagon
      const hexWidth = size * Math.sqrt(3);
      const hexHeight = size * 2;
      const spacingX = hexWidth;
      const spacingY = hexHeight * 0.75;

      const cols = Math.ceil(width / spacingX) + 2;
      const rows = Math.ceil(height / spacingY) + 2;

      // Subtle parallax shift based on mouse coordinate relative to screen center
      const parallaxX = (mouse.x - width / 2) * 0.03;
      const parallaxY = (mouse.y - height / 2) * 0.03;

      for (let r = -1; r < rows; r++) {
        const offsetLeft = (r % 2) * (hexWidth / 2);
        for (let c = -1; c < cols; c++) {
          // Standard coordinates
          const baseX = c * spacingX + offsetLeft + parallaxX;
          const baseY = r * spacingY + parallaxY;

          // Compute distance to interpolated mouse cursor
          const dx = mouse.x - baseX;
          const dy = mouse.y - baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Highlight factor range from 0 to 1
          const hoverHorizon = 190;
          let highlightFactor = 0;
          if (distance < hoverHorizon) {
            highlightFactor = 1 - distance / hoverHorizon;
            // Apply exponential curve for smoother falloff
            highlightFactor = Math.pow(highlightFactor, 1.6);
          }

          // Render hexagon with tiny physics displacement away from cursor!
          let finalX = baseX;
          let finalY = baseY;

          if (distance < hoverHorizon && distance > 10) {
            // Push outwards slightly mapping interactive honeycomb feedback physics
            const force = (hoverHorizon - distance) * 0.055;
            finalX -= (dx / distance) * force;
            finalY -= (dy / distance) * force;
          }

          // Grid base outline opacity mapping
          // Draw denser centers or randomize tiny grid alpha to keep organic texture, but let's use a gorgeous base
          const baseOutlineAlpha = 0.12; // balanced visible, elegant, non-slop background

          drawHexagon(
            ctx,
            finalX,
            finalY,
            size - 1,
            baseOutlineAlpha,
            highlightFactor,
            colorRGB,
          );
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-transparent"
      id="framer-modern-bg"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none opacity-[0.9]"
      />
    </div>
  );
}

interface HexagonInteractiveProps {
  size?: number;
  labelEn?: string;
  labelNe?: string;
  isNepali?: boolean;
  icon?: React.ReactNode;
  titleEn: string;
  titleNe: string;
  descEn: string;
  descNe: string;
}

export function InteractiveHexagon({
  icon,
  titleEn,
  titleNe,
  descEn,
  descNe,
  isNepali = false,
}: HexagonInteractiveProps) {
  const [hovered, setHovered] = useState(false);

  // Group themes to match professional IT fields
  const getTheme = () => {
    const titleLower = titleEn.toLowerCase();
    if (
      titleLower.includes("cyber") ||
      titleLower.includes("hacker") ||
      titleLower.includes("ethical")
    ) {
      return {
        accent: "from-emerald-600 to-teal-500",
        startHex: "#059669",
        endHex: "#14b8a6",
        borderColor: "group-hover:border-emerald-500/50",
        glowBg: "bg-emerald-500/[0.04]",
        iconTheme:
          "bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
        textTheme: "group-hover:text-emerald-700",
        badge: "text-emerald-700 bg-emerald-50 border-emerald-200/50",
      };
    }
    if (
      titleLower.includes("cloud") ||
      titleLower.includes("aws") ||
      titleLower.includes("network")
    ) {
      return {
        accent: "from-[#181613] to-[#f0c702]",
        startHex: "#181613",
        endHex: "#f0c702",
        borderColor: "group-hover:border-[#f0c702]/50",
        glowBg: "bg-[#f0c702]/[0.04]",
        iconTheme:
          "bg-yellow-50 border-yellow-100 text-[#f0c702] group-hover:bg-[#181613] group-hover:text-white",
        textTheme: "group-hover:text-amber-950",
        badge: "text-yellow-700 bg-yellow-50 border-[#f0c702]/50",
      };
    }
    if (
      titleLower.includes("diploma") ||
      titleLower.includes("academic") ||
      titleLower.includes("degree")
    ) {
      return {
        accent: "from-[#f0c702] to-[#e6be02]",
        startHex: "#f0c702",
        endHex: "#e6be02",
        borderColor: "group-hover:border-[#f0c702]/50",
        glowBg: "bg-[#f0c702]/[0.04]",
        iconTheme:
          "bg-yellow-50 border-yellow-100 text-[#f0c702] group-hover:bg-[#f0c702] group-hover:text-white",
        textTheme: "group-hover:text-yellow-950",
        badge: "text-yellow-700 bg-yellow-50 border-[#f0c702]/55",
      };
    }
    // Software & Programming
    return {
      accent: "from-[#f0c702] to-[#ffdb2a]",
      startHex: "#f0c702",
      endHex: "#ffdb2a",
      borderColor: "group-hover:border-[#f0c702]/50",
      glowBg: "bg-[#f0c702]/[0.02]",
      iconTheme:
        "bg-yellow-50 border-yellow-100 text-[#f0c702] group-hover:bg-[#f0c702] group-hover:text-white",
      textTheme: "group-hover:text-yellow-900",
      badge: "text-yellow-700 bg-yellow-50/50 border-[#f0c702]/40",
    };
  };

  const theme = getTheme();

  return (
    <motion.div
      className="relative cursor-pointer group select-none py-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      id={`interactive-hex-${titleEn.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div
        className={`absolute inset-x-2 inset-y-4 ${theme.glowBg} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
      />

      <div
        className={`relative bg-white border border-slate-200 ${theme.borderColor} p-6.5 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden`}
        style={{
          boxShadow: hovered
            ? "0 16px 32px -12px rgba(240, 199, 2, 0.16), 0 1px 2px 0 rgba(0, 0, 0, 0.01)"
            : "0 2px 4px 0 rgba(0, 0, 0, 0.01)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />

        <div
          className={`absolute top-0 inset-x-0 h-[3.5px] bg-gradient-to-r ${theme.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        />

        <div className="flex flex-col items-center text-center relative z-10">
          <div
            className={`w-13 h-13 rounded-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 shadow-3xs
            ${hovered ? "text-white border-transparent" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
            style={{
              background: hovered
                ? `linear-gradient(135deg, ${theme.accent.split(" ")[1]}, ${theme.accent.split(" ")[3]})`
                : "",
            }}
          >
            {icon}
          </div>

          <h3
            className={`font-sans text-base font-extrabold text-slate-900 leading-snug ${theme.textTheme} transition-colors duration-300 mb-1.5 mt-3.5`}
          >
            {isNepali ? titleNe : titleEn}
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed min-h-[42px] max-w-[210px]">
            {isNepali ? descNe : descEn}
          </p>

          <span
            className={`mt-3 inline-flex items-center justify-center text-[9px] font-bold ${theme.badge} border px-2.5 py-0.5 rounded-full transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-3xs`}
          >
            {isNepali ? "थप विवरण हेर्नुहोस् →" : "Explore Track →"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

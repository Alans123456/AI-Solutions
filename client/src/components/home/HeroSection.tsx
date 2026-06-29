// src/components/hero/HeroSection.tsx
import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, Play, Sparkles, Zap, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedWaves } from "./subcomponents/AnimatedWaves";
import { FloatingGeometry } from "./subcomponents/FloatingGeometry";
import { NeuralNetwork } from "./subcomponents/NeuralNetwork";
import { InteractiveButton } from "../hero/subcomponents/InteractiveButton";

export const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleExploreClick = useCallback(() => {
    navigate("/services");
  }, [navigate]);

  const handleDemoClick = useCallback(() => {
    navigate("/projects");
  }, [navigate]);

  return (
    <section className="relative  overflow-hidden z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedWaves />
        <FloatingGeometry />
        <NeuralNetwork />

        {/* Static gradient overlays */}
        <div className="absolute inset-0  " />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 ">
        <div className="text-center max-w-7xl mx-auto">
          <div
            className={`inline-flex items-center px-6 py-3 rounded-full  border border-black/20 dark:border-white/20 mb-8 transform transition-all duration-1000 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex items-center ">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3 " />
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="dark:text-white text-gray-700 font-medium">
                AI Solution
              </span>
              <Zap className="w-4 h-4 text-blue-400 ml-2 animate-bounce" />
            </div>
          </div>

          <h1
            className={`text-5xl sm:text-7xl lg:text-8xl font-black dark:text-white text-gray-700 mb-8 leading-tight transform transition-all duration-1000 delay-300 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <span className="block mb-4">Transform Your</span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Digital Reality
            </span>
          </h1>

          <p
            className={`text-lg sm:text-xl lg:text-2xl dark:text-gray-300 text-gray-500 mb-16 max-w-4xl mx-auto leading-relaxed font-light transform transition-all duration-1000 delay-500 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            We add practical{" "}
            <span className="text-indigo-400 font-semibold">
              AI features
            </span>
            {" "}to the products your team already uses and build{" "}
            <span className="text-purple-400 font-semibold">
              complete AI products
            </span>
            {" "}with{" "}
            <span className="text-pink-400 font-semibold">
              production-ready automation
            </span>{" "}
            for teams ready to move faster.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 transform transition-all duration-1000 delay-700 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <InteractiveButton onClick={handleExploreClick} variant="primary">
              <Rocket className="w-5 h-5 mr-2 inline" />
              Launch Experience
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform duration-300" />
            </InteractiveButton>

            <InteractiveButton onClick={handleDemoClick} variant="secondary">
              <Play className="w-5 h-5 mr-2 inline" />
              Watch Innovation
            </InteractiveButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1300 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* <div className="flex flex-col items-center text-white/60 hover:text-white transition-colors duration-300 cursor-pointer group">
            <span className="text-sm mb-2 font-medium">Discover More</span>
            <div className="relative">
              <ChevronDown className="w-6 h-6 animate-bounce group-hover:animate-pulse" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div> */}
        </div>
      </div>

      {/* Gradient overlays (extra decoration) */}
      <div className="absolute inset-0  pointer-events-none" />
      <div className="absolute inset-0  pointer-events-none" />
    </section>
  );
};

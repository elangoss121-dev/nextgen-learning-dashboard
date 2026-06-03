"use client";

import React from "react";
import * as Icons from "lucide-react";
import { Course } from "@/types/course";
import { BentoGridItem } from "./bento-grid";
import { motion } from "framer-motion";

interface CourseCardProps {
  course: Course;
}

// Map of supported icon names to Lucide Icon components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2: Icons.Code2,
  Monitor: Icons.Monitor,
  FileCode: Icons.FileCode,
  Layers: Icons.Layers,
};

export default function CourseCard({ course }: CourseCardProps) {
  const { title, progress, icon_name } = course;
  
  // Resolve Lucide Icon or fallback to HelpCircle
  const IconComponent = ICON_MAP[icon_name] || Icons.HelpCircle;

  // Determine border glow color based on course progress for a custom aesthetic
  const glowClass = 
    progress >= 80 
      ? "glass-card-glow-cyan" 
      : progress >= 50 
        ? "glass-card-glow-indigo" 
        : "";

  return (
    <BentoGridItem className={`col-span-1 min-h-[190px] ${glowClass}`}>
      {/* Icon and status badge */}
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <IconComponent className="w-5 h-5" />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          progress >= 80 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : progress >= 50 
              ? "bg-purple-500/10 border-purple-500/20 text-purple-400" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        }`}>
          {progress >= 80 ? "Advanced" : progress >= 50 ? "Intermediate" : "Beginner"}
        </span>
      </div>

      {/* Title */}
      <div className="mt-5 space-y-4">
        <h3 className="font-bold text-base text-zinc-100 group-hover:text-white font-sans transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Progress Section */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500 font-sans">Progress</span>
            <span className="font-bold text-purple-400 font-sans">{progress}%</span>
          </div>
          
          {/* Progress Track */}
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            {/* Spring Animated Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: 0.1,
              }}
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 rounded-full"
            />
          </div>
        </div>
      </div>
    </BentoGridItem>
  );
}

"use client";

import React, { useState } from "react";
import { BarChart2, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface DayActivity {
  dayName: string;
  intensity: 0 | 1 | 2 | 3 | 4; // 0: None, 1: Low, 2: Mid, 3: High, 4: Max
  hours: number;
}

export default function ActivityTile() {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  // Generate 4 weeks (28 days) of mock data for our heatmap grid
  const days: DayActivity[] = [
    { dayName: "Mon", intensity: 1, hours: 1.5 },
    { dayName: "Tue", intensity: 2, hours: 3.0 },
    { dayName: "Wed", intensity: 0, hours: 0 },
    { dayName: "Thu", intensity: 4, hours: 6.5 },
    { dayName: "Fri", intensity: 3, hours: 4.2 },
    { dayName: "Sat", intensity: 2, hours: 2.5 },
    { dayName: "Sun", intensity: 1, hours: 1.0 },
    
    { dayName: "Mon", intensity: 2, hours: 2.8 },
    { dayName: "Tue", intensity: 3, hours: 4.0 },
    { dayName: "Wed", intensity: 1, hours: 1.2 },
    { dayName: "Thu", intensity: 0, hours: 0 },
    { dayName: "Fri", intensity: 2, hours: 3.0 },
    { dayName: "Sat", intensity: 4, hours: 7.0 },
    { dayName: "Sun", intensity: 2, hours: 2.0 },

    { dayName: "Mon", intensity: 3, hours: 4.5 },
    { dayName: "Tue", intensity: 1, hours: 1.5 },
    { dayName: "Wed", intensity: 2, hours: 2.5 },
    { dayName: "Thu", intensity: 3, hours: 4.8 },
    { dayName: "Fri", intensity: 1, hours: 1.0 },
    { dayName: "Sat", intensity: 0, hours: 0 },
    { dayName: "Sun", intensity: 3, hours: 5.0 },

    { dayName: "Mon", intensity: 4, hours: 6.0 },
    { dayName: "Tue", intensity: 2, hours: 3.2 },
    { dayName: "Wed", intensity: 3, hours: 4.5 },
    { dayName: "Thu", intensity: 1, hours: 1.5 },
    { dayName: "Fri", intensity: 2, hours: 2.5 },
    { dayName: "Sat", intensity: 3, hours: 5.2 },
    { dayName: "Sun", intensity: 4, hours: 6.8 },
  ];

  // Helper to resolve Tailwind classes for different heatmap intensities
  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 1: return "bg-purple-950/40 border border-purple-800/10";
      case 2: return "bg-purple-800/40 border border-purple-600/20";
      case 3: return "bg-purple-600/50 border border-purple-500/30";
      case 4: return "bg-purple-500 border border-purple-400/40 shadow-sm shadow-purple-500/20";
      default: return "bg-white/5 border border-white/5";
    }
  };

  return (
    <div className="flex flex-col justify-between h-full min-h-[220px]">
      <div>
        {/* Title row */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-300 font-sans flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>Activity Intensity</span>
          </h2>
          <span className="text-[10px] text-zinc-500 font-sans">Last 28 Days</span>
        </div>

        {/* Heatmap Grid */}
        <div className="relative">
          <div className="grid grid-cols-7 gap-2 my-2">
            {days.map((day, idx) => (
              <motion.div
                key={idx}
                className={`aspect-square w-full rounded-[4px] cursor-help transition-colors duration-200 ${getIntensityColor(
                  day.intensity
                )}`}
                whileHover={{ scale: 1.25, zIndex: 20 }}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              />
            ))}
          </div>

          {/* Tooltip Overlay */}
          <div className="h-6 flex items-center justify-center">
            {hoveredDay ? (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-medium text-purple-300 font-sans bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full"
              >
                {hoveredDay.dayName}: {hoveredDay.hours > 0 ? `${hoveredDay.hours} hours studied` : "No study sessions"}
              </motion.span>
            ) : (
              <span className="text-[10px] text-zinc-500 font-sans">Hover boxes to check study hours</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Metrics Row */}
      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
        {/* Total hours */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Study Hours</p>
            <p className="text-sm font-bold text-zinc-200 font-sans mt-0.5">82.5 hrs</p>
          </div>
        </div>

        {/* Completion Statistics */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-sans leading-none uppercase">Completed</p>
            <p className="text-sm font-bold text-zinc-200 font-sans mt-0.5">3 Courses</p>
          </div>
        </div>

        {/* Progress trend */}
        <div className="hidden sm:flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/10">
          <TrendingUp className="w-3 h-3" />
          <span className="text-[10px] font-bold font-sans">+12.4%</span>
        </div>
      </div>
    </div>
  );
}

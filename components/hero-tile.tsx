"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Flame, GraduationCap } from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
  "Make each day your masterpiece. Learn something new every hour.",
  "Excellence is not a act, but a habit. Keep pushing your limits.",
  "The beautiful thing about learning is nobody can take it away from you.",
  "Code is like humor. When you have to explain it, it’s bad. Keep it clean!",
];

export default function HeroTile() {
  const [quote, setQuote] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const streakCount = 12; // Sample streak count

  useEffect(() => {
    // Select a quote based on the day of the month so it is stable but rotates daily
    const day = new Date().getDate();
    const selectedQuote = MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];

    // Format current date: Wednesday, June 3, 2026
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = new Date().toLocaleDateString('en-US', options);

    const timer = setTimeout(() => {
      setQuote(selectedQuote);
      setCurrentDate(formattedDate);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[220px] flex flex-col justify-between overflow-hidden rounded-2xl">
      {/* Dynamic Animated Gradient Mesh Overlay */}
      <div className="gradient-mesh-hero animate-gradient-shift opacity-50 absolute inset-0 bg-[length:200%_200%]" />
      
      {/* Decorative floating shapes */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-50px] left-[30%] w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between p-6">
        <div>
          {/* Top Badge & Date Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Core</span>
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-sans">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>{currentDate || "Loading date..."}</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white font-sans">
            Welcome back, <span className="text-gradient-purple-indigo">Student</span>
          </h1>
          
          {/* Motivational Quote */}
          <p className="mt-3 text-sm text-zinc-400 font-sans italic max-w-xl line-clamp-2">
            &ldquo;{quote || "Loading daily motivation..."}&rdquo;
          </p>
        </div>

        {/* Footer Statistics Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
          <div className="flex gap-4">
            {/* Streak Counter */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-400"
              id="streak-badge"
            >
              <Flame className="w-4 h-4 fill-orange-400 animate-bounce" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 font-sans uppercase leading-none">Streak</p>
                <p className="text-xs font-bold font-sans">{streakCount} Days</p>
              </div>
            </motion.div>

            {/* Level Badge */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400"
              id="level-badge"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 font-sans uppercase leading-none">Rank</p>
                <p className="text-xs font-bold font-sans">Level 4</p>
              </div>
            </motion.div>
          </div>

          {/* Productivity Target */}
          <p className="text-xs text-zinc-500 font-sans">
            Next Level: <span className="text-zinc-300 font-semibold">120 XP needed</span>
          </p>
        </div>
      </div>
    </div>
  );
}

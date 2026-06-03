"use client";

import React from "react";
import { motion } from "framer-motion";

export function HeroTileSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 min-h-[220px] flex flex-col justify-between animate-pulse relative overflow-hidden">
      <div className="space-y-3">
        <div className="h-4 w-32 bg-white/5 rounded-md" />
        <div className="h-8 w-64 bg-white/10 rounded-md" />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
        <div className="flex gap-4">
          <div className="h-10 w-24 bg-white/5 rounded-xl" />
          <div className="h-10 w-36 bg-white/5 rounded-xl" />
        </div>
        <div className="h-5 w-44 bg-white/5 rounded-md" />
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 min-h-[180px] flex flex-col justify-between animate-pulse relative overflow-hidden">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-xl bg-white/5 w-11 h-11" />
        <div className="h-5 w-12 bg-white/5 rounded-full" />
      </div>
      <div className="space-y-3 mt-4">
        <div className="h-5 w-4/5 bg-white/10 rounded-md" />
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-3 w-10 bg-white/5 rounded-sm" />
            <div className="h-3 w-8 bg-white/5 rounded-sm" />
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ActivityTileSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 min-h-[220px] flex flex-col justify-between animate-pulse relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 w-32 bg-white/10 rounded-md" />
        <div className="h-5 w-20 bg-white/5 rounded-md" />
      </div>
      
      {/* Simulation of contribution grid dots */}
      <div className="grid grid-cols-7 gap-2.5 my-3">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="aspect-square bg-white/5 rounded-[3px] w-full" />
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
        <div className="h-8 w-24 bg-white/10 rounded-md" />
        <div className="h-8 w-24 bg-white/10 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonBentoGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto p-4 md:p-6"
    >
      {/* Hero Tile Skeleton: occupies 2 columns on desktop */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <HeroTileSkeleton />
      </div>

      {/* Activity Tile Skeleton: occupies 1 column */}
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <ActivityTileSkeleton />
      </div>

      {/* Course Skeletons: 4 cards */}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="col-span-1">
          <CourseCardSkeleton />
        </div>
      ))}
    </motion.div>
  );
}

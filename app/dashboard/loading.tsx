"use client";

import React from "react";
import Sidebar from "@/components/sidebar";
import { SkeletonBentoGrid } from "@/components/skeleton-card";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans">
      {/* Static Sidebar placeholder */}
      <Sidebar activeTab="dashboard" />

      {/* Main Content Area */}
      <div 
        className="flex-1 min-h-screen flex flex-col md:pl-20 lg:pl-64 pb-20 md:pb-6 transition-all duration-300"
        id="loading-viewport-container"
      >
        {/* Header Loading State */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-[#09090b]/40 backdrop-blur-md sticky top-0 z-30">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold font-sans">Student Portal</span>
            <div className="h-4 w-20 bg-white/5 rounded-md animate-pulse" />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block h-8 w-48 lg:w-64 bg-white/5 border border-white/5 rounded-xl animate-pulse" />
            <div className="h-8 w-8 bg-white/5 border border-white/5 rounded-xl animate-pulse" />
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 animate-pulse" />
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8">
          <SkeletonBentoGrid />
        </main>
      </div>
    </div>
  );
}

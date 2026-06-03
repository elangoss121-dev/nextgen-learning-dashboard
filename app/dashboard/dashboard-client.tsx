"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import { BentoGrid } from "@/components/bento-grid";
import HeroTile from "@/components/hero-tile";
import CourseCard from "@/components/course-card";
import dynamic from "next/dynamic";

const ActivityTile = dynamic(() => import("@/components/activity-tile"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse rounded-2xl bg-white/5 h-48 w-full" />
  ),
});

import { Course } from "@/types/course";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Search, 
  Award, 
  Clock, 
  Sparkles 
} from "lucide-react";

interface DashboardClientProps {
  initialCourses: Course[];
}

export default function DashboardClient({ initialCourses }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const courses = initialCourses;

  // Tab titles mapper for header
  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Overview";
      case "courses": return "My Courses";
      case "analytics": return "Performance Analytics";
      case "settings": return "Settings & Profile";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-[#fafafa] relative overflow-hidden font-sans">
      {/* Sidebar - fixed left positioning handles desktop/tablet sizes */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div 
        className="flex-1 min-h-screen flex flex-col md:pl-20 lg:pl-64 pb-20 md:pb-6 transition-all duration-300"
        id="main-viewport-container"
      >
        {/* Header Section */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-[#09090b]/40 backdrop-blur-md sticky top-0 z-30">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold font-sans">Student Portal</span>
            <h2 className="text-lg font-bold text-white font-sans mt-0.5 leading-none">
              {getTabTitle()}
            </h2>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-4">
            {/* Search Bar - hidden on small mobile screens */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl transition-all duration-200 w-48 lg:w-64 group">
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full font-sans"
                id="header-search-input"
              />
            </div>

            {/* Notifications Button */}
            <button 
              className="p-2 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 text-zinc-400 hover:text-white transition-all duration-200 relative group"
              id="notifications-btn"
            >
              <Bell className="w-4 h-4 group-hover:scale-110 duration-200" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#09090b]" />
            </button>

            {/* Header User Profile Image */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 border border-purple-400/20 text-white font-bold text-xs flex items-center justify-center">
              JD
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Tab View: Dashboard / Bento Grid */}
              {activeTab === "dashboard" && (
                <BentoGrid>
                  {/* Hero Tile - spans 3 columns on desktop, 2 on tablet, 1 on mobile */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 min-h-[220px] glass-card rounded-2xl relative overflow-hidden group">
                    <HeroTile />
                  </div>

                  {/* Activity Heatmap Tile - spans 1 column */}
                  <div className="col-span-1 md:col-span-2 lg:col-span-1 min-h-[220px] glass-card rounded-2xl relative overflow-hidden group p-6">
                    <ActivityTile />
                  </div>

                  {/* Course Cards */}
                  {courses.map((course, i) => (
                    <CourseCard key={course.id} course={course} index={i} />
                  ))}
                </BentoGrid>
              )}

              {/* Tab View: Courses */}
              {activeTab === "courses" && (
                <section className="max-w-5xl mx-auto space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-sans">Active Curriculums</h3>
                      <p className="text-xs text-zinc-500 mt-1">Manage your active learning modules and track milestones.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 font-sans">Sort by:</span>
                      <select 
                        className="bg-white/5 border border-white/5 hover:border-white/10 rounded-lg text-xs font-semibold px-3 py-1.5 text-zinc-200 focus:outline-none"
                        id="courses-sort-select"
                      >
                        <option value="progress">Progress (High-Low)</option>
                        <option value="recent">Recently Added</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {courses.map((course, i) => (
                      <CourseCard key={course.id} course={course} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {/* Tab View: Analytics */}
              {activeTab === "analytics" && (
                <section className="max-w-5xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-sans">Learning Analytics</h3>
                    <p className="text-xs text-zinc-500 mt-1">Deep analysis of study routines, weekly trends, and target completions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                      <div className="gradient-mesh opacity-20" />
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 font-sans leading-none uppercase">Time on Screen</p>
                          <p className="text-2xl font-black text-white font-sans mt-1">320 hrs</p>
                          <p className="text-[10px] text-emerald-400 font-sans mt-0.5">+4.2% from last month</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                      <div className="gradient-mesh opacity-20" />
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 font-sans leading-none uppercase">Completion Rate</p>
                          <p className="text-2xl font-black text-white font-sans mt-1">78.5%</p>
                          <p className="text-[10px] text-emerald-400 font-sans mt-0.5">+1.5% from last week</p>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                      <div className="gradient-mesh opacity-20" />
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 font-sans leading-none uppercase">Estimated Milestones</p>
                          <p className="text-2xl font-black text-white font-sans mt-1">14 Passed</p>
                          <p className="text-[10px] text-purple-400 font-sans mt-0.5">Next in 4 days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="gradient-mesh opacity-10" />
                    <div className="relative z-10 space-y-4">
                      <h4 className="text-sm font-semibold tracking-wide text-zinc-300 font-sans">Monthly Learning Hours Trend</h4>
                      <div className="h-64 flex items-end gap-3 pt-6 border-b border-white/5 px-2">
                        {[40, 55, 30, 80, 65, 45, 95, 70, 85, 110, 90, 120].map((height, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                            <div className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-sans font-bold mb-1">
                              {height}h
                            </div>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(height / 120) * 80}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 }}
                              className="w-full bg-gradient-to-t from-indigo-500/80 via-purple-500/80 to-cyan-500/80 rounded-t-md hover:brightness-125 transition-all duration-300 shadow-md shadow-purple-500/5 cursor-pointer"
                            />
                            <span className="text-[9px] text-zinc-600 font-sans mt-2">
                              {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Tab View: Settings */}
              {activeTab === "settings" && (
                <section className="max-w-2xl mx-auto glass-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="gradient-mesh opacity-20" />
                  <div className="relative z-10 space-y-6">
                    <div className="border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold text-white font-sans">Account Preferences</h3>
                      <p className="text-xs text-zinc-500 mt-1">Configure layout preferences, API variables, and system values.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-sans font-semibold">Student Name</label>
                        <input 
                          type="text" 
                          defaultValue="John Doe"
                          className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-sans transition-colors"
                          id="settings-name-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-sans font-semibold">Student Email Address</label>
                        <input 
                          type="email" 
                          defaultValue="john.doe@university.edu"
                          className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-sans transition-colors"
                          id="settings-email-input"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400 font-sans font-semibold">Dashboard Style</label>
                        <select 
                          className="w-full bg-white/5 border border-white/5 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none font-sans transition-colors"
                          id="settings-style-select"
                        >
                          <option value="cyberpunk">Aether (Dark Mode / Glassmorphism)</option>
                          <option value="classic" disabled>Light Mode (Unavailable - Aether theme only)</option>
                        </select>
                      </div>

                      <div className="pt-4">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold font-sans shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:brightness-110 transition-all duration-300"
                          onClick={() => alert("Settings preferences saved successfully!")}
                          id="save-settings-btn"
                        >
                          Save Profile Settings
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Cpu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Sidebar({ activeTab: externalActiveTab, onTabChange }: SidebarProps) {
  const [localActiveTab, setLocalActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeTab = externalActiveTab || localActiveTab;
  const setActiveTab = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setLocalActiveTab(tabId);
    }
  };

  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "courses", name: "Courses", icon: BookOpen },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Sidebar (Hidden on Mobile) */}
      <nav 
        className={`hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 bg-[#09090b]/80 backdrop-blur-xl transition-all duration-300 ease-in-out z-40
          ${isCollapsed ? "w-20" : "w-20 lg:w-64"}`}
        id="desktop-sidebar"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-lg tracking-wider bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent uppercase font-sans whitespace-nowrap"
              >
                Aether
              </motion.span>
            )}
          </div>
          
          {/* Collapse toggle button for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            id="sidebar-toggle-btn"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 py-6 px-3 space-y-1.5 flex flex-col justify-between">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-colors relative group duration-200
                      ${isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                    id={`nav-${item.id}`}
                  >
                    {/* Active highlight background */}
                    {isActive && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    {/* Navigation Icon */}
                    <Icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110 duration-200 
                      ${isActive ? "text-purple-400" : "text-zinc-400"}`} />
                    
                    {/* Label - visible on desktop and when not collapsed */}
                    <span className={`relative z-10 font-sans transition-opacity duration-300 whitespace-nowrap
                      ${isCollapsed ? "hidden" : "inline lg:inline md:hidden"}`}>
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer User Widget */}
          <div className="p-2 border-t border-white/5 pt-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white border border-purple-400/20 shrink-0">
                JD
              </div>
              {!isCollapsed && (
                <div className="hidden lg:block overflow-hidden whitespace-nowrap text-ellipsis">
                  <p className="text-xs font-semibold text-zinc-200">John Doe</p>
                  <p className="text-[10px] text-zinc-500">Pro Student</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar (Visible only on Mobile) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090b]/90 border-t border-white/5 backdrop-blur-xl flex items-center justify-around px-4 z-40 pb-safe"
        id="mobile-bottom-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg text-[10px] font-medium transition-colors relative ${
                isActive ? "text-purple-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
              id={`nav-mobile-${item.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-mobile"
                  className="absolute inset-x-2 top-0 h-[2px] bg-purple-500 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 mb-1" />
              <span className="font-sans">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

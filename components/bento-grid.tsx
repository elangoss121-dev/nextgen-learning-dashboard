"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface BentoGridProps {
  children: React.ReactNode;
}

export function BentoGrid({ children }: BentoGridProps) {
  // Container variant that staggers the entrance of its children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto p-4 md:p-6"
    >
      {children}
    </motion.section>
  );
}

interface BentoGridItemProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGridItem({ children, className = "" }: BentoGridItemProps) {
  // Child variant with y shift and spring physics
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.article
      variants={itemVariants}
      className={`glass-card rounded-2xl overflow-hidden relative group p-6 flex flex-col justify-between ${className}`}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      {/* Background radial gradient mesh overlay */}
      <div className="gradient-mesh opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
      {/* Subtle border glow overlay */}
      <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-2xl transition-all duration-300 pointer-events-none z-10" />
      {/* Card Content wrapper to force stacking above meshes */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
    </motion.article>
  );
}

"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface BentoGridProps {
  children: React.ReactNode;
}

// Container: orchestrates staggered entrance of all child tiles
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export function BentoGrid({ children }: BentoGridProps) {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Use <section> — correct semantic wrapper for a thematic grouping
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto p-4 md:p-6"
      aria-label="Learning dashboard tiles"
    >
      {children}
    </motion.section>
  );
}

interface BentoGridItemProps {
  children: React.ReactNode;
  className?: string;
  as?: "article" | "div" | "aside";
}

// Item variant: y-translate + opacity with spring physics (per spec: stiffness 300, damping 20)
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

export function BentoGridItem({ children, className = "", as = "article" }: BentoGridItemProps) {
  const Tag = motion[as as "article" | "div" | "aside"] as typeof motion.article;

  return (
    <Tag
      variants={itemVariants}
      // ── Hover: spring-physics scale + border glow (transform + opacity only → zero layout shift) ──
      whileHover={{
        scale: 1.015,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      className={`glass-card rounded-2xl overflow-hidden relative group flex flex-col justify-between ${className}`}
    >
      {/* Abstract radial gradient mesh overlay */}
      <motion.div
        className="gradient-mesh absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.2 }}
        whileHover={{ opacity: 0.45 }}
        transition={{ duration: 0.3 }}
      />

      {/* Subtle border glow on hover — only opacity changes, no layout property */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-transparent pointer-events-none z-10"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1, borderColor: "rgba(255,255,255,0.12)" }}
        transition={{ duration: 0.25 }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        {children}
      </div>
    </Tag>
  );
}

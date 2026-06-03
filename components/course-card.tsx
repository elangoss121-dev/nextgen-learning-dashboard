"use client";

import { motion } from "framer-motion";
import { Course } from "@/types/course";
import {
  Code2, Monitor, FileCode, Layers, Palette,
  Server, Database, GitBranch, BookOpen,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2, Monitor, FileCode, Layers, Palette,
  Server, Database, GitBranch, BookOpen,
};

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/20",  text: "text-purple-400",  bar: "from-purple-500 to-indigo-500" },
  indigo:  { bg: "bg-indigo-500/10",  border: "border-indigo-500/20",  text: "text-indigo-400",  bar: "from-indigo-500 to-blue-500" },
  cyan:    { bg: "bg-cyan-500/10",    border: "border-cyan-500/20",    text: "text-cyan-400",    bar: "from-cyan-400 to-blue-500" },
  pink:    { bg: "bg-pink-500/10",    border: "border-pink-500/20",    text: "text-pink-400",    bar: "from-pink-500 to-rose-500" },
  rose:    { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400",    bar: "from-rose-500 to-pink-500" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", bar: "from-emerald-400 to-teal-500" },
  amber:   { bg: "bg-amber-500/10",   border: "border-amber-500/20",   text: "text-amber-400",   bar: "from-amber-400 to-orange-500" },
  sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     text: "text-sky-400",     bar: "from-sky-400 to-blue-500" },
};

interface CourseCardProps {
  course: Course;
  index?: number;
}

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const Icon = ICON_MAP[course.icon_name] ?? BookOpen;
  const c = COLOR_MAP[course.color ?? "purple"] ?? COLOR_MAP.purple;

  const lessonsTotal = course.lessons_total ?? 20;
  const lessonsDone  = course.lessons_done  ?? Math.round((course.progress / 100) * lessonsTotal);
  const subject      = course.subject      ?? "Course";
  const instructor   = course.instructor   ?? "Instructor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      className="col-span-1 glass-card rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:scale-[1.015] transition-transform duration-300"
    >
      {/* Subtle gradient mesh */}
      <div className="gradient-mesh opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className={`p-2.5 rounded-xl ${c.bg} border ${c.border} ${c.text} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.border} ${c.bg} ${c.text} uppercase tracking-wide self-start mt-0.5`}
        >
          {subject}
        </span>
      </div>

      {/* Title & instructor */}
      <div className="relative z-10 space-y-0.5">
        <h3 className={`font-bold text-sm text-white leading-snug group-hover:${c.text} transition-colors duration-200 line-clamp-2`}>
          {course.title}
        </h3>
        <p className="text-[11px] text-zinc-500 font-sans">by {instructor}</p>
      </div>

      {/* Progress */}
      <div className="relative z-10 space-y-2 mt-auto">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-zinc-500">
            {lessonsDone} / {lessonsTotal} lessons
          </span>
          <span className={`font-bold ${c.text}`}>{course.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 0.8, delay: index * 0.07 + 0.2, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${c.bar} rounded-full`}
          />
        </div>
      </div>
    </motion.div>
  );
}

import { createServerSupabaseClient } from "@/lib/supabase";
import type { Course } from "@/types/course";

export const revalidate = 60; // revalidate every 60 seconds for live data

const FALLBACK_COURSES: Course[] = [
  {
    id: "fallback-1",
    title: "Advanced React Patterns",
    subject: "Frontend",
    progress: 78,
    icon_name: "Code2",
    color: "purple",
    lessons_total: 32,
    lessons_done: 25,
    instructor: "Sarah Chen",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Next.js 15 Mastery",
    subject: "Full Stack",
    progress: 52,
    icon_name: "Monitor",
    color: "indigo",
    lessons_total: 40,
    lessons_done: 21,
    instructor: "Alex Rivera",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "TypeScript Deep Dive",
    subject: "Language",
    progress: 91,
    icon_name: "FileCode",
    color: "cyan",
    lessons_total: 28,
    lessons_done: 26,
    instructor: "James Park",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    title: "Full Stack Development",
    subject: "Full Stack",
    progress: 63,
    icon_name: "Layers",
    color: "pink",
    lessons_total: 50,
    lessons_done: 32,
    instructor: "Priya Nair",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    title: "UI/UX Design Systems",
    subject: "Design",
    progress: 35,
    icon_name: "Palette",
    color: "rose",
    lessons_total: 24,
    lessons_done: 8,
    instructor: "Mia Torres",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-6",
    title: "Node.js & REST APIs",
    subject: "Backend",
    progress: 80,
    icon_name: "Server",
    color: "emerald",
    lessons_total: 36,
    lessons_done: 29,
    instructor: "Liam Johnson",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-7",
    title: "PostgreSQL & Supabase",
    subject: "Database",
    progress: 47,
    icon_name: "Database",
    color: "amber",
    lessons_total: 30,
    lessons_done: 14,
    instructor: "Aiko Yamamoto",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-8",
    title: "DevOps & CI/CD Pipelines",
    subject: "Infrastructure",
    progress: 20,
    icon_name: "GitBranch",
    color: "sky",
    lessons_total: 45,
    lessons_done: 9,
    instructor: "Carlos Mendes",
    created_at: new Date().toISOString(),
  },
];

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.warn(
        "⚠️ Supabase environment variables are missing. Falling back to mock data."
      );
      return FALLBACK_COURSES;
    }

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, subject, progress, icon_name, color, lessons_total, lessons_done, instructor, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      // If table doesn't exist yet (42P01) or columns are missing, fall back gracefully
      console.warn("⚠️ Supabase query error:", error.message, "— using fallback data.");
      return FALLBACK_COURSES;
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No courses in Supabase yet — using fallback data.");
      return FALLBACK_COURSES;
    }

    return data as Course[];
  } catch (err) {
    console.error("❌ Unexpected error in getCourses:", err);
    return FALLBACK_COURSES;
  }
}

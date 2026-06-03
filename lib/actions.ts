
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Course } from "@/types/course";

export const revalidate = 3600;

const FALLBACK_COURSES: Course[] = [
  {
    id: "fallback-1",
    title: "Advanced React Patterns",
    progress: 75,
    icon_name: "Code2",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    title: "Next.js Mastery",
    progress: 45,
    icon_name: "Monitor",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    title: "TypeScript Deep Dive",
    progress: 90,
    icon_name: "FileCode",
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    title: "Full Stack Development",
    progress: 60,
    icon_name: "Layers",
    created_at: new Date().toISOString(),
  },
];

export async function getCourses(): Promise<Course[]> {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.warn(
        "⚠️ Supabase environment variables are missing or default placeholders are used. Falling back to mock dashboard data."
      );
      // Simulate slight server latency (e.g. 800ms) to showcase the skeleton loader animations
      await new Promise((resolve) => setTimeout(resolve, 800));
      return FALLBACK_COURSES;
    }

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("❌ Error fetching courses from Supabase:", error.message);
      // Fallback in case table doesn't exist yet or connection fails
      return FALLBACK_COURSES;
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No course records found in Supabase. Seeding mock data.");
      return FALLBACK_COURSES;
    }

    return data as Course[];
  } catch (err) {
    console.error("❌ Unexpected error in getCourses server action:", err);
    return FALLBACK_COURSES;
  }
}

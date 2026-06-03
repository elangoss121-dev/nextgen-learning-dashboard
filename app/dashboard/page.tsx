import { getCourses } from "@/lib/actions";
import DashboardClient from "./dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aether | Learning Dashboard",
  description: "Your futuristic student learning dashboard powered by Supabase and Next.js",
};

// Set dynamic runtime to ensure server rendering checks environment variables and database updates on each request
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch courses on the server side
  const courses = await getCourses();

  return <DashboardClient initialCourses={courses} />;
}

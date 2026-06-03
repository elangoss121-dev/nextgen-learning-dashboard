import { redirect } from "next/navigation";

// Redirect root route (/) directly to the dashboard
export default function Home() {
  redirect("/dashboard");
}

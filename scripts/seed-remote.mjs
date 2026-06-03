// ============================================================
// Aether Learning Dashboard — Remote Seed Script
// Run: node scripts/seed-remote.mjs
// Requires: SUPABASE_SERVICE_ROLE_KEY in .env.local
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_KEY;
const ANON_KEY =
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local");
  process.exit(1);
}

// Prefer service role key for writes; fall back to anon (will fail on RLS-protected tables)
const KEY = SERVICE_KEY || ANON_KEY;
const keyType = SERVICE_KEY ? "service_role" : "anon (limited — may fail on writes)";

console.log(`\n🔗 Connecting to Supabase: ${SUPABASE_URL}`);
console.log(`🔑 Using key type: ${keyType}\n`);

const supabase = createClient(SUPABASE_URL, KEY, {
  auth: { persistSession: false },
});

// ──────────────────────────────────────────────────────────────────────────────
// SEED DATA — 8 rich, real-looking courses
// ──────────────────────────────────────────────────────────────────────────────
const COURSES = [
  {
    title: "Advanced React Patterns",
    subject: "Frontend",
    progress: 78,
    icon_name: "Code2",
    color: "purple",
    lessons_total: 32,
    lessons_done: 25,
    instructor: "Sarah Chen",
  },
  {
    title: "Next.js 15 Mastery",
    subject: "Full Stack",
    progress: 52,
    icon_name: "Monitor",
    color: "indigo",
    lessons_total: 40,
    lessons_done: 21,
    instructor: "Alex Rivera",
  },
  {
    title: "TypeScript Deep Dive",
    subject: "Language",
    progress: 91,
    icon_name: "FileCode",
    color: "cyan",
    lessons_total: 28,
    lessons_done: 26,
    instructor: "James Park",
  },
  {
    title: "Full Stack Development",
    subject: "Full Stack",
    progress: 63,
    icon_name: "Layers",
    color: "pink",
    lessons_total: 50,
    lessons_done: 32,
    instructor: "Priya Nair",
  },
  {
    title: "UI/UX Design Systems",
    subject: "Design",
    progress: 35,
    icon_name: "Palette",
    color: "rose",
    lessons_total: 24,
    lessons_done: 8,
    instructor: "Mia Torres",
  },
  {
    title: "Node.js & REST APIs",
    subject: "Backend",
    progress: 80,
    icon_name: "Server",
    color: "emerald",
    lessons_total: 36,
    lessons_done: 29,
    instructor: "Liam Johnson",
  },
  {
    title: "PostgreSQL & Supabase",
    subject: "Database",
    progress: 47,
    icon_name: "Database",
    color: "amber",
    lessons_total: 30,
    lessons_done: 14,
    instructor: "Aiko Yamamoto",
  },
  {
    title: "DevOps & CI/CD Pipelines",
    subject: "Infrastructure",
    progress: 20,
    icon_name: "GitBranch",
    color: "sky",
    lessons_total: 45,
    lessons_done: 9,
    instructor: "Carlos Mendes",
  },
];

async function main() {
  // ── Step 1: Check if table exists by querying it ──
  console.log("📋 Checking if courses table exists...");
  const { error: checkError } = await supabase.from("courses").select("id").limit(1);

  if (checkError?.code === "42P01") {
    console.log("⚠️  Table 'courses' does not exist.");
    console.log("\n📌 Please run the following SQL in your Supabase SQL Editor:");
    console.log("   https://supabase.com/dashboard/project/nkuqpnnnorqgwqbtqbzp/sql/new\n");
    console.log(
      readFileSync(resolve(__dirname, "../supabase/seed.sql"), "utf-8")
    );
    process.exit(0);
  }

  // ── Step 2: Clear old data ──
  console.log("🗑️  Clearing existing course records...");
  const { error: deleteError } = await supabase
    .from("courses")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

  if (deleteError) {
    console.warn("⚠️  Could not clear existing data:", deleteError.message);
    console.warn("    (This is expected if using anon key with RLS enabled for writes)");
  }

  // ── Step 3: Insert seed data ──
  console.log("🌱 Inserting 8 course records...\n");
  const { data, error: insertError } = await supabase
    .from("courses")
    .insert(COURSES)
    .select();

  if (insertError) {
    console.error("❌ Insert failed:", insertError.message);
    console.error("\n💡 If you see a permission error, you need to either:");
    console.error("   1. Add SUPABASE_SERVICE_ROLE_KEY to your .env.local, OR");
    console.error(
      "   2. Run the seed.sql file directly in the Supabase SQL Editor:\n"
    );
    console.error(
      "   https://supabase.com/dashboard/project/nkuqpnnnorqgwqbtqbzp/sql/new\n"
    );
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${data.length} courses:\n`);
  data.forEach((c) =>
    console.log(`   • [${c.progress}%] ${c.title} — by ${c.instructor}`)
  );
  console.log("\n🚀 Done! Refresh your dashboard at http://localhost:3000/dashboard\n");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});

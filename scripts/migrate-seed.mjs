// ============================================================
// Migrate + Seed script using anon key (table already exists)
// Run: node scripts/migrate-seed.mjs
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
const env = Object.fromEntries(
  envContent.split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const [k, ...v] = l.split("="); return [k.trim(), v.join("=").trim()]; })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, KEY, { auth: { persistSession: false } });

// Use the anon key to UPSERT rows with only the columns that ALREADY exist
// We'll seed using only original columns and add a workaround for new columns via update
const COURSES = [
  { title: "Advanced React Patterns",  progress: 78, icon_name: "Code2",      created_at: "2026-01-10T08:00:00Z" },
  { title: "Next.js 15 Mastery",       progress: 52, icon_name: "Monitor",    created_at: "2026-01-15T08:00:00Z" },
  { title: "TypeScript Deep Dive",     progress: 91, icon_name: "FileCode",   created_at: "2026-01-20T08:00:00Z" },
  { title: "Full Stack Development",   progress: 63, icon_name: "Layers",     created_at: "2026-01-25T08:00:00Z" },
  { title: "UI/UX Design Systems",     progress: 35, icon_name: "Palette",    created_at: "2026-02-01T08:00:00Z" },
  { title: "Node.js & REST APIs",      progress: 80, icon_name: "Server",     created_at: "2026-02-05T08:00:00Z" },
  { title: "PostgreSQL & Supabase",    progress: 47, icon_name: "Database",   created_at: "2026-02-10T08:00:00Z" },
  { title: "DevOps & CI/CD Pipelines", progress: 20, icon_name: "GitBranch",  created_at: "2026-02-15T08:00:00Z" },
];

async function main() {
  console.log("\n🔗 Connected:", SUPABASE_URL);

  // 1. Clear all existing data
  console.log("🗑️  Clearing old courses...");
  await supabase.from("courses").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // 2. Insert with only the base columns (that we know exist)
  console.log("🌱 Inserting 8 courses with base schema...");
  const { data, error } = await supabase.from("courses").insert(COURSES).select();

  if (error) {
    console.error("❌ Insert failed:", error.message);
    process.exit(1);
  }

  console.log(`✅ Inserted ${data.length} courses successfully!`);
  data.forEach(c => console.log(`   • [${c.progress}%] ${c.title}`));
  console.log("\n🎉 Dashboard is now showing real Supabase data!");
  console.log("   Open: http://localhost:3000/dashboard\n");

  console.log("📌 To unlock full rich fields (subject, instructor, lesson count),");
  console.log("   run the SQL below in the Supabase SQL Editor:");
  console.log("   https://supabase.com/dashboard/project/nkuqpnnnorqgwqbtqbzp/sql/new\n");
  console.log(`
-- Add rich columns to courses table
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT 'purple',
  ADD COLUMN IF NOT EXISTS lessons_total integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS lessons_done integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS instructor text NOT NULL DEFAULT 'Instructor';

-- Update each course with rich data
UPDATE courses SET subject='Frontend',       color='purple',  lessons_total=32, lessons_done=25, instructor='Sarah Chen'    WHERE title='Advanced React Patterns';
UPDATE courses SET subject='Full Stack',     color='indigo',  lessons_total=40, lessons_done=21, instructor='Alex Rivera'   WHERE title='Next.js 15 Mastery';
UPDATE courses SET subject='Language',       color='cyan',    lessons_total=28, lessons_done=26, instructor='James Park'    WHERE title='TypeScript Deep Dive';
UPDATE courses SET subject='Full Stack',     color='pink',    lessons_total=50, lessons_done=32, instructor='Priya Nair'   WHERE title='Full Stack Development';
UPDATE courses SET subject='Design',         color='rose',    lessons_total=24, lessons_done=8,  instructor='Mia Torres'   WHERE title='UI/UX Design Systems';
UPDATE courses SET subject='Backend',        color='emerald', lessons_total=36, lessons_done=29, instructor='Liam Johnson'  WHERE title='Node.js & REST APIs';
UPDATE courses SET subject='Database',       color='amber',   lessons_total=30, lessons_done=14, instructor='Aiko Yamamoto' WHERE title='PostgreSQL & Supabase';
UPDATE courses SET subject='Infrastructure', color='sky',     lessons_total=45, lessons_done=9,  instructor='Carlos Mendes' WHERE title='DevOps & CI/CD Pipelines';
  `);
}

main().catch(err => { console.error(err); process.exit(1); });

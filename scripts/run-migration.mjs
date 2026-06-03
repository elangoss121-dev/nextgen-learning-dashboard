// Run ALTER TABLE + UPDATE via Supabase Management REST API
// This requires a Personal Access Token (PAT) from https://supabase.com/dashboard/account/tokens
// Usage: SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/run-migration.mjs

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

const PROJECT_REF = "nkuqpnnnorqgwqbtqbzp";
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("❌ Missing SUPABASE_ACCESS_TOKEN");
  console.error("\n💡 Get a PAT from: https://supabase.com/dashboard/account/tokens");
  console.error("   Then run: $env:SUPABASE_ACCESS_TOKEN='sbp_xxx'; node scripts/run-migration.mjs\n");
  process.exit(1);
}

const SQL = `
ALTER TABLE courses 
  ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT 'purple',
  ADD COLUMN IF NOT EXISTS lessons_total integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS lessons_done integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS instructor text NOT NULL DEFAULT 'Instructor';

UPDATE courses SET subject='Frontend',       color='purple',  lessons_total=32, lessons_done=25, instructor='Sarah Chen'    WHERE title='Advanced React Patterns';
UPDATE courses SET subject='Full Stack',     color='indigo',  lessons_total=40, lessons_done=21, instructor='Alex Rivera'   WHERE title='Next.js 15 Mastery';
UPDATE courses SET subject='Language',       color='cyan',    lessons_total=28, lessons_done=26, instructor='James Park'    WHERE title='TypeScript Deep Dive';
UPDATE courses SET subject='Full Stack',     color='pink',    lessons_total=50, lessons_done=32, instructor='Priya Nair'   WHERE title='Full Stack Development';
UPDATE courses SET subject='Design',         color='rose',    lessons_total=24, lessons_done=8,  instructor='Mia Torres'   WHERE title='UI/UX Design Systems';
UPDATE courses SET subject='Backend',        color='emerald', lessons_total=36, lessons_done=29, instructor='Liam Johnson'  WHERE title='Node.js & REST APIs';
UPDATE courses SET subject='Database',       color='amber',   lessons_total=30, lessons_done=14, instructor='Aiko Yamamoto' WHERE title='PostgreSQL & Supabase';
UPDATE courses SET subject='Infrastructure', color='sky',     lessons_total=45, lessons_done=9,  instructor='Carlos Mendes' WHERE title='DevOps & CI/CD Pipelines';
`;

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: SQL }),
  }
);

const result = await res.json();
if (!res.ok) {
  console.error("❌ Migration failed:", JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log("✅ Migration applied successfully!");
console.log("   Rich columns (subject, color, instructor, lessons) are now live.");
console.log("   Refresh: http://localhost:3000/dashboard\n");

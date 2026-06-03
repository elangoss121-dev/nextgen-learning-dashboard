-- ============================================================
-- Aether Learning Dashboard — Database Setup & Seed
-- Run this in Supabase SQL Editor or via CLI:
--   npx supabase db query --db-url <connection-string> < supabase/seed.sql
-- ============================================================

-- 1. Create courses table
create table if not exists courses (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  subject    text not null default 'General',
  progress   integer not null check (progress between 0 and 100),
  icon_name  text not null,
  color      text not null default 'purple',
  lessons_total   integer not null default 20,
  lessons_done    integer not null default 0,
  instructor text not null default 'Instructor',
  created_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table courses enable row level security;

-- 3. Allow anonymous read (public dashboard — no auth required)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'courses'
      and policyname = 'anon_select_courses'
  ) then
    execute $policy$
      create policy "anon_select_courses"
      on courses for select
      to anon
      using (true)
    $policy$;
  end if;
end $$;

-- 4. Grant table access to anon role (required for Data API)
grant select on courses to anon;

-- 5. Clear any existing seed data then insert fresh records
truncate courses;

insert into courses
  (title, subject, progress, icon_name, color, lessons_total, lessons_done, instructor)
values
  ('Advanced React Patterns',   'Frontend',       78, 'Code2',       'purple',  32, 25, 'Sarah Chen'),
  ('Next.js 15 Mastery',        'Full Stack',     52, 'Monitor',     'indigo',  40, 21, 'Alex Rivera'),
  ('TypeScript Deep Dive',      'Language',       91, 'FileCode',    'cyan',    28, 26, 'James Park'),
  ('Full Stack Development',    'Full Stack',     63, 'Layers',      'pink',    50, 32, 'Priya Nair'),
  ('UI/UX Design Systems',      'Design',         35, 'Palette',     'rose',    24,  8, 'Mia Torres'),
  ('Node.js & REST APIs',       'Backend',        80, 'Server',      'emerald', 36, 29, 'Liam Johnson'),
  ('PostgreSQL & Supabase',     'Database',       47, 'Database',    'amber',   30, 14, 'Aiko Yamamoto'),
  ('DevOps & CI/CD Pipelines',  'Infrastructure', 20, 'GitBranch',   'sky',     45,  9, 'Carlos Mendes');

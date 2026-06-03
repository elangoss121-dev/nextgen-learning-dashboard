-- Create courses table
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  progress integer not null,
  icon_name text not null,
  created_at timestamp with time zone default now()
);

-- Seed initial data
insert into courses (title, progress, icon_name) values
('Advanced React Patterns', 75, 'Code2'),
('Next.js Mastery', 45, 'Monitor'),
('TypeScript Deep Dive', 90, 'FileCode'),
('Full Stack Development', 60, 'Layers');

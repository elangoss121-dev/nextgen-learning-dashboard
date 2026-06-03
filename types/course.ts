export interface Course {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
  created_at: string;
  // Optional richer fields (present when seeded with full schema)
  subject?: string;
  color?: string;
  lessons_total?: number;
  lessons_done?: number;
  instructor?: string;
}

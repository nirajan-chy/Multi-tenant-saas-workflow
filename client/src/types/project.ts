export interface Project {
  id: number;
  name: string;
  description?: string;
  role?: "admin" | "user";
  created_at?: string;
}

export interface ProjectCreateInput {
  name: string;
}

export interface ProjectUpdateInput {
  name?: string;
}

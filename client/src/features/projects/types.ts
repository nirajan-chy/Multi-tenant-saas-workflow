export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  teamId?: string;
}

export interface ProjectCreateInput {
  name: string;
  description?: string;
  teamId?: string;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  teamId?: string;
}
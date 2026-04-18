export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  teamIds: string[];
  tasks: string[];
}

export interface ProjectCreateInput {
  name: string;
  description?: string;
  ownerId: string;
  teamIds?: string[];
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  teamIds?: string[];
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  role?: "admin" | "user";
  created_at?: string;
}

export interface OrganizationMember {
  id: number;
  role: "admin" | "user";
  created_at?: string;
  user: User;
}

export interface CreateOrganizationInput {
  name: string;
}

export interface AddOrganizationMemberInput {
  userId: number;
  role: "admin" | "user";
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  refreshToken?: string;
  accessToken?: string;
}

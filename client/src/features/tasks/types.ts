export interface Task {
  id: number;
  organizationId?: number;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  assignedTo?: number | null;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
}

export interface TaskResponse {
  tasks: Task[];
  total: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  assignedTo?: number | null;
}

export interface UpdateTaskInput {
  id: number;
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  assignedTo?: number | null;
}

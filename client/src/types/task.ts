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

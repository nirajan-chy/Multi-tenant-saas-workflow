export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO format date
  createdAt: string; // ISO format date
  updatedAt: string; // ISO format date
  assigneeId?: string; // User ID of the assignee
}
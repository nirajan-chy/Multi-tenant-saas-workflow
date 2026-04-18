export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalProjects: number;
  totalTeams: number;
  taskCompletionRate: number; // percentage of completed tasks
}

export interface TaskAnalytics {
  taskId: string;
  taskName: string;
  completionTime: number; // time taken to complete the task in hours
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectAnalytics {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}
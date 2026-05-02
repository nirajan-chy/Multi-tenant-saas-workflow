import { apiClient } from "../lib/api-client";
import { Task } from "../types/task";

const buildBaseUrl = (organizationId: number) =>
  `/organizations/${organizationId}/tasks`;

export const fetchTasks = async (organizationId: number): Promise<Task[]> => {
  const response = await apiClient.get(buildBaseUrl(organizationId));
  return response.data.tasks ?? response.data;
};

export const createTask = async (
  organizationId: number,
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "organizationId">,
): Promise<Task> => {
  const response = await apiClient.post(buildBaseUrl(organizationId), task);
  return response.data.task ?? response.data;
};

export const updateTask = async (
  organizationId: number,
  taskId: number,
  task: Partial<Task>,
): Promise<Task> => {
  const response = await apiClient.put(
    `${buildBaseUrl(organizationId)}/${taskId}`,
    task,
  );
  return response.data.task ?? response.data;
};

export const deleteTask = async (
  organizationId: number,
  taskId: number,
): Promise<void> => {
  await apiClient.delete(`${buildBaseUrl(organizationId)}/${taskId}`);
};

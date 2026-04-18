import { apiClient } from '../lib/api-client';
import { Task } from '../types/task';

const BASE_URL = '/api/tasks';

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await apiClient.post(BASE_URL, task);
    return response.data;
};

export const updateTask = async (taskId: string, task: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put(`${BASE_URL}/${taskId}`, task);
    return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${taskId}`);
};
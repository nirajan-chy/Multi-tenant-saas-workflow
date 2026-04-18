import axios from 'axios';
import { Task } from '../../types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/tasks';

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await axios.post(API_URL, task);
    return response.data;
};

export const updateTask = async (taskId: string, task: Partial<Task>): Promise<Task> => {
    const response = await axios.put(`${API_URL}/${taskId}`, task);
    return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    await axios.delete(`${API_URL}/${taskId}`);
};
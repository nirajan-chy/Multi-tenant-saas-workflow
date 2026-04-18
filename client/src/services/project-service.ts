import { apiClient } from '../lib/api-client';
import { Project } from '../types/project';

const BASE_URL = '/api/projects';

export const getProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    const response = await apiClient.post(BASE_URL, projectData);
    return response.data;
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, projectData);
    return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};
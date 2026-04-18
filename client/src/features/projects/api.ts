import { apiClient } from '../../lib/api-client';
import { Project } from '../../types/project';

export const fetchProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get('/projects');
    return response.data;
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
};

export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put(`/projects/${projectId}`, projectData);
    return response.data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
};
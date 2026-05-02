import { apiClient } from "../../lib/api-client";
import { Project } from "./types";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get("/organizations");
  return response.data.organizations ?? response.data;
};

export const createProject = async (
  projectData: Omit<Project, "id">,
): Promise<Project> => {
  const response = await apiClient.post("/organizations", projectData);
  return response.data.organization ?? response.data;
};

export const updateProject = async (
  projectId: number,
  projectData: Partial<Project>,
): Promise<Project> => {
  const response = await apiClient.put(
    `/organizations/${projectId}`,
    projectData,
  );
  return response.data.organization ?? response.data;
};

export const deleteProject = async (projectId: number): Promise<void> => {
  await apiClient.delete(`/organizations/${projectId}`);
};

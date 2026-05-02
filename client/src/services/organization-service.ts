import { apiClient } from "../lib/api-client";
import {
  AddOrganizationMemberInput,
  CreateOrganizationInput,
  Organization,
  OrganizationMember,
} from "../types/api";

export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get("/organizations");
  return response.data.organizations ?? response.data;
};

export const createOrganization = async (
  input: CreateOrganizationInput,
): Promise<Organization> => {
  const response = await apiClient.post("/organizations", input);
  return response.data.organization ?? response.data;
};

export const getOrganizationMembers = async (
  organizationId: number,
): Promise<OrganizationMember[]> => {
  const response = await apiClient.get(
    `/organizations/${organizationId}/members`,
  );
  return response.data.members ?? response.data;
};

export const addOrganizationMember = async (
  organizationId: number,
  input: AddOrganizationMemberInput,
): Promise<OrganizationMember> => {
  const response = await apiClient.post(
    `/organizations/${organizationId}/members`,
    input,
  );
  return response.data.membership ?? response.data;
};

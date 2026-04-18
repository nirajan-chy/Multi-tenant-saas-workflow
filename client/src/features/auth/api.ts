import { apiClient } from "../../lib/api-client";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../../types/auth";

export const login = async (data: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};

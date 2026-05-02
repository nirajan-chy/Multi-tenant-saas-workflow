import { apiClient } from "../../lib/api-client";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../../types/auth";

const normalizeAuthResponse = (data: AuthResponse): AuthResponse => ({
  user: data.user,
  token: data.token || data.accessToken || "",
  accessToken: data.accessToken || data.token,
  refreshToken: data.refreshToken,
});

export const login = async (data: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", data);
  return normalizeAuthResponse(response.data);
};

export const register = async (
  data: RegisterCredentials,
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/register", data);
  return normalizeAuthResponse(response.data);
};

export const forgotPassword = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};

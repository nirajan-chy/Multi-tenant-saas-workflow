"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth-store";
import {
  forgotPassword,
  login as loginApi,
  register as registerApi,
} from "./api";
import { RegisterCredentials } from "../../types/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuth, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginApi({ email, password });
      setAuth(data.user, data.token);
      window.localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerApi(payload);
      setAuth(data.user, data.token);
      window.localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send password reset email");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    window.localStorage.removeItem("token");
    router.push("/login");
  };

  return { login, register, requestPasswordReset, logout, loading, error };
};

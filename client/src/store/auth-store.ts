import create from "zustand";
import { User } from "../types/auth";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User, token: string, refreshToken?: string | null) => void;
  clearAuth: () => void;
}

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, refreshToken: null, user: null as User | null };
  }

  const token = window.localStorage.getItem("token");
  const refreshToken = window.localStorage.getItem("refreshToken");
  const userRaw = window.localStorage.getItem("user");

  return {
    token,
    refreshToken,
    user: userRaw ? (JSON.parse(userRaw) as User) : null,
  };
};

const storedAuth = getStoredAuth();

export const useAuthStore = create<AuthState>(set => ({
  token: storedAuth.token,
  refreshToken: storedAuth.refreshToken,
  isAuthenticated: Boolean(storedAuth.token && storedAuth.user),
  user: storedAuth.user,
  setAuth: (user, token, refreshToken = null) =>
    set({ isAuthenticated: true, user, token, refreshToken }),
  clearAuth: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
    }),
}));

export const useStore = useAuthStore;

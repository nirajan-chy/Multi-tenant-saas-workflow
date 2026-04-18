import create from "zustand";
import { User } from "../types/auth";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  isAuthenticated: false,
  user: null,
  setAuth: (user, token) => set({ isAuthenticated: true, user, token }),
  clearAuth: () => set({ isAuthenticated: false, user: null, token: null }),
}));

export const useStore = useAuthStore;

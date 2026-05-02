"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../../lib/api-client";
import { useAuthStore } from "../../../store/auth-store";
import { User } from "../../../types/auth";

const SettingsPage = () => {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data.user);
      } catch (err) {
        setError("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, []);

  const handleLogout = async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await apiClient.post("/auth/logout", { refreshToken });
      } catch (err) {
        // continue local logout even if the server call fails
      }
    }

    clearAuth();
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600">
          Your account details are loaded from the backend auth API.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading account details...</p>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {user?.name ?? "Unknown user"}
          </p>
          <p className="text-sm text-gray-600">
            {user?.email ?? "No email available"}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800"
      >
        Log out
      </button>
    </div>
  );
};

export default SettingsPage;

"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  createOrganization,
  getOrganizations,
} from "../../services/organization-service";
import { Organization } from "../../types/api";

const DashboardHomePage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationName, setOrganizationName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrganizations = async () => {
    try {
      setError(null);
      const data = await getOrganizations();
      setOrganizations(data);
    } catch {
      setError("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrganizations();
  }, []);

  const handleCreateOrganization = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!organizationName.trim()) {
      return;
    }

    try {
      setSaving(true);
      await createOrganization({ name: organizationName.trim() });
      setOrganizationName("");
      await loadOrganizations();
    } catch {
      setError("Failed to create organization");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          The backend is connected. Use organizations as your workspace
          boundary.
        </p>
      </div>

      <form
        onSubmit={handleCreateOrganization}
        className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row"
      >
        <input
          value={organizationName}
          onChange={event => setOrganizationName(event.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
          placeholder="Create a new organization"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create organization"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Organizations</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {loading ? "..." : organizations.length}
          </p>
        </div>
        <Link
          href="/tasks"
          className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900 shadow-sm hover:bg-blue-100"
        >
          Manage tasks
        </Link>
        <Link
          href="/teams"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 shadow-sm hover:bg-emerald-100"
        >
          Manage team members
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Your organizations
        </h2>
        <div className="mt-4 space-y-3">
          {organizations.length === 0 && !loading ? (
            <p className="text-sm text-gray-500">No organizations yet.</p>
          ) : (
            organizations.map(organization => (
              <div
                key={organization.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {organization.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Role: {organization.role ?? "member"}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  #{organization.id}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;

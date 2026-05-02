"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  createOrganization,
  getOrganizations,
} from "../../../services/organization-service";
import { Organization } from "../../../types/api";

const ProjectsPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload().catch(() => undefined);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await createOrganization({ name: name.trim() });
      setName("");
      await reload();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Organizations</h1>
        <p className="text-sm text-gray-600">
          Organizations are the backend workspace model that powers tasks and
          members.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Organization name"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Create"}
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading organizations...</p>
        ) : (
          organizations.map(organization => (
            <div
              key={organization.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-lg font-semibold text-gray-900">
                {organization.name}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Role: {organization.role ?? "member"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                ID: {organization.id}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;

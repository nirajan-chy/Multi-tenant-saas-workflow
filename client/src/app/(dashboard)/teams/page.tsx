"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  addOrganizationMember,
  getOrganizationMembers,
  getOrganizations,
} from "../../../services/organization-service";
import { Organization, OrganizationMember } from "../../../types/api";

const TeamsPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = useState<
    number | null
  >(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadOrganizations = async () => {
    const data = await getOrganizations();
    setOrganizations(data);
    setActiveOrganizationId(previous => previous ?? data[0]?.id ?? null);
    return data[0]?.id ?? null;
  };

  const loadMembers = async (organizationId: number) => {
    const data = await getOrganizationMembers(organizationId);
    setMembers(data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        const organizationId = await loadOrganizations();
        if (organizationId) {
          await loadMembers(organizationId);
        }
      } finally {
        setLoading(false);
      }
    };

    void bootstrap().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!activeOrganizationId) {
      setMembers([]);
      return;
    }

    void loadMembers(activeOrganizationId).catch(() => undefined);
  }, [activeOrganizationId]);

  const handleAddMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeOrganizationId || !userId.trim()) return;

    try {
      setSaving(true);
      await addOrganizationMember(activeOrganizationId, {
        userId: Number(userId),
        role,
      });
      setUserId("");
      setRole("user");
      await loadMembers(activeOrganizationId);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading team members...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
        <p className="text-sm text-gray-600">
          Manage organization membership with the backend membership endpoints.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <select
          value={activeOrganizationId ?? ""}
          onChange={event =>
            setActiveOrganizationId(Number(event.target.value))
          }
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="" disabled>
            Select organization
          </option>
          {organizations.map(organization => (
            <option key={organization.id} value={organization.id}>
              {organization.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={handleAddMember}
        className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3"
      >
        <input
          value={userId}
          onChange={event => setUserId(event.target.value)}
          placeholder="User ID"
          type="number"
          className="rounded-lg border border-gray-300 px-4 py-2"
        />
        <select
          value={role}
          onChange={event => setRole(event.target.value as "admin" | "user")}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={saving || !activeOrganizationId}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add member"}
        </button>
      </form>

      <div className="space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">
            No members found for this organization.
          </p>
        ) : (
          members.map(member => (
            <div
              key={member.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="font-medium text-gray-900">{member.user.name}</p>
              <p className="text-sm text-gray-600">{member.user.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                Role: {member.role}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamsPage;

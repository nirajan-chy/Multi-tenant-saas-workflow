"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getOrganizations } from "../../../services/organization-service";
import {
  createTask,
  deleteTask,
  fetchTasks,
} from "../../../services/task-service";
import { Organization } from "../../../types/api";
import { Task } from "../../../types/task";

const TasksPage = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganizationId, setActiveOrganizationId] = useState<
    number | null
  >(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadOrganizations = async () => {
    const data = await getOrganizations();
    setOrganizations(data);
    const firstOrganization = data[0] ?? null;
    setActiveOrganizationId(
      previous => previous ?? firstOrganization?.id ?? null,
    );
    return firstOrganization?.id ?? null;
  };

  const loadTasks = async (organizationId: number) => {
    const data = await fetchTasks(organizationId);
    setTasks(data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        const organizationId = await loadOrganizations();
        if (organizationId) {
          await loadTasks(organizationId);
        }
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    if (!activeOrganizationId) {
      setTasks([]);
      return;
    }

    void loadTasks(activeOrganizationId).catch(() =>
      setError("Failed to load tasks"),
    );
  }, [activeOrganizationId]);

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeOrganizationId || !title.trim()) {
      return;
    }

    try {
      setCreating(true);
      await createTask(activeOrganizationId, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        assignedTo: assignedTo ? Number(assignedTo) : null,
      });
      setTitle("");
      setDescription("");
      setStatus("todo");
      setAssignedTo("");
      await loadTasks(activeOrganizationId);
    } catch (err) {
      setError("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!activeOrganizationId) return;
    await deleteTask(activeOrganizationId, taskId);
    await loadTasks(activeOrganizationId);
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading tasks...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-600">
          Tasks are scoped to an organization. Select one to view and create
          items.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

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
        onSubmit={handleCreateTask}
        className="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-2"
      >
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Task title"
          className="rounded-lg border border-gray-300 px-4 py-2 md:col-span-2"
        />
        <input
          value={description}
          onChange={event => setDescription(event.target.value)}
          placeholder="Task description"
          className="rounded-lg border border-gray-300 px-4 py-2 md:col-span-2"
        />
        <select
          value={status}
          onChange={event => setStatus(event.target.value as Task["status"])}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          value={assignedTo}
          onChange={event => setAssignedTo(event.target.value)}
          placeholder="Assigned to user id"
          type="number"
          className="rounded-lg border border-gray-300 px-4 py-2"
        />
        <button
          type="submit"
          disabled={creating || !activeOrganizationId}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 md:col-span-2"
        >
          {creating ? "Creating..." : "Create task"}
        </button>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-500">
            {activeOrganizationId
              ? "No tasks yet for this organization."
              : "Create or select an organization first."}
          </p>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {task.description || "No description"}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
                    Status: {task.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDeleteTask(task.id)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksPage;

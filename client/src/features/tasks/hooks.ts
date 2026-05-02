import { useEffect, useState } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "./api";
import { Task } from "./types";

export const useTasks = (organizationId: number | null = null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      if (!organizationId) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        const fetchedTasks = await fetchTasks(organizationId);
        setTasks(fetchedTasks);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [organizationId]);

  const addTask = async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (!organizationId) {
      setError("Select an organization first");
      return;
    }

    try {
      const newTask = await createTask(organizationId, task);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const editTask = async (taskId: number, updatedTask: Partial<Task>) => {
    if (!organizationId) {
      setError("Select an organization first");
      return;
    }

    try {
      const updated = await updateTask(organizationId, taskId, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? updated : task)),
      );
    } catch (err) {
      setError("Failed to update task");
    }
  };

  const removeTask = async (taskId: number) => {
    if (!organizationId) {
      setError("Select an organization first");
      return;
    }

    try {
      await deleteTask(organizationId, taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return { tasks, loading, error, addTask, editTask, removeTask };
};

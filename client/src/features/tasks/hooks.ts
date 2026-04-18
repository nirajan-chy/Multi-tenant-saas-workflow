import { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import { Task } from './types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const addTask = async (task: Task) => {
    try {
      const newTask = await createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const editTask = async (taskId: string, updatedTask: Task) => {
    try {
      const updated = await updateTask(taskId, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updated : task))
      );
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  return { tasks, loading, error, addTask, editTask, removeTask };
};
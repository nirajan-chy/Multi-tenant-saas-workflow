import create from "zustand";
import { Task } from "../types/task";

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, partial: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
}

export const useTaskStore = create<TaskState>(set => ({
  tasks: [],
  setTasks: tasks => set({ tasks }),
  addTask: task => set(state => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, partial) =>
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === taskId ? { ...task, ...partial } : task,
      ),
    })),
  removeTask: taskId =>
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== taskId),
    })),
}));

import { create } from "zustand";
import type { ITask } from "../types";

interface TaskState {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  addTask: (task: ITask) => void;
  updateTask: (task: ITask) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
}

export const useTasks = create<TaskState>((set) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks.filter((t) => t._id !== task._id), task],
    })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    })),

  clearTasks: () => set({ tasks: [] }),
}));

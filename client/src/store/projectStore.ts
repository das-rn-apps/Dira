import { create } from "zustand";
import type { IProject } from "../types";

interface ProjectsState {
  projects: IProject[];
  setProjects: (projects: IProject[]) => void;
  addProject: (project: IProject) => void;
  updateProject: (project: IProject) => void;
  removeProject: (projectId: string) => void;
  clearProjects: () => void;
}

export const useProjects = create<ProjectsState>((set) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set((state) => ({
      projects: [
        ...state.projects.filter((p) => p._id !== project._id),
        project,
      ],
    })),

  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p._id === project._id ? project : p
      ),
    })),

  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== projectId),
    })),

  clearProjects: () => set({ projects: [] }),
}));

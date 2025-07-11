import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  clearUsers: () => void;
}

export const useUsers = create<UsersState>((set) => ({
  users: [],

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u._id !== user._id), user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u._id !== userId),
    })),

  clearUsers: () => set({ users: [] }),
}));

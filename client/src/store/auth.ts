import { create } from "zustand";

export interface User {
  _id: string;
  name: string;
  email: string;
}
interface Auth {
  user: User;
  token: string;
}
interface AuthState {
  user: Auth | null;
  setUser: (user: Auth | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

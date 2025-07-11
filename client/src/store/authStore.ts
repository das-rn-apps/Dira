import { create } from "zustand";
import type { IUser } from "../types";

interface Auth {
  user: IUser;
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

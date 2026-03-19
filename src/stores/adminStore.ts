import { create } from 'zustand';
import { apiPost, apiGet } from '../lib/api';

interface AdminUser {
  id: number;
  username: string;
  displayName: string;
}

interface AdminStore {
  isAuthenticated: boolean;
  user: AdminUser | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>()((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (username: string, password: string) => {
    try {
      const data = await apiPost<{ user: AdminUser }>('/auth/login', { username, password });
      set({ isAuthenticated: true, user: data.user });
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await apiPost('/auth/logout');
    } catch {
      // ignore
    }
    set({ isAuthenticated: false, user: null });
  },

  checkAuth: async () => {
    try {
      const data = await apiGet<{ user: AdminUser }>('/auth/me');
      set({ isAuthenticated: true, user: data.user });
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },
}));

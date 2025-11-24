import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const defaultUsers: { email: string; password: string; user: User }[] = [
  {
    email: 'health@gmail.com',
    password: 'admin',
    user: {
      id: '1',
      email: 'health@gmail.com',
      name: 'Admin User',
      role: 'admin',
      phone: '+1234567890',
      createdAt: new Date(),
    },
  },
  {
    email: 'user@example.com',
    password: 'user',
    user: {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: 'user',
      phone: '+0987654321',
      createdAt: new Date(),
    },
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const account = defaultUsers.find(
          (acc) => acc.email === email && acc.password === password
        );
        if (account) {
          set({ user: account.user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

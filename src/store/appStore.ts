import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Disease, Meal, UserSettings } from '../types/index';

interface AppState {
  selectedDisease: Disease | null;
  meals: Meal[];
  settings: UserSettings;
  setSelectedDisease: (disease: Disease | null) => void;
  toggleDarkMode: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedDisease: null,
      meals: [],
      settings: {
        darkMode: false,
        notifications: {
          enabled: false,
          medicineReminder: false,
          time: '09:00',
        },
      },
      setSelectedDisease: (disease) => set({ selectedDisease: disease }),
      toggleDarkMode: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            darkMode: !state.settings.darkMode,
          },
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'app-storage',
    }
  )
);

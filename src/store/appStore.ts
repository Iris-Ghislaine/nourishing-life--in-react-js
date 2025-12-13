import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { diseases } from '../data/diseases';
import { allMeals } from '../data/meals';
import type { Disease, Meal, UserSettings, Notification } from '../types/index';

interface AppState {
  selectedDisease: Disease | null;
  meals: Meal[];
  diseases: Disease[];
  settings: UserSettings;
  notifications: Notification[];
  setSelectedDisease: (disease: Disease | null) => void;
  toggleDarkMode: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
  addDisease: (disease: Omit<Disease, 'id'>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateDisease: (id: string, updates: Partial<Disease>) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  deleteDisease: (id: string) => void;
  deleteMeal: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedDisease: null,
      meals: allMeals,
      diseases: diseases,
      notifications: [],
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
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings };
          
          // If notifications are being enabled, add a welcome notification
          if (newSettings.notifications?.enabled && !state.settings.notifications.enabled) {
            const welcomeNotification: Notification = {
              id: Date.now().toString(),
              title: 'Notifications Enabled',
              message: 'You will now receive health reminders and meal suggestions.',
              type: 'general',
              isRead: false,
              createdAt: new Date()
            };
            
            return {
              settings: updatedSettings,
              notifications: [...state.notifications, welcomeNotification]
            };
          }
          
          // If medicine reminder is enabled, add a medicine notification
          if (newSettings.notifications?.medicineReminder && !state.settings.notifications.medicineReminder) {
            const medicineNotification: Notification = {
              id: (Date.now() + 1).toString(),
              title: 'Medicine Reminder Set',
              message: `Daily medicine reminder set for ${newSettings.notifications.time || state.settings.notifications.time}.`,
              type: 'medicine',
              isRead: false,
              createdAt: new Date()
            };
            
            return {
              settings: updatedSettings,
              notifications: [...state.notifications, medicineNotification]
            };
          }
          
          return { settings: updatedSettings };
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              createdAt: new Date()
            },
            ...state.notifications
          ]
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          )
        })),
      clearAllNotifications: () => set({ notifications: [] }),
      getUnreadCount: () => {
        const state = useAppStore.getState();
        return state.notifications.filter(n => !n.isRead).length;
      },
      addDisease: (disease) =>
        set((state) => ({
          diseases: [
            ...state.diseases,
            { ...disease, id: Date.now().toString() }
          ]
        })),
      addMeal: (meal) =>
        set((state) => ({
          meals: [
            ...state.meals,
            { ...meal, id: Date.now().toString() }
          ]
        })),
      updateDisease: (id, updates) =>
        set((state) => ({
          diseases: state.diseases.map(d =>
            d.id === id ? { ...d, ...updates } : d
          )
        })),
      updateMeal: (id, updates) =>
        set((state) => ({
          meals: state.meals.map(m =>
            m.id === id ? { ...m, ...updates } : m
          )
        })),
      deleteDisease: (id) =>
        set((state) => ({
          diseases: state.diseases.filter(d => d.id !== id),
          meals: state.meals.filter(m => m.diseaseId !== id)
        })),
      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter(m => m.id !== id)
        }))
    }),
    {
      name: 'app-storage',
    }
  )
);

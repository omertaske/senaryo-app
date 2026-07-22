import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      activeTheme: 'midnight',
      setTheme: (theme) => set({ activeTheme: theme })
    }),
    { name: 'auteur-theme-storage' }
  )
);
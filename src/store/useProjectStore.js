import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { get, set, del } from 'idb-keyval';

// 1. SINIRSIZ ASENKRON DEPOLAMA MOTORU (INDEXEDDB)
const idbStorage = {
  getItem: async (name) => {
    const value = await get(name);
    return value || null;
  },
  setItem: async (name, value) => {
    await set(name, value);
  },
  removeItem: async (name) => {
    await del(name);
  }
};

export const useProjectStore = create(
  persist(
    (set) => ({
      // YENİ: Veritabanı okuması bitti mi? (Sayfa yenilendiğinde silinmiş gibi görünmesini engeller)
      isHydrated: false,
      setHydrated: (status) => set({ isHydrated: status }),

      projects: [],
      activeProject: null,
      tempEditTarget: null,

      addProject: (title) => set((state) => ({
        projects: [
          ...state.projects, 
          {
            id: uuidv4(), title, synopsis: "", treatment: "", characters: [], locations: [], scenes: [], episodes: [],
            createdAt: new Date().toISOString(), lastModified: new Date().toISOString()
          }
        ]
      })),

      setActiveProject: (id) => set((state) => ({
        activeProject: state.projects.find(p => p.id === id) || null
      })),

      updateActiveProject: (updates) => set((state) => {
        if (!state.activeProject) return state;
        const updatedProject = { ...state.activeProject, ...updates, lastModified: new Date().toISOString() };
        return {
          activeProject: updatedProject,
          projects: state.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
        };
      }),

      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        activeProject: state.activeProject?.id === id ? null : state.activeProject
      })),

      setTempEditTarget: (type, id) => set({ tempEditTarget: { type, id } }),
      clearTempEditTarget: () => set({ tempEditTarget: null })
    }),
    {
      name: 'senaryo-sinirsiz-db', // İsim yenilendi, tertemiz ve sınırsız sayfa açıyoruz
      
      // JSONStorage kullanarak her türlü datayı (resim, ses dahil) güvenle stringe çevirip IDB'ye atarız.
      storage: createJSONStorage(() => idbStorage), 
      
      // DataCloneError'u engelleyen sihir: Sadece veriyi kaydet, fonksiyonları kaydetme!
      partialize: (state) => ({ 
        projects: state.projects, 
        activeProject: state.activeProject 
      }),
      
      // YENİ: IndexedDB'den veriler TAMAMEN yüklendiğinde kilidi aç!
      onRehydrateStorage: () => (state) => {
        state.setHydrated(true);
      }
    }
  )
);
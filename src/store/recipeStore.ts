import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe, Category } from '../types';
import { mockRecipes } from '../data/mockRecipes';
import { pullFromGithub, pushToGithub, mergeRecipes } from '../lib/githubSync';

interface RecipeStore {
  recipes: Recipe[];
  searchQuery: string;
  activeCategory: Category;
  isSyncing: boolean;
  lastSyncTime: string | null;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: Category) => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
  syncFromGithub: () => Promise<boolean>;
  syncToGithub: () => Promise<boolean>;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      recipes: mockRecipes,
      searchQuery: '',
      activeCategory: 'all',
      isSyncing: false,
      lastSyncTime: null,

      addRecipe: (recipe) => {
        const now = new Date().toISOString();
        const newRecipe: Recipe = {
          ...recipe,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ recipes: [newRecipe, ...state.recipes] }));
      },

      updateRecipe: (id, updates) => {
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      deleteRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setActiveCategory: (category) => set({ activeCategory: category }),

      exportToJSON: () => {
        const data = {
          version: 1,
          exportAt: new Date().toISOString(),
          recipes: get().recipes,
        };
        return JSON.stringify(data, null, 2);
      },

      importFromJSON: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.recipes && Array.isArray(data.recipes)) {
            set({ recipes: data.recipes });
          }
        } catch (e) {
          alert('导入失败，请检查文件格式');
        }
      },

      // 从 GitHub 拉取并合并
      syncFromGithub: async () => {
        set({ isSyncing: true });
        try {
          const remoteContent = await pullFromGithub();
          if (remoteContent) {
            const remoteData = JSON.parse(remoteContent);
            if (remoteData.recipes && Array.isArray(remoteData.recipes)) {
              const localRecipes = get().recipes;
              const merged = mergeRecipes(localRecipes, remoteData.recipes);
              set({ 
                recipes: merged,
                lastSyncTime: new Date().toISOString()
              });
              return true;
            }
          }
          return false;
        } catch (err) {
          console.error('Sync from GitHub failed:', err);
          return false;
        } finally {
          set({ isSyncing: false });
        }
      },

      // 推送到 GitHub
      syncToGithub: async () => {
        set({ isSyncing: true });
        try {
          const data = {
            version: 1,
            updatedAt: new Date().toISOString(),
            recipes: get().recipes,
          };
          const success = await pushToGithub(JSON.stringify(data, null, 2));
          if (success) {
            set({ lastSyncTime: new Date().toISOString() });
          }
          return success;
        } catch (err) {
          console.error('Sync to GitHub failed:', err);
          return false;
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'family-recipes-data',
      version: 1,
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe, Category } from '../types';
import { mockRecipes } from '../data/mockRecipes';

interface RecipeStore {
  recipes: Recipe[];
  searchQuery: string;
  activeCategory: Category;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: Category) => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      recipes: mockRecipes,
      searchQuery: '',
      activeCategory: 'all',

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
    }),
    {
      name: 'family-recipes-data',
      version: 1,
    }
  )
);

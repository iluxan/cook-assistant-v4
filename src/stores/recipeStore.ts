import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Recipe {
  id: string;
  content: string;
  createdAt: Date;
}

interface RecipeStore {
  recipes: Recipe[];
  addRecipe: (content: string) => void;
  removeRecipe: (id: string) => void;
}

export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set) => ({
      recipes: [],
      addRecipe: (content) =>
        set((state) => ({
          recipes: [
            ...state.recipes,
            {
              id: Date.now().toString(),
              content,
              createdAt: new Date(),
            },
          ],
        })),
      removeRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        })),
    }),
    {
      name: 'recipes-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recipes: state.recipes }),
    }
  )
);
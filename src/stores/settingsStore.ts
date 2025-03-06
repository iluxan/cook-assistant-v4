import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ModelType = 'huggingface' | 'openai';

interface SettingsStore {
  modelType: ModelType;
  openaiKey: string;
  huggingfaceKey: string;
  setModelType: (type: ModelType) => void;
  setOpenAIKey: (key: string) => void;
  setHuggingFaceKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      modelType: 'huggingface',
      openaiKey: '',
      huggingfaceKey: '',
      setModelType: (type) => set({ modelType: type }),
      setOpenAIKey: (key) => set({ openaiKey: key }),
      setHuggingFaceKey: (key) => set({ huggingfaceKey: key }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
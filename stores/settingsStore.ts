import { create } from 'zustand';

interface SettingsStore {
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
}));
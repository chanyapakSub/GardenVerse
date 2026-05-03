import { create } from 'zustand';

interface AppState {
  isAddModalOpen: boolean;
  openAddModal: () => void;
  closeAddModal: () => void;
}

export const useStore = create<AppState>((set) => ({
  isAddModalOpen: false,
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
}));

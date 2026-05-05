import { create } from 'zustand';

export interface PlantItem {
  id: string;
  type: 'pot' | 'bed';
  plantId: number | null;
  plantModel: string | null; // e.g. 'sunflower'
  position: [number, number, number];
  name?: string;
  zone?: string;
}

interface AppState {
  isAddModalOpen: boolean;
  selectedItemId: string | null;
  openAddModal: (itemId?: string) => void;
  closeAddModal: () => void;
  items: PlantItem[];
  addItem: (item: PlantItem) => void;
  updateItem: (id: string, updates: Partial<PlantItem>) => void;
  placementMode: 'pot' | 'bed' | null;
  setPlacementMode: (mode: 'pot' | 'bed' | null) => void;
  // Currently selected plant from the bottom panel
  selectedPlantModel: string | null;
  selectPlantModel: (model: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  isAddModalOpen: false,
  selectedItemId: null,
  openAddModal: (itemId) => set({ isAddModalOpen: true, selectedItemId: itemId || null }),
  closeAddModal: () => set({ isAddModalOpen: false, selectedItemId: null }),
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, ...updates } : item)
  })),
  placementMode: null,
  setPlacementMode: (mode) => set({ placementMode: mode }),
  selectedPlantModel: null,
  selectPlantModel: (model) => set({ selectedPlantModel: model }),
}));

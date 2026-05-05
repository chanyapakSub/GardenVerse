import { create } from 'zustand';

// ===== ค่าคงที่สำหรับ Grid System =====
export const GRID_SIZE = 10;        // 10x10 blocks
export const CELL_SIZE = 2;         // ขนาด 1 block ในหน่วย 3D
export const GRID_HALF = (GRID_SIZE * CELL_SIZE) / 2; // ใช้จัดให้ grid อยู่ตรงกลาง

// ===== ข้อมูลพืชที่ปลูกได้ (mock data) =====
export interface PlantInfo {
  id: number;
  name: string;
  scientificName: string;
  emoji: string;
  image: string;
  description: string;
  sunlight: string;
  water: string;
  temperature: string;
  soil: string;
}

export const PLANT_CATALOG: PlantInfo[] = [
  {
    id: 1,
    name: 'ทิวลิป',
    scientificName: 'Tulipa spp.',
    emoji: '🌷',
    image: '/images/flower/Tilip.png',
    description: 'ทิวลิปเป็นไม้ดอกหัวฤดูหนาวที่นิยมปลูกในโรงเรือน ต้องการแสงแดดเพียงพอ อากาศเย็น และดินระบายน้ำดี',
    sunlight: '6-8 ชม./วัน',
    water: 'ปานกลาง',
    temperature: '15-20 °C',
    soil: 'ร่วนซุย',
  },
  {
    id: 2,
    name: 'กุหลาบ',
    scientificName: 'Rosa spp.',
    emoji: '🌹',
    image: '/images/flower/Rose.png',
    description: 'กุหลาบเป็นไม้ดอกที่ต้องการการดูแลพอประมาณ ชอบแดดจัดและดินที่อุดมสมบูรณ์',
    sunlight: '6-8 ชม./วัน',
    water: 'ปานกลาง',
    temperature: '18-25 °C',
    soil: 'ร่วนระบายน้ำดี',
  },
  {
    id: 3,
    name: 'มะเขือเทศ',
    scientificName: 'Solanum lycopersicum',
    emoji: '🍅',
    image: '/images/vegetable/Tomato.png',
    description: 'มะเขือเทศเป็นพืชผักที่นิยมปลูกในแปลงผักสวนครัว ต้องการแดดจัดและน้ำสม่ำเสมอ',
    sunlight: '6-8 ชม./วัน',
    water: 'มาก',
    temperature: '20-28 °C',
    soil: 'ร่วนซุย',
  },
  {
    id: 4,
    name: 'ผักกาดหอม',
    scientificName: 'Lactuca sativa',
    emoji: '🥬',
    image: '/images/vegetable/Lettuce.png',
    description: 'ผักกาดหอมเติบโตเร็ว เหมาะปลูกในแปลงหรือกระถาง ชอบอากาศเย็น',
    sunlight: '4-6 ชม./วัน',
    water: 'ปานกลาง-มาก',
    temperature: '15-22 °C',
    soil: 'ร่วนซุย',
  },
];

// ===== โครงสร้างข้อมูล Item =====
export interface PlantItem {
  id: string;
  type: 'pot' | 'bed';
  plantId: number | null;
  // ใช้ grid coordinate (col, row) แทน position 3D ตรงๆ
  // เพื่อให้ snap to grid และตรวจสอบช่องว่างได้ง่าย
  gridX: number;
  gridZ: number;
  name?: string;
  zone?: string;
  health?: number;
  plantedAt?: string;
}

// ===== แปลง grid coordinate เป็น position 3D =====
export function gridToPosition(gridX: number, gridZ: number): [number, number, number] {
  // จัดให้ grid อยู่ตรงกลาง (-GRID_HALF ถึง +GRID_HALF)
  const x = gridX * CELL_SIZE - GRID_HALF + CELL_SIZE / 2;
  const z = gridZ * CELL_SIZE - GRID_HALF + CELL_SIZE / 2;
  return [x, 0, z];
}

// ===== แปลง position 3D เป็น grid coordinate =====
export function positionToGrid(x: number, z: number): [number, number] {
  const gridX = Math.floor((x + GRID_HALF) / CELL_SIZE);
  const gridZ = Math.floor((z + GRID_HALF) / CELL_SIZE);
  return [gridX, gridZ];
}

// ===== Store =====
interface AppState {
  // Items
  items: PlantItem[];
  addItem: (item: PlantItem) => void;
  updateItem: (id: string, updates: Partial<PlantItem>) => void;
  removeItem: (id: string) => void;

  // Selection (ข้อ 1: คลิกแล้วแสดงด้านขวา)
  selectedItemId: string | null;
  selectItem: (id: string | null) => void;

  // Edit mode (ข้อ 2: คลิกขวาเพื่อแก้ไข)
  isEditMode: boolean;
  setEditMode: (edit: boolean) => void;

  // Hovered grid cell (ข้อ 2: highlight block)
  hoveredCell: [number, number] | null;
  setHoveredCell: (cell: [number, number] | null) => void;

  // Placement mode
  placementMode: 'pot' | 'bed' | null;
  setPlacementMode: (mode: 'pot' | 'bed' | null) => void;

  // AddModal
  isAddModalOpen: boolean;
  pendingItemId: string | null; // item ที่เพิ่งวางและรอเลือกพืช
  openAddModal: (itemId?: string) => void;
  closeAddModal: () => void;

  // Helper: ตรวจสอบว่า cell นี้ว่างมั้ย
  isCellOccupied: (gridX: number, gridZ: number) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  // ===== Items =====
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((it) => it.id !== id),
    selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
  })),

  // ===== Selection =====
  selectedItemId: null,
  selectItem: (id) => set({ selectedItemId: id, isEditMode: false }),

  // ===== Edit mode =====
  isEditMode: false,
  setEditMode: (edit) => set({ isEditMode: edit }),

  // ===== Hovered cell =====
  hoveredCell: null,
  setHoveredCell: (cell) => set({ hoveredCell: cell }),

  // ===== Placement mode =====
  placementMode: null,
  setPlacementMode: (mode) => set({ placementMode: mode, hoveredCell: null }),

  // ===== AddModal =====
  isAddModalOpen: false,
  pendingItemId: null,
  openAddModal: (itemId) => set({ isAddModalOpen: true, pendingItemId: itemId || null }),
  closeAddModal: () => set({ isAddModalOpen: false, pendingItemId: null }),

  // ===== Helpers =====
  isCellOccupied: (gridX, gridZ) => {
    return get().items.some((it) => it.gridX === gridX && it.gridZ === gridZ);
  },
}));
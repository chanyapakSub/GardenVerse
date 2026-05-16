import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

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
  modelPath: string;
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
    modelPath: '/3D/plants/tulip.glb',
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
    modelPath: '/3D/plants/rose.glb',
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
    modelPath: '/3D/plants/tomato.glb',
    description: 'มะเขือเทศเป็นพืชผักที่นิยมปลูกในแปลงผักสวนครัว ต้องการแดดจัดและน้ำสม่ำเสมอ',
    sunlight: '6-8 ชม./วัน',
    water: 'มาก',
    temperature: '20-28 °C',
    soil: 'ร่วนซุย',
  },
  {
    id: 4,
    name: 'ทานตะวัน',
    scientificName: 'Helianthus annuus',
    emoji: '🌻',
    image: '/images/flower/Tantawan.png',
    modelPath: '/3D/plants/sunflower.glb',
    description: 'ทานตะวันชอบแสงแดดจัดมาก เติบโตเร็ว และทนทานต่อสภาพอากาศ',
    sunlight: '8-10 ชม./วัน',
    water: 'ปานกลาง',
    temperature: '20-35 °C',
    soil: 'ทุกสภาพดิน',
  },
  {
    id: 5,
    name: 'มอนสเตอร่า',
    scientificName: 'Monstera deliciosa',
    emoji: '🌿',
    image: '/images/flower/Lavender.png',
    modelPath: '/3D/plants/monstera.glb',
    description: 'ราชินีแห่งไม้ใบ มีความสวยงามแปลกตา ดูแลง่าย ชอบแสงรำไร',
    sunlight: '3-5 ชม./วัน',
    water: 'ปานกลาง',
    temperature: '18-30 °C',
    soil: 'ร่วนระบายน้ำดี',
  },
  {
    id: 6,
    name: 'ลิลลี่ม่วง',
    scientificName: 'Lilium spp.',
    emoji: '🪻',
    image: '/images/flower/Haidenyia.png',
    modelPath: '/3D/plants/purple_lilies.glb',
    description: 'ดอกลิลลี่สีม่วง สัญลักษณ์ของความสง่างามและความมั่งคั่ง',
    sunlight: '4-6 ชม./วัน',
    water: 'ปานกลาง',
    temperature: '15-22 °C',
    soil: 'ร่วนซุย',
  },
];

// ===== ข้อมูลของตกแต่ง (Decoration) =====
export const DECO_CATALOG: PlantInfo[] = [
  {
    id: 101, // ใช้ id หลักร้อยสำหรับของตกแต่ง
    name: 'แจกันตกแต่ง',
    scientificName: 'Garden Vase',
    emoji: '🏺',
    image: '/images/deco/table.png', // สมมติว่ามีรูป
    modelPath: '/3D/vase.glb',
    description: 'แจกันไม้สำหรับนั่งพักผ่อนในสวน ทนแดดทนฝน',
    sunlight: '-',
    water: '-',
    temperature: '-',
    soil: '-',
  },
];

// ===== ข้อมูลเซนเซอร์ (ESP32 nodes) =====
export interface DeviceInfo {
  id: string;          // ตรงกับ device_id ที่ ESP ส่งขึ้น Firebase
  name: string;
  sensors: string[];   // ['temperature', 'humidity', 'lux']
  description: string;
}

export const DEVICE_CATALOG: DeviceInfo[] = [
  {
    id: 'esp32-sensor-01',
    name: 'ESP32 #1 (BME680 + BH1750)',
    sensors: ['temperature', 'humidity', 'lux'],
    description: 'วัดอุณหภูมิ ความชื้นอากาศ และแสงสว่าง',
  },
  {
    id: 'esp32-sensor-02',
    name: 'ESP32 #2 (SHT3X + BH1750)',
    sensors: ['temperature', 'humidity', 'lux'],
    description: 'วัดอุณหภูมิ ความชื้นอากาศ และแสงสว่าง',
  },
];

// ===== โครงสร้างข้อมูล Item =====
export interface PlantItem {
  id: string;
  type: 'pot' | 'bed' | 'deco'; // เพิ่ม deco
  plantId: number | null;
  // ใช้ grid coordinate (col, row) แทน position 3D ตรงๆ
  // เพื่อให้ snap to grid และตรวจสอบช่องว่างได้ง่าย
  gridX: number;
  gridZ: number;
  plotId: string;
  name?: string;
  zone?: string;
  health?: number;
  plantedAt?: string;
  deviceId?: string;   // device_id ของเซนเซอร์ที่ผูกกับ pot/plot นี้
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

// ===== โครงสร้างข้อมูล UserPlant (shared across pages) =====
export interface UserPlant {
  id: string | number;
  username: string;
  name: string;
  sciName?: string;
  status?: string;
  statusColor?: string;
  age?: string;
  planted?: string;
  water?: string;
  image: string;
}

// ===== โรงเรือน / แปลง (สร้างเอง ตั้งชื่อเอง) =====
export interface Greenhouse {
  id: string;
  name: string;
}

export interface Plot {
  id: string;
  greenhouseId: string;
  name: string;
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
  placementMode: 'pot' | 'bed' | 'deco' | null; // เพิ่ม deco
  setPlacementMode: (mode: 'pot' | 'bed' | 'deco' | null) => void;

  // AddModal
  isAddModalOpen: boolean;
  pendingItemId: string | null; // item ที่เพิ่งวางและรอเลือกพืช
  openAddModal: (itemId?: string) => void;
  closeAddModal: () => void;

  // AddPlantModal (Add new plant to collection/database)
  isAddPlantModalOpen: boolean;
  openAddPlantModal: () => void;
  closeAddPlantModal: () => void;

  // Interactive Care Tools
  activeCareTool: 'water' | 'fertilize' | null;
  setActiveCareTool: (tool: 'water' | 'fertilize' | null) => void;
  animatingItemId: string | null;
  setAnimatingItemId: (id: string | null) => void;

  // Plot Selection
  selectedPlotId: string | null;
  setSelectedPlotId: (id: string | null) => void;

  // Animation States (Specific for separate components)
  isWateringItemId: string | null;
  setIsWateringItemId: (id: string | null) => void;
  isFertilizingItemId: string | null;
  setIsFertilizingItemId: (id: string | null) => void;

  // Detection History
  detectionHistory: Array<{
    id: string;
    prediction: string;
    confidence: number;
    advice: string;
    timestamp: string;
    imageUrl: string;
  }>;
  addDetectionHistory: (entry: {
    prediction: string;
    confidence: number;
    advice: string;
    imageUrl: string;
  }) => void;

  // Helper: ตรวจสอบว่า cell นี้ว่างมั้ย
  isCellOccupied: (gridX: number, gridZ: number) => boolean;

  // Helper: หา item ที่ผูกอยู่กับ deviceId นี้ (ใช้กรองตอนเลือกเซนเซอร์)
  getItemByDeviceId: (deviceId: string) => PlantItem | undefined;

  // ===== User Plants (shared: home BottomPanel <-> plants page) =====
  userPlants: UserPlant[];
  setUserPlants: (plants: UserPlant[]) => void;
  addUserPlant: (plant: UserPlant) => void;
  loadUserPlants: (username: string) => Promise<void>;

  // ===== Garden items persistence =====
  loadGardenItems: (username: string) => Promise<void>;

  // ===== Greenhouses & Plots (user-managed) =====
  greenhouses: Greenhouse[];
  plots: Plot[];
  loadGreenhouses: (username: string) => Promise<void>;
  loadPlots: (username: string) => Promise<void>;
  addGreenhouse: (name: string) => Promise<Greenhouse | null>;
  renameGreenhouse: (id: string, name: string) => Promise<void>;
  removeGreenhouse: (id: string) => Promise<void>;
  addPlot: (greenhouseId: string, name: string) => Promise<Plot | null>;
  renamePlot: (id: string, name: string) => Promise<void>;
  removePlot: (id: string) => Promise<void>;
  movePlot: (id: string, newGreenhouseId: string) => Promise<void>;
}

// ===== Persistence helpers (garden_items) =====
function currentUsername(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('current_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.username ?? null;
  } catch {
    return null;
  }
}

// แปลง PlantItem → row พร้อม username สำหรับ upsert
function toItemRow(item: PlantItem, username: string) {
  return {
    id: item.id,
    username,
    type: item.type,
    plantId: item.plantId,
    gridX: item.gridX,
    gridZ: item.gridZ,
    plotId: item.plotId,
    name: item.name ?? null,
    zone: item.zone ?? null,
    health: item.health ?? null,
    plantedAt: item.plantedAt ?? null,
    deviceId: item.deviceId ?? null,
  };
}

async function persistItem(item: PlantItem) {
  const username = currentUsername();
  if (!username) return;
  const { error } = await supabase
    .from('garden_items')
    .upsert(toItemRow(item, username), { onConflict: 'id' });
  if (error) console.warn('persistItem failed:', error.message);
}

async function deleteItem(id: string) {
  const username = currentUsername();
  if (!username) return;
  const { error } = await supabase
    .from('garden_items')
    .delete()
    .eq('id', id)
    .eq('username', username);
  if (error) console.warn('deleteItem failed:', error.message);
}

export const useStore = create<AppState>((set, get) => ({
  // ===== Items =====
  items: [],
  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
    void persistItem(item); // fire-and-forget
  },
  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    }));
    const updated = get().items.find((it) => it.id === id);
    if (updated) void persistItem(updated);
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((it) => it.id !== id),
      selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
    }));
    void deleteItem(id);
  },

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

  // ===== AddPlantModal =====
  isAddPlantModalOpen: false,
  openAddPlantModal: () => set({ isAddPlantModalOpen: true }),
  closeAddPlantModal: () => set({ isAddPlantModalOpen: false }),

  // ===== Interactive Care Tools =====
  activeCareTool: null,
  setActiveCareTool: (tool) => set({ activeCareTool: tool }),
  animatingItemId: null,
  setAnimatingItemId: (id) => set({ animatingItemId: id }),

  // ===== Plot Selection =====
  // ค่าเริ่มต้นเป็น null — ตอนยังไม่มีพืชในสวนจะไม่มีแปลงให้เลือก
  selectedPlotId: null,
  setSelectedPlotId: (id) => set({
    selectedPlotId: id,
    selectedItemId: null,
    isEditMode: false,
    placementMode: null
  }),

  // ===== Animation States =====
  isWateringItemId: null,
  setIsWateringItemId: (id) => set({ isWateringItemId: id }),
  isFertilizingItemId: null,
  setIsFertilizingItemId: (id) => set({ isFertilizingItemId: id }),

  // ===== Detection History =====
  detectionHistory: [],
  addDetectionHistory: (entry) => set((state) => ({
    detectionHistory: [
      {
        ...entry,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleString('th-TH'),
      },
      ...state.detectionHistory,
    ],
  })),

  // ===== Helpers =====
  isCellOccupied: (gridX, gridZ) => {
    const { items, selectedPlotId } = get();
    return items
      .filter(it => it.plotId === selectedPlotId)
      .some((it) => it.gridX === gridX && it.gridZ === gridZ);
  },

  getItemByDeviceId: (deviceId) => {
    return get().items.find((it) => it.deviceId === deviceId);
  },

  // ===== User Plants =====
  userPlants: [],
  setUserPlants: (plants) => set({ userPlants: plants }),
  addUserPlant: (plant) => set((state) => ({ userPlants: [...state.userPlants, plant] })),
  loadUserPlants: async (username) => {
    try {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('username', username)
        .order('id', { ascending: true });
      if (error) throw error;
      set({ userPlants: data ?? [] });
    } catch {
      set({ userPlants: [] });
    }
  },

  // ===== Garden items (pots/beds/decos) persistence =====
  loadGardenItems: async (username) => {
    try {
      const { data, error } = await supabase
        .from('garden_items')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: true });
      if (error) throw error;
      const items: PlantItem[] = (data ?? []).map((row) => ({
        id: row.id,
        type: row.type,
        plantId: row.plantId ?? null,
        gridX: row.gridX,
        gridZ: row.gridZ,
        plotId: row.plotId,
        name: row.name ?? undefined,
        zone: row.zone ?? undefined,
        health: row.health ?? undefined,
        plantedAt: row.plantedAt ?? undefined,
        deviceId: row.deviceId ?? undefined,
      }));
      set({ items });
    } catch {
      set({ items: [] });
    }
  },

  // ===== Greenhouses & Plots =====
  greenhouses: [],
  plots: [],
  loadGreenhouses: async (username) => {
    try {
      const { data, error } = await supabase
        .from('greenhouses')
        .select('id, name')
        .eq('username', username)
        .order('created_at', { ascending: true });
      if (error) throw error;
      set({ greenhouses: data ?? [] });
    } catch {
      set({ greenhouses: [] });
    }
  },
  loadPlots: async (username) => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .select('id, name, greenhouseId')
        .eq('username', username)
        .order('created_at', { ascending: true });
      if (error) throw error;
      set({ plots: data ?? [] });
    } catch {
      set({ plots: [] });
    }
  },
  addGreenhouse: async (name) => {
    const username = currentUsername();
    if (!username) return null;
    const id = `gh_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const row = { id, username, name };
    const { error } = await supabase.from('greenhouses').insert(row);
    if (error) { console.warn('addGreenhouse failed:', error.message); return null; }
    const gh: Greenhouse = { id, name };
    set((state) => ({ greenhouses: [...state.greenhouses, gh] }));
    return gh;
  },
  renameGreenhouse: async (id, name) => {
    set((state) => ({
      greenhouses: state.greenhouses.map((g) => (g.id === id ? { ...g, name } : g)),
    }));
    const { error } = await supabase.from('greenhouses').update({ name }).eq('id', id);
    if (error) console.warn('renameGreenhouse failed:', error.message);
  },
  removeGreenhouse: async (id) => {
    // cascade: ลบ items ที่ plotId อยู่ใน greenhouse นี้ → ลบ plots → ลบ greenhouse
    const { plots, items, selectedPlotId } = get();
    const plotIdsInGreenhouse = plots.filter((p) => p.greenhouseId === id).map((p) => p.id);

    set({
      items: items.filter((it) => !plotIdsInGreenhouse.includes(it.plotId)),
      plots: plots.filter((p) => p.greenhouseId !== id),
      greenhouses: get().greenhouses.filter((g) => g.id !== id),
      selectedPlotId: plotIdsInGreenhouse.includes(selectedPlotId ?? '') ? null : selectedPlotId,
      selectedItemId: null,
    });

    if (plotIdsInGreenhouse.length > 0) {
      await supabase.from('garden_items').delete().in('plotId', plotIdsInGreenhouse);
      await supabase.from('plots').delete().eq('greenhouseId', id);
    }
    const { error } = await supabase.from('greenhouses').delete().eq('id', id);
    if (error) console.warn('removeGreenhouse failed:', error.message);
  },
  addPlot: async (greenhouseId, name) => {
    const username = currentUsername();
    if (!username) return null;
    const id = `plot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const row = { id, username, greenhouseId, name };
    const { error } = await supabase.from('plots').insert(row);
    if (error) { console.warn('addPlot failed:', error.message); return null; }
    const plot: Plot = { id, greenhouseId, name };
    set((state) => ({ plots: [...state.plots, plot] }));
    return plot;
  },
  renamePlot: async (id, name) => {
    set((state) => ({
      plots: state.plots.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
    const { error } = await supabase.from('plots').update({ name }).eq('id', id);
    if (error) console.warn('renamePlot failed:', error.message);
  },
  removePlot: async (id) => {
    const { items, selectedPlotId } = get();
    set({
      items: items.filter((it) => it.plotId !== id),
      plots: get().plots.filter((p) => p.id !== id),
      selectedPlotId: selectedPlotId === id ? null : selectedPlotId,
      selectedItemId: null,
    });
    await supabase.from('garden_items').delete().eq('plotId', id);
    const { error } = await supabase.from('plots').delete().eq('id', id);
    if (error) console.warn('removePlot failed:', error.message);
  },
  movePlot: async (id, newGreenhouseId) => {
    set((state) => ({
      plots: state.plots.map((p) =>
        p.id === id ? { ...p, greenhouseId: newGreenhouseId } : p
      ),
    }));
    const { error } = await supabase
      .from('plots')
      .update({ greenhouseId: newGreenhouseId })
      .eq('id', id);
    if (error) console.warn('movePlot failed:', error.message);
  },
}));
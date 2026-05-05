"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useState } from "react";
import { GreenhouseModel } from "@/components/molecules/GreenhouseModel";
import { PlantPotModel } from "@/components/molecules/PlantPotModel";
import { PlantTrayModel } from "@/components/molecules/PlantTrayModel";
import { SunflowerModel } from "@/components/molecules/SunflowerModel";
import { useStore } from "@/store/useStore";
import { Leaf, Box, Plus, X } from "lucide-react";
import Image from "next/image";
import { myPlants } from "@/lib/mockData";

// Plants that have a 3D model — only these can be placed
// POT_Y_OFFSET: half the rendered pot height (cylinder h=0.6, scale=0.5 → rendered h=0.3, half=0.15)
const POT_Y_OFFSET = 0.15;

const PLANT_3D_MAP: Record<string, { model: string; yOffset: number; scale: number; rotation?: [number,number,number] }> = {
  p5: { model: "sunflower", yOffset: 0.30, scale: 0.04, rotation: [0, Math.PI, 0] }, // ทานตะวัน
};

const PLANT_MODELS: Record<string, (props: any) => JSX.Element> = {
  sunflower: SunflowerModel,
};

// ─── Plant Picker Overlay ───────────────────────────────────────────────────
function PlantPicker({ onSelect, onClose }: { onSelect: (plantId: string) => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-5 w-[360px] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-[15px]">🌱 เลือกพืชที่ต้องการปลูก</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {myPlants.map((plant) => {
            const has3D = !!PLANT_3D_MAP[plant.id];
            return (
              <button
                key={plant.id}
                onClick={() => has3D && onSelect(plant.id)}
                disabled={!has3D}
                title={has3D ? `ปลูก${plant.name}` : "ยังไม่มีโมเดล 3D"}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  has3D
                    ? "border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer"
                    : "border-gray-100 opacity-40 cursor-not-allowed"
                }`}
              >
                <div className="w-12 h-12 relative">
                  <Image src={plant.img} alt={plant.name} fill className="object-contain" />
                </div>
                <span className="text-[12px] font-semibold text-gray-700">{plant.name}</span>
                {has3D && <span className="text-[9px] bg-green-100 text-green-600 rounded-full px-1.5 py-0.5 font-bold">มี 3D</span>}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-gray-400 text-center mt-4">พืชที่แสดงสีจางยังไม่มีโมเดล 3D</p>
      </div>
    </div>
  );
}

// ─── Items Renderer (3D scene) ───────────────────────────────────────────────
function ItemsRenderer({ onPotClick }: { onPotClick: (id: string) => void }) {
  const items = useStore((state) => state.items);
  const placementMode = useStore((state) => state.placementMode);

  return (
    <>
      {items.map((item) => {
        const config = item.plantModel ? Object.values(PLANT_3D_MAP).find(v => v.model === item.plantModel) : null;
        const PlantComp = item.plantModel ? PLANT_MODELS[item.plantModel] : null;

        return (
          <group
            key={item.id}
            // Raise by POT_Y_OFFSET so the bottom of the pot sits flush on the ground
            position={[item.position[0], item.position[1] + POT_Y_OFFSET, item.position[2]]}
            onClick={(e) => {
              e.stopPropagation();
              if (!placementMode) onPotClick(item.id);
            }}
          >
            {item.type === "pot" ? <PlantPotModel scale={0.5} /> : <PlantTrayModel scale={0.5} />}

            {/* Plant model on top of pot */}
            {PlantComp && config && (
              <PlantComp
                scale={config.scale}
                position={[0, config.yOffset, 0]}
                rotation={config.rotation ?? [0, 0, 0]}
              />
            )}

          </group>
        );
      })}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Garden3D() {
  const placementMode = useStore((state) => state.placementMode);
  const setPlacementMode = useStore((state) => state.setPlacementMode);
  const addItem = useStore((state) => state.addItem);
  const updateItem = useStore((state) => state.updateItem);

  // Which pot is waiting for a plant to be chosen
  const [pickingForId, setPickingForId] = useState<string | null>(null);

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    if (!placementMode) return;
    e.stopPropagation();
    const newId = Math.random().toString();
    addItem({
      id: newId,
      type: placementMode,
      plantId: null,
      plantModel: null,
      position: [e.point.x, 0, e.point.z],
    });
    setPlacementMode(null);
    // Immediately prompt to pick a plant
    setPickingForId(newId);
  };

  const handlePlantSelect = (plantId: string) => {
    if (!pickingForId) return;
    const cfg = PLANT_3D_MAP[plantId];
    if (cfg) updateItem(pickingForId, { plantModel: cfg.model });
    setPickingForId(null);
  };

  return (
    <div className="w-full h-full relative cursor-move rounded-2xl overflow-hidden bg-sky-100">
      <Canvas shadows camera={{ position: [0, 5, 22], fov: 45 }}>
        <Suspense fallback={null}>
          <Sky sunPosition={[100, 50, 20]} turbidity={0.1} rayleigh={0.2} mieCoefficient={0.001} mieDirectionalG={0.8} />
          <Environment preset="city" />
          <ambientLight intensity={0.9} color="#ffffff" />
          <directionalLight castShadow position={[50, 50, 20]} intensity={2} color="#ffffff" shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />

          <group position={[0, -2, 0]}>
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.02, 0]}
              onClick={handleGroundClick}
              onPointerOver={() => placementMode && (document.body.style.cursor = "crosshair")}
              onPointerOut={() => (document.body.style.cursor = "auto")}
            >
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#647a59" roughness={1} />
            </mesh>

            <GreenhouseModel scale={1.2} position={[0, 0, 0]} />
            <ItemsRenderer onPotClick={(id) => setPickingForId(id)} />
          </group>

          <ContactShadows resolution={1024} scale={50} blur={2.5} opacity={0.5} far={20} color="#112211" position={[0, -2.05, 0]} />
          <OrbitControls makeDefault enablePan panSpeed={1.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2.05} minDistance={0.5} maxDistance={40} target={[0, 1, 0]} />
        </Suspense>
      </Canvas>

      {/* Hint */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none flex items-center gap-2 z-10 border border-gray-100/50">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20" /></svg>
        <span className="text-xs font-semibold text-gray-700">คลิกซ้ายหมุน • คลิกขวาเลื่อน • ลูกกลิ้งซูม</span>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-10 border border-gray-200">
        <div className="text-sm font-bold text-gray-700 border-r border-gray-200 pr-4 mr-2">เพิ่มไอเทม</div>
        <button
          onClick={() => setPlacementMode(placementMode === "bed" ? null : "bed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${placementMode === "bed" ? "bg-green-500 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
        >
          <Box className="w-5 h-5" />
          <span className="font-semibold text-sm">วางแปลง</span>
        </button>
        <button
          onClick={() => setPlacementMode(placementMode === "pot" ? null : "pot")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${placementMode === "pot" ? "bg-green-500 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
        >
          <Leaf className="w-5 h-5" />
          <span className="font-semibold text-sm">วางกระถาง</span>
        </button>
        {placementMode && (
          <div className="ml-2 text-sm text-green-600 font-medium animate-pulse flex items-center gap-1">
            <Plus className="w-4 h-4" /> คลิกที่พื้นเพื่อวาง
          </div>
        )}
      </div>

      {/* Plant Picker Overlay — appears right after placing a pot */}
      {pickingForId && (
        <PlantPicker
          onSelect={handlePlantSelect}
          onClose={() => setPickingForId(null)}
        />
      )}
    </div>
  );
}

"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows, Environment, Html } from "@react-three/drei";
import { Suspense } from "react";
import { GreenhouseModel } from "@/components/molecules/GreenhouseModel";
import { PlantPotModel } from "@/components/molecules/PlantPotModel";
import { PlantTrayModel } from "@/components/molecules/PlantTrayModel";
import { useStore, gridToPosition, PLANT_CATALOG } from "@/store/useStore";
import { Leaf, Box, Plus, Sprout, X } from "lucide-react";
import { GridFloor } from "@/components/atoms/GridFloor";
import { Plant3DModel } from "@/components/molecules/Plant3DModel";

// Preload plant models
PLANT_CATALOG.forEach(p => {
  if (p.modelPath) {
    // We can't use useGLTF.preload here because it's not a hook, 
    // but we can rely on the component preloading or just let them load lazily in Suspense.
  }
});

// ===== ตัวเรนเดอร์ items ทั้งหมด =====
function ItemsRenderer() {
  const items = useStore((s) => s.items);
  const selectedItemId = useStore((s) => s.selectedItemId);
  const placementMode = useStore((s) => s.placementMode);
  const selectItem = useStore((s) => s.selectItem);
  const setEditMode = useStore((s) => s.setEditMode);
  const isAddModalOpen = useStore((s) => s.isAddModalOpen);

  // คลิกซ้ายที่ item → เลือกเพื่อดูข้อมูล
  const handleItemClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    if (placementMode) return; // ตอนวางอยู่ ไม่ให้เลือก
    selectItem(id);
    setEditMode(false);
  };

  // คลิกขวาที่ item → เปิดโหมดแก้ไข
  const handleItemContextMenu = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    if (placementMode) return;
    selectItem(id);
    setEditMode(true);
  };

  return (
    <>
      {items.map((item) => {
        const pos = gridToPosition(item.gridX, item.gridZ);
        const isSelected = selectedItemId === item.id;
        const plant = item.plantId ? PLANT_CATALOG.find((p) => p.id === item.plantId) : null;

        return (
          <group
            key={item.id}
            position={pos}
            onClick={(e) => handleItemClick(e, item.id)}
            onContextMenu={(e) => handleItemContextMenu(e, item.id)}
          >
            {/* Selection ring (วงกลม highlight ตอนถูกเลือก) */}
            {isSelected && (
              <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.7, 0.85, 32]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
              </mesh>
            )}

            {/* Model - raised slightly to not be buried */}
            <group position={[0, 0.05, 0]}>
              {item.type === "pot" ? <PlantPotModel scale={0.6} /> : <PlantTrayModel scale={0.6} />}
            </group>

            {/* แสดงพืชที่ปลูก (ถ้ามี) */}
            {plant && (
              <>
                {item.type === "pot" ? (
                  // กระถาง: ปลูก 1 ต้น ตรงกลาง (Soil surface is at 0.218)
                  <group position={[0, 0.218, 0]}>
                    <Plant3DModel 
                      modelPath={plant.modelPath} 
                      scale={1.0} 
                    />
                  </group>
                ) : (
                  // แปลง: ปลูก 4 ต้น (2x2 grid) (Soil surface is at 0.17)
                  <group position={[0, 0.17, 0]}>
                    <Plant3DModel modelPath={plant.modelPath} scale={1.0} position={[-0.4, 0, -0.4]} />
                    <Plant3DModel modelPath={plant.modelPath} scale={1.0} position={[0.4, 0, -0.4]} />
                    <Plant3DModel modelPath={plant.modelPath} scale={1.0} position={[-0.4, 0, 0.4]} />
                    <Plant3DModel modelPath={plant.modelPath} scale={1.0} position={[0.4, 0, 0.4]} />
                  </group>
                )}
              </>
            )}

            {/* ป้ายชื่อ - ซ่อนถ้าเปิด Modal หรือ Placement mode */}
            {!isAddModalOpen && !placementMode && (
              <Html
                position={[0, item.type === "pot" ? 0.6 : 0.4, 0]}
                center
                style={{ 
                  pointerEvents: "none",
                  transition: 'opacity 0.2s',
                  opacity: isSelected ? 1 : 0.8
                }}
                distanceFactor={12}
              >
                <div
                  className={`px-1 py-0 rounded-md shadow-sm text-[8px] font-bold whitespace-nowrap transition-all ${isSelected
                    ? "bg-yellow-400/80 text-yellow-900 scale-105"
                    : plant
                      ? "bg-green-500/30 text-white backdrop-blur-[1px]"
                      : "bg-white/30 text-gray-700 backdrop-blur-[1px]"
                    }`}
                >
                  {plant ? `${plant.emoji} ${plant.name}` : item.type === "pot" ? "ว่าง" : "ว่าง"}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </>
  );
}

// ===== หน้าหลัก Garden3D =====
export default function Garden3D() {
  const placementMode = useStore((s) => s.placementMode);
  const setPlacementMode = useStore((s) => s.setPlacementMode);
  const items = useStore((s) => s.items);

  return (
    <div className="w-full h-full relative cursor-move rounded-2xl overflow-hidden bg-sky-100">
      {/* ปิด context menu ของ browser ใน 3D area */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 16], fov: 50 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense fallback={null}>
          <Sky
            sunPosition={[100, 50, 20]}
            turbidity={0.1}
            rayleigh={0.2}
            mieCoefficient={0.001}
            mieDirectionalG={0.8}
          />
          <Environment preset="city" />

          <ambientLight intensity={0.9} color="#ffffff" />
          <directionalLight
            castShadow
            position={[50, 50, 20]}
            intensity={2}
            color="#ffffff"
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />

          <group position={[0, -2, 0]}>
            {/* พื้นใหญ่สีเขียว */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#647a59" roughness={1} />
            </mesh>

            <GreenhouseModel scale={1.2} position={[0, 0, 0]} />

            {/* Grid + Highlight system */}
            <GridFloor />

            {/* Items ที่วางไว้ */}
            <ItemsRenderer />
          </group>

          <ContactShadows
            resolution={1024}
            scale={50}
            blur={2.5}
            opacity={0.5}
            far={20}
            color="#112211"
            position={[0, -2.05, 0]}
          />

          <OrbitControls
            makeDefault
            enablePan={true}
            panSpeed={1.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.05}
            minDistance={0.5}
            maxDistance={40}
            target={[0, 1, 0]}
            // ปิดการหมุนด้วยคลิกขวา เพราะคลิกขวาใช้เปิดเมนูแก้ไข
            mouseButtons={{ LEFT: 0, MIDDLE: 1, RIGHT: undefined as any }}
          />
        </Suspense>
      </Canvas>

      {/* Hint การใช้งาน */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none flex items-center gap-2 z-10 border border-gray-100/50">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-500"
        >
          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20" />
        </svg>
        <span className="text-xs font-semibold text-gray-700">
          คลิกซ้ายเลือก • คลิกขวาแก้ไข • ลูกกลิ้งซูม
        </span>
      </div>

      {/* ข้อ 3: Empty state ตอนยังไม่มีพืชเลย */}
      {items.length === 0 && !placementMode && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 z-10 border border-green-100 max-w-sm pointer-events-none">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">สวนของคุณยังว่างเปล่า</h3>
          <p className="text-sm text-gray-500 text-center">
            กดปุ่ม <span className="font-semibold text-green-600">วางแปลง</span> หรือ{" "}
            <span className="font-semibold text-green-600">วางกระถาง</span> ด้านล่าง
            <br />
            แล้วเลือกตำแหน่งบน grid เพื่อเริ่มปลูกพืช
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-10 border border-gray-200">
        <div className="text-sm font-bold text-gray-700 border-r border-gray-200 pr-4 mr-2">
          เพิ่มไอเทม
        </div>

        <button
          onClick={() => setPlacementMode(placementMode === "bed" ? null : "bed")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${placementMode === "bed"
            ? "bg-green-500 text-white shadow-md"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          <Box className="w-5 h-5" />
          <span className="font-semibold text-sm">วางแปลง</span>
        </button>

        <button
          onClick={() => setPlacementMode(placementMode === "pot" ? null : "pot")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${placementMode === "pot"
            ? "bg-green-500 text-white shadow-md"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          <Leaf className="w-5 h-5" />
          <span className="font-semibold text-sm">วางกระถาง</span>
        </button>

        {placementMode && (
          <>
            <div className="ml-2 text-sm text-green-600 font-medium animate-pulse flex items-center gap-1">
              <Plus className="w-4 h-4" /> คลิกที่ block ที่ต้องการ
            </div>
            <button
              onClick={() => setPlacementMode(null)}
              className="ml-2 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              title="ยกเลิก"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
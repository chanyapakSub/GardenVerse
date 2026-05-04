"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows, Environment, Text, Html } from "@react-three/drei";
import { Suspense, useState } from "react";
import { GreenhouseModel } from "@/components/molecules/GreenhouseModel";
import { PlantPotModel } from "@/components/molecules/PlantPotModel";
import { PlantTrayModel } from "@/components/molecules/PlantTrayModel";
import { useStore } from "@/store/useStore";
import { Leaf, Box, Plus } from "lucide-react";

function ItemsRenderer() {
  const items = useStore((state) => state.items);
  const openAddModal = useStore((state) => state.openAddModal);
  const placementMode = useStore((state) => state.placementMode);
  
  const handleItemClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation(); // Prevent ground click
    if (!placementMode) {
      openAddModal(id);
    }
  };

  return (
    <>
      {items.map((item) => (
        <group key={item.id} position={item.position} onClick={(e) => handleItemClick(e, item.id)}>
          {item.type === 'pot' ? (
            <PlantPotModel scale={0.5} />
          ) : (
            <PlantTrayModel scale={0.5} />
          )}
          {/* Label for the item */}
          <Html position={[0, item.type === 'pot' ? 0.6 : 0.4, 0]} center style={{ pointerEvents: 'none' }}>
            <div className={`px-2 py-1 rounded shadow-md text-xs font-bold whitespace-nowrap transition-transform ${item.plantId ? 'bg-green-500 text-white' : 'bg-white text-gray-700'}`}>
              {item.name || (item.type === 'pot' ? 'กระถาง (ว่าง)' : 'แปลง (ว่าง)')}
              {!item.plantId && <span className="ml-1 text-xs opacity-70">(คลิกเพื่อปลูก)</span>}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

export default function Garden3D() {
  const placementMode = useStore((state) => state.placementMode);
  const setPlacementMode = useStore((state) => state.setPlacementMode);
  const addItem = useStore((state) => state.addItem);

  const handleGroundClick = (e: ThreeEvent<MouseEvent>) => {
    if (placementMode) {
      e.stopPropagation();
      addItem({
        id: Math.random().toString(),
        type: placementMode,
        plantId: null,
        position: [e.point.x, 0, e.point.z]
      });
      setPlacementMode(null);
    }
  };
  return (
    <div className="w-full h-full relative cursor-move rounded-2xl overflow-hidden bg-sky-100">
      <Canvas shadows camera={{ position: [0, 5, 22], fov: 45 }}>
        <Suspense fallback={null}>
          {/* ท้องฟ้าเสมือนจริง (ฟ้าใสสว่าง) */}
          <Sky 
            sunPosition={[100, 50, 20]} 
            turbidity={0.1} 
            rayleigh={0.2} 
            mieCoefficient={0.001} 
            mieDirectionalG={0.8}
          />
          <Environment preset="city" />
          
          {/* แสงสว่าง (แสงสว่างสดใส) */}
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
            {/* พื้นหลังกว้างๆ สีเขียว จัดให้เสมอกัน (ซ่อนรอยต่อ) */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} onClick={handleGroundClick} onPointerOver={(e) => placementMode && (document.body.style.cursor = 'crosshair')} onPointerOut={(e) => (document.body.style.cursor = 'auto')}>
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#647a59" roughness={1} />
            </mesh>

            {/* นำโมเดล Greenhouse ที่เตรียมไว้มาแสดงผลแทน */}
            <GreenhouseModel scale={1.2} position={[0, 0, 0]} />

            {/* Render pots and trays from store */}
            <ItemsRenderer />
          </group>

          {/* เงาตกกระทบพื้นแบบนุ่มนวล (ปรับสเกลให้ครอบคลุม) */}
          <ContactShadows resolution={1024} scale={50} blur={2.5} opacity={0.5} far={20} color="#112211" position={[0, -2.05, 0]} />
          
          {/* ตัวควบคุมมุมกล้อง */}
          <OrbitControls 
            makeDefault
            enablePan={true}
            panSpeed={1.5}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.05} // ไม่ให้กล้องมุดใต้ดิน
            minDistance={0.5} // ให้ซูม (เดินหน้า) เข้าไปดูใกล้ๆ ได้
            maxDistance={40} // ให้ซูมออกได้พอดี ไม่ไกลเกินจนหลุดหมอก
            target={[0, 1, 0]}
          />
        </Suspense>
      </Canvas>
      
      {/* คำแนะนำการใช้งาน 3D Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none flex items-center gap-2 z-10 border border-gray-100/50">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20"/></svg>
        <span className="text-xs font-semibold text-gray-700">คลิกซ้ายหมุน • คลิกขวาเลื่อน • ลูกกลิ้งเพื่อซูม/เดินหน้า</span>
      </div>

      {/* Toolbar สำหรับเลือกวางแปลงหรือกระถาง */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 z-10 border border-gray-200">
        <div className="text-sm font-bold text-gray-700 border-r border-gray-200 pr-4 mr-2">เพิ่มไอเทม</div>
        
        <button 
          onClick={() => setPlacementMode(placementMode === 'bed' ? null : 'bed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${placementMode === 'bed' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          <Box className="w-5 h-5" />
          <span className="font-semibold text-sm">วางแปลง</span>
        </button>
        
        <button 
          onClick={() => setPlacementMode(placementMode === 'pot' ? null : 'pot')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${placementMode === 'pot' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
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
    </div>
  );
}

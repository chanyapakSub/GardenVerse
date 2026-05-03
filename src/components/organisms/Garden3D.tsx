"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import { GreenhouseModel } from "@/components/molecules/GreenhouseModel";

export default function Garden3D() {
  return (
    <div className="w-full h-full relative cursor-move rounded-2xl overflow-hidden bg-sky-100">
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 45 }}>
        <Suspense fallback={null}>
          {/* ท้องฟ้าเสมือนจริง */}
          <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
          
          {/* แสงสว่าง */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            castShadow 
            position={[10, 20, 10]} 
            intensity={1.5} 
            shadow-mapSize={[2048, 2048]}
          />
          
          <group position={[0, -1, 0]}>
            {/* นำโมเดล Greenhouse ที่เตรียมไว้มาแสดงผลแทน */}
            <GreenhouseModel scale={1} position={[0, 0, 0]} />
          </group>

          {/* เงาตกกระทบพื้นแบบนุ่มนวล */}
          <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.4} far={10} color="#000000" />
          
          {/* ตัวควบคุมมุมกล้อง */}
          <OrbitControls 
            makeDefault
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1} // ไม่ให้กล้องมุดใต้ดิน
            minDistance={5}
            maxDistance={30}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
      
      {/* คำแนะนำการใช้งาน 3D Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none flex items-center gap-2 z-10 border border-gray-100/50">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M2 12h20M12 2v20"/></svg>
        <span className="text-xs font-semibold text-gray-700">คลิกค้างเพื่อหมุน • เลื่อนลูกกลิ้งเพื่อซูม</span>
      </div>
    </div>
  );
}

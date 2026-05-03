"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { GreenhouseModel } from "@/components/molecules/GreenhouseModel";

export default function Garden3D() {
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
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
              <planeGeometry args={[1000, 1000]} />
              <meshStandardMaterial color="#647a59" roughness={1} />
            </mesh>

            {/* นำโมเดล Greenhouse ที่เตรียมไว้มาแสดงผลแทน */}
            <GreenhouseModel scale={1.2} position={[0, 0, 0]} />
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
    </div>
  );
}

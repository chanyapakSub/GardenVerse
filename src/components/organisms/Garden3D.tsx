"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

// Component สำหรับจำลองแปลงผัก/ดอกไม้
function GardenBed({ position, color, label }: { position: [number, number, number], color: string, label?: string }) {
  return (
    <group position={position}>
      {/* ดินในแปลง */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.5, 2]} />
        <meshStandardMaterial color="#5C4033" roughness={0.9} />
      </mesh>
      
      {/* ขอบไม้ของแปลง */}
      <mesh position={[0, 0.25, 1.05]} castShadow>
        <boxGeometry args={[4.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[0, 0.25, -1.05]} castShadow>
        <boxGeometry args={[4.2, 0.6, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[2.05, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 2]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[-2.05, 0.25, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 2]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>

      {/* พืชในแปลง (จำลองเป็นทรงกลม/กรวย) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} position={[-1.5 + (i % 4) * 1, 0.5, -0.5 + Math.floor(i / 4) * 1]}>
          {/* ลำต้น */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.4]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
          {/* ดอก/ใบ */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

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
            {/* พื้นหญ้า */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial color="#7CB342" roughness={1} />
            </mesh>

            {/* ทางเดิน (หิน) */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <planeGeometry args={[2, 20]} />
              <meshStandardMaterial color="#B0BEC5" roughness={0.8} />
            </mesh>
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <planeGeometry args={[20, 2]} />
              <meshStandardMaterial color="#B0BEC5" roughness={0.8} />
            </mesh>

            {/* แปลงปลูกต่างๆ */}
            <GardenBed position={[-4, 0, -4]} color="#FF4081" label="ทิวลิป" />
            <GardenBed position={[4, 0, -4]} color="#FF5252" label="กุหลาบ" />
            <GardenBed position={[-4, 0, 4]} color="#7E57C2" label="ลาเวนเดอร์" />
            <GardenBed position={[4, 0, 4]} color="#FFA000" label="เบญจมาศ" />
            
            {/* โครงโรงเรือนจำลอง (เส้นขอบ) */}
            <mesh position={[0, 4, 0]}>
              <boxGeometry args={[14, 8, 14]} />
              <meshStandardMaterial color="#ffffff" wireframe opacity={0.3} transparent />
            </mesh>
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

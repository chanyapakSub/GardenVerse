"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useStore, gridToPosition } from "@/store/useStore";
import { Html } from "@react-three/drei";

/**
 * CareAnimation - แอนิเมชั่นรดน้ำ/ใส่ปุ๋ย แบบอัตโนมัติ
 */
export function InteractiveCareTool() {
  const activeTool = useStore((s) => s.activeCareTool);
  const setActiveTool = useStore((s) => s.setActiveCareTool);
  const animatingItemId = useStore((s) => s.animatingItemId);
  const setAnimatingItemId = useStore((s) => s.setAnimatingItemId);
  const items = useStore((s) => s.items);
  const updateItem = useStore((s) => s.updateItem);
  
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const [phase, setPhase] = useState<"idle" | "moving" | "pouring" | "returning">("idle");
  const [progress, setProgress] = useState(0);

  const targetItem = useMemo(() => items.find(it => it.id === animatingItemId), [items, animatingItemId]);

  // เริ่ม Animation เมื่อมี item ถูกเลือก
  useEffect(() => {
    if (activeTool && animatingItemId) {
      setPhase("moving");
      setProgress(0);
    } else {
      setPhase("idle");
    }
  }, [activeTool, animatingItemId]);

  // สร้าง Particle
  const particlesCount = 100; // เพิ่มจำนวนเม็ด
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = Math.random() * -2; // กระจายตัวในแนวตั้งรอไว้
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (phase === "idle" || !groupRef.current || !targetItem) return;

    if (phase === "moving") {
      const [tx, ty, tz] = gridToPosition(targetItem.gridX, targetItem.gridZ);
      // ปรับให้ "ปากฝักบัว" (พวยกา) อยู่ตรงกลางต้นไม้พอดี
      // พวยกาห่างจากจุดศูนย์กลางฝักบัว 0.4 หน่วย ดังนั้นต้องเลื่อนฝักบัวไปทางซ้าย 0.4
      const xOffset = activeTool === 'water' ? -0.4 : 0;
      const targetPoint = new THREE.Vector3(tx + xOffset, ty + 2.5, tz);
      
      groupRef.current.position.lerp(targetPoint, 0.1);
      if (groupRef.current.position.distanceTo(targetPoint) < 0.1) {
        setPhase("pouring");
      }
    } else if (phase === "pouring") {
      // เอียงเครื่องมือ
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -Math.PI / 3, 0.1);
      
      // อัปเดต Particle (น้ำ/ปุ๋ย)
      if (particlesRef.current) {
        const attr = particlesRef.current.geometry.attributes.position;
        for (let i = 0; i < particlesCount; i++) {
          const idx = i * 3;
          if (attr.array[idx + 1] < -2.0) {
            attr.array[idx] = (Math.random() - 0.5) * 0.2;
            attr.array[idx + 1] = 0;
            attr.array[idx + 2] = (Math.random() - 0.5) * 0.2;
          } else {
            attr.array[idx + 1] -= activeTool === 'water' ? 0.15 : 0.1;
            attr.array[idx] += (Math.random() - 0.5) * 0.02;
          }
        }
        attr.needsUpdate = true;
      }

      setProgress(prev => prev + delta);
      if (progress > 3.5) { 
        updateItem(targetItem.id, { health: 100 });
        setPhase("returning");
      }
    } else if (phase === "returning") {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.position.y += 0.15;
      
      if (groupRef.current.position.y > 10) {
        setAnimatingItemId(null);
        setActiveTool(null);
        setPhase("idle");
      }
    }
  });

  if (!activeTool || !animatingItemId) return null;

  return (
    <group ref={groupRef} position={[targetItem ? gridToPosition(targetItem.gridX, targetItem.gridZ)[0] : 0, 10, targetItem ? gridToPosition(targetItem.gridX, targetItem.gridZ)[2] : 0]}>
      {/* UI เปอร์เซ็นต์ */}
      <Html position={[0, 1.5, 0]} center>
        <div className={`bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm border whitespace-nowrap transition-opacity duration-300 ${phase === 'pouring' ? 'opacity-100' : 'opacity-0'}`}>
          <span className={activeTool === 'water' ? 'text-blue-600' : 'text-orange-700'}>
            กำลัง{activeTool === 'water' ? 'รดน้ำ' : 'ใส่ปุ๋ย'}... {Math.min(100, Math.round((progress/3.5)*100))}%
          </span>
        </div>
      </Html>

      {/* โมเดลเครื่องมือ */}
      <group scale={0.8}>
        {activeTool === 'water' ? (
          <>
            <mesh castShadow><cylinderGeometry args={[0.3, 0.4, 0.6, 16]} /><meshStandardMaterial color="#3b82f6" /></mesh>
            <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 4]}><cylinderGeometry args={[0.05, 0.1, 0.5, 8]} /><meshStandardMaterial color="#3b82f6" /></mesh>
          </>
        ) : (
          <>
            <mesh castShadow><boxGeometry args={[0.5, 0.7, 0.15]} /><meshStandardMaterial color="#fcd34d" /></mesh>
            <mesh position={[0, 0, 0.08]}><planeGeometry args={[0.3, 0.4]} /><meshStandardMaterial color="#b45309" /></mesh>
          </>
        )}
      </group>
      
      {/* เอฟเฟกต์เทน้ำ/ปุ๋ย - แสดงเฉพาะตอนรด */}
      <points 
        ref={particlesRef} 
        position={[activeTool === 'water' ? 0.4 : 0, -0.3, 0]} 
        visible={phase === "pouring"}
      >
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          color={activeTool === 'water' ? "#3b82f6" : "#78350f"} 
          size={0.06} 
          transparent 
          opacity={0.8} 
        />
      </points>
    </group>
  );
}

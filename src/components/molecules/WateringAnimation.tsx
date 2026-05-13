"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useStore, gridToPosition } from "@/store/useStore";

/**
 * WateringAnimation - แสดงฝักบัวรดน้ำและน้ำไหล
 */
export function WateringAnimation() {
  const isWateringItemId = useStore((s) => s.isWateringItemId);
  const setIsWateringItemId = useStore((s) => s.setIsWateringItemId);
  const items = useStore((s) => s.items);
  const updateItem = useStore((s) => s.updateItem);
  
  const targetItem = items.find((it) => it.id === isWateringItemId);
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const [phase, setPhase] = useState<"idle" | "moving" | "pouring" | "returning">("idle");
  const [progress, setProgress] = useState(0);

  // เตรียมตำแหน่งเป้าหมาย
  const targetPos = useMemo(() => {
    if (!targetItem) return new THREE.Vector3(0, 0, 0);
    const [x, y, z] = gridToPosition(targetItem.gridX, targetItem.gridZ);
    return new THREE.Vector3(x, y + 2.5, z + 1); // ลอยเหนือต้นไม้เยื้องออกมานิดหน่อย
  }, [targetItem]);

  // เริ่ม Animation เมื่อมี item ถูกเลือก
  useEffect(() => {
    if (isWateringItemId) {
      setPhase("moving");
      setProgress(0);
    } else {
      setPhase("idle");
    }
  }, [isWateringItemId]);

  // สร้าง Particle สำหรับน้ำ
  const particlesCount = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (phase === "idle" || !groupRef.current) return;

    if (phase === "moving") {
      // เคลื่อนที่ไปหาต้นไม้
      groupRef.current.position.lerp(targetPos, 0.1);
      if (groupRef.current.position.distanceTo(targetPos) < 0.1) {
        setPhase("pouring");
        setProgress(0);
      }
    } else if (phase === "pouring") {
      // เอียงฝักบัว
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -Math.PI / 4, 0.1);
      
      // อัปเดตน้ำไหล
      if (particlesRef.current) {
        const attr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        if (attr) {
          for (let i = 0; i < particlesCount; i++) {
            const idx = i * 3;
            // ถ้าน้ำตกถึงพื้นแล้ว ให้ย้อนกลับไปที่ปากฝักบัว
            if (attr.array[idx + 1] < -1.5) {
              attr.array[idx] = (Math.random() - 0.5) * 0.1;
              attr.array[idx + 1] = 0;
              attr.array[idx + 2] = 0;
            } else {
              attr.array[idx + 1] -= 0.1; // ตกด้วยแรงโน้มถ่วง
              attr.array[idx] += (Math.random() - 0.5) * 0.02; // กระจายตัวนิดหน่อย
            }
          }
          attr.needsUpdate = true;
        }
      }

      setProgress(prev => prev + delta);
      if (progress > 3) { // รดน้ำ 3 วินาที
        setPhase("returning");
      }
    } else if (phase === "returning") {
      // หมุนกลับ และเลื่อนหายไป
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.position.y += 0.1;
      groupRef.current.position.z += 0.1;
      
      if (groupRef.current.position.y > 10) {
        if (isWateringItemId) {
          updateItem(isWateringItemId, { 
            health: 100,
            plantedAt: new Date().toLocaleDateString("th-TH") + " (เพิ่งรดน้ำ)"
          });
        }
        setIsWateringItemId(null);
        setPhase("idle");
      }
    }
  });

  if (!isWateringItemId) return null;

  return (
    <group ref={groupRef} position={[targetPos.x, 10, targetPos.z + 5]}>
      {/* โมเดลฝักบัว - ถ้าไม่มีไฟล์ให้ใช้กล่องแทนไปก่อน */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* พวยกา */}
      <mesh position={[0.4, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      {/* น้ำไหล */}
      {phase === "pouring" && (
        <points ref={particlesRef} position={[0.6, -0.2, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlesCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#60a5fa" size={0.1} transparent opacity={0.8} sizeAttenuation />
        </points>
      )}
    </group>
  );
}

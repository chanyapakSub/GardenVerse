"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useStore, gridToPosition } from "@/store/useStore";

/**
 * FertilizingAnimation - แสดงถุงปุ๋ยและเม็ดปุ๋ยไหลลงมา
 */
export function FertilizingAnimation() {
  const isFertilizingItemId = useStore((s) => s.isFertilizingItemId);
  const setIsFertilizingItemId = useStore((s) => s.setIsFertilizingItemId);
  const items = useStore((s) => s.items);
  const updateItem = useStore((s) => s.updateItem);

  const targetItem = items.find((it) => it.id === isFertilizingItemId);
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const [phase, setPhase] = useState<"idle" | "moving" | "pouring" | "returning">("idle");
  const [progress, setProgress] = useState(0);

  // เตรียมตำแหน่งเป้าหมาย
  const targetPos = useMemo(() => {
    if (!targetItem) return new THREE.Vector3(0, 0, 0);
    const [x, y, z] = gridToPosition(targetItem.gridX, targetItem.gridZ);
    return new THREE.Vector3(x, y + 2.8, z + 0.8); // ลอยเหนือต้นไม้
  }, [targetItem]);

  // เริ่ม Animation
  useEffect(() => {
    if (isFertilizingItemId) {
      setPhase("moving");
      setProgress(0);
    } else {
      setPhase("idle");
    }
  }, [isFertilizingItemId]);

  // สร้าง Particle สำหรับเม็ดปุ๋ย
  const particlesCount = 40;
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
      groupRef.current.position.lerp(targetPos, 0.08);
      if (groupRef.current.position.distanceTo(targetPos) < 0.1) {
        setPhase("pouring");
        setProgress(0);
      }
    } else if (phase === "pouring") {
      // เอียงถุงปุ๋ย
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -Math.PI / 3, 0.08);

      // อัปเดตเม็ดปุ๋ย
      if (particlesRef.current) {
        const attr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        if (attr) {
          for (let i = 0; i < particlesCount; i++) {
            const idx = i * 3;
            if (attr.array[idx + 1] < -2.0) {
              attr.array[idx] = (Math.random() - 0.5) * 0.15;
              attr.array[idx + 1] = 0;
              attr.array[idx + 2] = 0;
            } else {
              attr.array[idx + 1] -= 0.08;
              attr.array[idx] += (Math.random() - 0.5) * 0.03;
            }
          }
          attr.needsUpdate = true;
        }
      }

      setProgress(prev => prev + delta);
      if (progress > 2.5) {
        setPhase("returning");
      }
    } else if (phase === "returning") {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
      groupRef.current.position.y += 0.1;

      if (groupRef.current.position.y > 10) {
        if (isFertilizingItemId) {
          updateItem(isFertilizingItemId, {
            health: 100,
            plantedAt: new Date().toLocaleDateString("th-TH") + " (เพิ่งใส่ปุ๋ย)"
          });
        }
        setIsFertilizingItemId(null);
        setPhase("idle");
      }
    }
  });

  if (!isFertilizingItemId) return null;

  return (
    <group ref={groupRef} position={[targetPos.x, 10, targetPos.z + 5]}>
      {/* โมเดลถุงปุ๋ย - ใช้กล่องแบนๆ แทนถุง */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.7, 0.15]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* ตราบนถุง */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      {/* เม็ดปุ๋ยหล่น */}
      {phase === "pouring" && (
        <points ref={particlesRef} position={[0, -0.4, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlesCount}
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial color="#92400e" size={0.1} sizeAttenuation />
        </points>
      )}
    </group>
  );
}

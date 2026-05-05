import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export function SunflowerModel(props: any) {
  const { scene } = useGLTF("/3D/sunflower.glb");

  // Clone scene so multiple instances can exist independently
  const cloned = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Clone materials so each instance is independent
        if ((child as any).material) {
          (child as any).material = (child as any).material.clone();
        }
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={cloned} {...props} />;
}

// Preload for faster load
useGLTF.preload("/3D/sunflower.glb");

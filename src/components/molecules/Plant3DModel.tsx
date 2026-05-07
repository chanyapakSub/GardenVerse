import { useGLTF, useFBX } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface Plant3DModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export function Plant3DModel({ modelPath, scale = 1, ...props }: Plant3DModelProps) {
  const isFbx = modelPath.toLowerCase().endsWith(".fbx");
  
  // Use the appropriate hook based on file extension
  // Note: We use dummy paths to avoid hook order errors when switching models
  const gltf = useGLTF(!isFbx ? modelPath : "/3D/plants/tomato.glb"); 
  const fbx = useFBX(isFbx ? modelPath : "/3D/plants/red_rose.fbx"); 

  const scene = isFbx ? fbx : gltf.scene;

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

  // Adjust scale and position based on the specific model
  let finalScale = scale;
  let yOffset = 0;

  if (modelPath.includes("monstera")) {
    finalScale *= 1;
    yOffset = 0;
  }
  if (modelPath.includes("tulip")) {
    finalScale *= 4.0;
    yOffset = -0.2;
  }
  if (modelPath.includes("purple_lilies")) {
    finalScale *= 0.12;
    yOffset = 1;
  }
  if (modelPath.includes("red_rose")) {
    // FBX scale for this specific rose model might need to be very small
    finalScale *= 0.012; 
    yOffset = -0.1;
  }
  if (modelPath.includes("sunflower")) {
    finalScale *= 0.006;
    yOffset = -0.1;
  }
  if (modelPath.includes("tomato")) {
    finalScale *= 0.008;
    yOffset = 0.1;
  }

  const finalPosition: [number, number, number] = props.position 
    ? [props.position[0], props.position[1] + yOffset, props.position[2]] 
    : [0, yOffset, 0];

  return (
    <primitive 
      {...props}
      object={cloned} 
      scale={finalScale} 
      position={finalPosition}
    />
  );
}

// Preload common plant models
useGLTF.preload("/3D/plants/monstera.glb");
useGLTF.preload("/3D/plants/tulip.glb");
useGLTF.preload("/3D/plants/purple_lilies.glb");
useFBX.preload("/3D/plants/red_rose.fbx");
useGLTF.preload("/3D/plants/sunflower.glb");
useGLTF.preload("/3D/plants/tomato.glb");

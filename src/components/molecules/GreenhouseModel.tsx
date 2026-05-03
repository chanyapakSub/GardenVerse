import { useGLTF } from "@react-three/drei";

export function GreenhouseModel(props: any) {
  // โหลดโมเดล 3D จาก public folder
  const { scene } = useGLTF("/3D/greenhouse.glb");
  
  // โคลน scene ถ้าต้องการใช้หลายอัน แต่ในกรณีนี้เราใช้แค่ชิ้นเดียว
  // เปิด shadow ให้กับทุก object ในโมเดล
  scene.traverse((child) => {
    if ((child as any).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={scene} {...props} />;
}

// Preload โมเดลเพื่อให้โหลดเร็วขึ้น
useGLTF.preload("/3D/greenhouse.glb");

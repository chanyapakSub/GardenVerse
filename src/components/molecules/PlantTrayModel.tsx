export function PlantTrayModel(props: any) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={[2, 0.4, 1]} />
      <meshStandardMaterial color="#5d4037" roughness={0.9} />
      {/* Soil inside the tray */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.9, 0.05, 0.9]} />
        <meshStandardMaterial color="#3e2723" roughness={1} />
      </mesh>
    </mesh>
  );
}

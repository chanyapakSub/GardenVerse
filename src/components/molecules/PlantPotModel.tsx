export function PlantPotModel(props: any) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <cylinderGeometry args={[0.6, 0.45, 0.6, 32]} />
      <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
      {/* Soil inside the pot */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 0.05, 32]} />
        <meshStandardMaterial color="#3e2723" roughness={1} />
      </mesh>
    </mesh>
  );
}

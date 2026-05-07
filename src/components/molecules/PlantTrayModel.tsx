export function PlantTrayModel(props: any) {
  return (
    <mesh castShadow receiveShadow {...props}>
      {/* Box is now larger to fit 4 plants (1.8x1.8 on a 2x2 grid) */}
      <boxGeometry args={[1.8, 0.4, 1.8]} />
      <meshStandardMaterial color="#5d4037" roughness={0.9} />
      {/* Soil inside the tray - raised up */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.7, 0.05, 1.7]} />
        <meshStandardMaterial color="#3e2723" roughness={1} />
      </mesh>
    </mesh>
  );
}

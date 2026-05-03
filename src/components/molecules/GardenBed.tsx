// Component สำหรับจำลองแปลงผัก/ดอกไม้
export function GardenBed({ position, color, label }: { position: [number, number, number], color: string, label?: string }) {
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

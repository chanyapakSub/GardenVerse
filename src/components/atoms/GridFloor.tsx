"use client";

import { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import {
    useStore,
    GRID_SIZE,
    CELL_SIZE,
    GRID_HALF,
    gridToPosition,
    positionToGrid,
} from "@/store/useStore";

/**
 * GridFloor - พื้นแบบ Grid สไตล์ Minecraft
 * - แสดง grid lines ตอนอยู่ใน placementMode
 * - Hover แล้ว highlight block ที่ชี้ (เขียว=ว่าง, แดง=มีของ)
 * - Click วาง item ตอนอยู่ใน placementMode
 */
export function GridFloor() {
    const placementMode = useStore((s) => s.placementMode);
    const hoveredCell = useStore((s) => s.hoveredCell);
    const setHoveredCell = useStore((s) => s.setHoveredCell);
    const setPlacementMode = useStore((s) => s.setPlacementMode);
    const addItem = useStore((s) => s.addItem);
    const openAddModal = useStore((s) => s.openAddModal);
    const isCellOccupied = useStore((s) => s.isCellOccupied);
    const selectItem = useStore((s) => s.selectItem);

    // สร้าง edges geometry ครั้งเดียว
    const highlightEdges = useMemo(
        () => new THREE.EdgesGeometry(new THREE.BoxGeometry(CELL_SIZE * 0.95, 0.1, CELL_SIZE * 0.95)),
        []
    );

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!placementMode) {
            if (hoveredCell) setHoveredCell(null);
            return;
        }
        const [gx, gz] = positionToGrid(e.point.x, e.point.z);
        if (gx < 0 || gx >= GRID_SIZE || gz < 0 || gz >= GRID_SIZE) {
            if (hoveredCell) setHoveredCell(null);
            return;
        }
        if (!hoveredCell || hoveredCell[0] !== gx || hoveredCell[1] !== gz) {
            setHoveredCell([gx, gz]);
        }
    };

    const handlePointerLeave = () => {
        setHoveredCell(null);
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (!placementMode) {
            selectItem(null);
            return;
        }
        const [gx, gz] = positionToGrid(e.point.x, e.point.z);
        if (gx < 0 || gx >= GRID_SIZE || gz < 0 || gz >= GRID_SIZE) return;
        if (isCellOccupied(gx, gz)) return;

        const newId = `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        addItem({
            id: newId,
            type: placementMode,
            plantId: null,
            gridX: gx,
            gridZ: gz,
        });
        setPlacementMode(null);
        setHoveredCell(null);
        openAddModal(newId);
    };

    const highlightPos = hoveredCell ? gridToPosition(hoveredCell[0], hoveredCell[1]) : null;
    const isHighlightOccupied = hoveredCell ? isCellOccupied(hoveredCell[0], hoveredCell[1]) : false;
    const highlightColor = isHighlightOccupied ? "#ef4444" : "#22c55e";

    return (
        <group>
            {/* พื้นรับการคลิก/hover */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.01, 0]}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onClick={handleClick}
            >
                <planeGeometry args={[GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE]} />
                <meshStandardMaterial
                    color="#7c8f6e"
                    transparent
                    opacity={placementMode ? 0.4 : 0.15}
                    roughness={1}
                />
            </mesh>

            {/* เส้น grid (เห็นเฉพาะตอนวาง) */}
            {placementMode && (
                <group position={[0, 0.02, 0]}>
                    {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => {
                        const offset = i * CELL_SIZE - GRID_HALF;
                        return (
                            <group key={i}>
                                <mesh position={[0, 0, offset]} rotation={[-Math.PI / 2, 0, 0]}>
                                    <planeGeometry args={[GRID_SIZE * CELL_SIZE, 0.05]} />
                                    <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
                                </mesh>
                                <mesh position={[offset, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                                    <planeGeometry args={[0.05, GRID_SIZE * CELL_SIZE]} />
                                    <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
                                </mesh>
                            </group>
                        );
                    })}
                </group>
            )}

            {/* Highlight block ที่ชี้อยู่ */}
            {placementMode && highlightPos && (
                <group position={highlightPos}>
                    <mesh position={[0, 0.05, 0]}>
                        <boxGeometry args={[CELL_SIZE * 0.95, 0.1, CELL_SIZE * 0.95]} />
                        <meshBasicMaterial color={highlightColor} transparent opacity={0.4} />
                    </mesh>
                    <lineSegments position={[0, 0.05, 0]} geometry={highlightEdges}>
                        <lineBasicMaterial color={highlightColor} linewidth={2} />
                    </lineSegments>
                </group>
            )}
        </group>
    );
}
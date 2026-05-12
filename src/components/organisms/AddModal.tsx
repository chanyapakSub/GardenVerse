"use client";

import { X, Sprout, Check } from "lucide-react";
import { useState } from "react";
import { useStore, PLANT_CATALOG, DECO_CATALOG } from "@/store/useStore";

export default function AddModal() {
  const isOpen = useStore((s) => s.isAddModalOpen);
  const pendingItemId = useStore((s) => s.pendingItemId);
  const items = useStore((s) => s.items);
  const closeAddModal = useStore((s) => s.closeAddModal);
  const updateItem = useStore((s) => s.updateItem);
  const removeItem = useStore((s) => s.removeItem);
  const selectItem = useStore((s) => s.selectItem);

  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);

  const pendingItem = items.find((it) => it.id === pendingItemId);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!pendingItemId || !selectedPlantId) return;
    const catalog = pendingItem?.type === 'deco' ? DECO_CATALOG : PLANT_CATALOG;
    const plant = catalog.find((p) => p.id === selectedPlantId);
    updateItem(pendingItemId, {
      plantId: selectedPlantId,
      name: plant?.name,
      health: 100,
      plantedAt: new Date().toLocaleDateString("th-TH"),
    });
    selectItem(pendingItemId); // เลือก item นั้นเลยจะได้เห็นใน panel
    setSelectedPlantId(null);
    closeAddModal();
  };

  const handleCancel = () => {
    // ถ้ายกเลิก = ไม่เลือกพืช → ลบ item ที่เพิ่งวางทิ้ง (ทำให้ flow สะอาด)
    if (pendingItemId && pendingItem && !pendingItem.plantId) {
      removeItem(pendingItemId);
    }
    setSelectedPlantId(null);
    closeAddModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Sprout className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {pendingItem?.type === 'deco' ? 'เลือกของตกแต่ง' : 'เลือกพืชมาปลูก'}
              </h2>
              {pendingItem && (
                <p className="text-xs text-gray-500">
                  {pendingItem.type === "pot" ? "กระถาง" : "แปลง"} ที่ตำแหน่ง ({pendingItem.gridX},{" "}
                  {pendingItem.gridZ})
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Catalog */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(pendingItem?.type === 'deco' ? DECO_CATALOG : PLANT_CATALOG).map((plant) => {
              const isSelected = selectedPlantId === plant.id;
              return (
                <button
                  key={plant.id}
                  onClick={() => setSelectedPlantId(plant.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all text-left ${isSelected
                    ? "border-green-500 bg-green-50 shadow-md scale-105"
                    : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="text-4xl mb-2">{plant.emoji}</div>
                  <h3 className="font-bold text-gray-800 text-sm">{plant.name}</h3>
                  <p className="text-xs text-gray-500 italic mt-0.5">{plant.scientificName}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                      ☀️ {plant.sunlight}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      💧 {plant.water}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedPlantId}
            className="flex-1 py-3 rounded-xl font-bold text-white bg-[#3b8045] hover:bg-[#2d6635] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sprout className="w-5 h-5" />
            {pendingItem?.type === 'deco' ? 'วางของตกแต่ง' : 'ปลูกพืช'}
          </button>
        </div>
      </div>
    </div>
  );
}
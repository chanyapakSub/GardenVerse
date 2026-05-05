"use client";

import {
  Pencil,
  Settings,
  Clock,
  List,
  Sun,
  Droplets,
  Thermometer,
  Box,
  ChevronDown,
  MousePointerClick,
  Sprout,
  Trash2,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore, PLANT_CATALOG } from "@/store/useStore";

export default function PlantDetailPanel() {
  const selectedItemId = useStore((s) => s.selectedItemId);
  const items = useStore((s) => s.items);
  const isEditMode = useStore((s) => s.isEditMode);
  const setEditMode = useStore((s) => s.setEditMode);
  const updateItem = useStore((s) => s.updateItem);
  const removeItem = useStore((s) => s.removeItem);
  const openAddModal = useStore((s) => s.openAddModal);
  const selectItem = useStore((s) => s.selectItem);

  const selectedItem = items.find((it) => it.id === selectedItemId);
  const plant = selectedItem?.plantId
    ? PLANT_CATALOG.find((p) => p.id === selectedItem.plantId)
    : null;

  // Local state สำหรับฟอร์มแก้ไข
  const [editName, setEditName] = useState("");
  const [editZone, setEditZone] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setEditName(selectedItem.name || plant?.name || "");
      setEditZone(selectedItem.zone || "");
    }
  }, [selectedItem, plant]);

  // ===== Empty state: ยังไม่ได้เลือกอะไร =====
  if (!selectedItem) {
    return (
      <div className="bg-white rounded-2xl h-full shadow-sm border border-gray-100 p-5 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
          <MousePointerClick className="w-10 h-10 text-gray-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-700">ยังไม่ได้เลือกพืช</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            คลิกที่กระถางหรือแปลงในสวน
            <br />
            เพื่อดูข้อมูลรายละเอียด
          </p>
        </div>
        <div className="mt-4 text-[11px] text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
          💡 คลิกขวาเพื่อแก้ไขข้อมูล
        </div>
      </div>
    );
  }

  // ===== Empty pot/bed: เลือกแล้วแต่ยังไม่มีพืช =====
  if (!plant) {
    return (
      <div className="bg-white rounded-2xl h-full shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {selectedItem.type === "pot" ? "🪴 กระถางว่าง" : "🟫 แปลงว่าง"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              ตำแหน่ง: ({selectedItem.gridX}, {selectedItem.gridZ})
            </p>
          </div>
          <button
            onClick={() => selectItem(null)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <Sprout className="w-12 h-12 text-green-300" />
          <p className="text-sm text-gray-500">ยังไม่มีพืชใน{selectedItem.type === "pot" ? "กระถาง" : "แปลง"}นี้</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => openAddModal(selectedItem.id)}
            className="w-full bg-[#3b8045] hover:bg-[#2d6635] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <Sprout className="w-5 h-5" />
            เลือกพืชมาปลูก
          </button>
          <button
            onClick={() => {
              if (confirm(`ลบ${selectedItem.type === "pot" ? "กระถาง" : "แปลง"}นี้?`)) {
                removeItem(selectedItem.id);
              }
            }}
            className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-2.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            ลบ
          </button>
        </div>
      </div>
    );
  }

  // ===== มีพืช: แสดงข้อมูล (หรือฟอร์มแก้ไข) =====
  return (
    <div className="bg-white rounded-2xl h-full shadow-sm border border-gray-100 p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar relative">
      {/* Header Info */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span>{plant.emoji}</span>
            {isEditMode ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-[20px] font-bold text-gray-800 border-b-2 border-green-500 outline-none flex-1 min-w-0"
              />
            ) : (
              <h2 className="text-[22px] font-bold text-gray-800">{editName || plant.name}</h2>
            )}
            <button
              onClick={() => setEditMode(!isEditMode)}
              className={`p-1 rounded ${isEditMode ? "bg-green-100 text-green-600" : "text-gray-400 hover:text-gray-600"
                }`}
              title={isEditMode ? "กำลังแก้ไข" : "แก้ไข"}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>

          <div className="mt-3 flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold text-green-700">
              สุขภาพดี {selectedItem.health || 85}%
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-1 text-[13px] text-gray-600">
            <p>
              ตำแหน่ง: Block ({selectedItem.gridX}, {selectedItem.gridZ})
            </p>
            <p>ประเภท: {selectedItem.type === "pot" ? "กระถาง" : "แปลง"}</p>
            {isEditMode ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs">โซน:</span>
                <input
                  value={editZone}
                  onChange={(e) => setEditZone(e.target.value)}
                  placeholder="เช่น A1, โซนดอกไม้"
                  className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-green-500"
                />
              </div>
            ) : (
              selectedItem.zone && <p>โซน: {selectedItem.zone}</p>
            )}
          </div>
        </div>

        {/* Plant Image */}
        <div className="w-24 h-28 relative rounded-xl overflow-hidden shrink-0 bg-green-50">
          <Image
            src={plant.image}
            alt={plant.name}
            fill
            className="object-cover object-top"
            onError={(e) => {
              // fallback ถ้าโหลดรูปไม่ได้
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {plant.emoji}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full border-b border-gray-100 mt-2">
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 border-b-2 border-green-600 text-green-600">
          <Box className="w-5 h-5" />
          <span className="text-xs font-semibold">ข้อมูล</span>
        </button>
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">การดูแล</span>
        </button>
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-medium">บันทึก</span>
        </button>
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <List className="w-5 h-5" />
          <span className="text-xs font-medium">ประวัติ</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-[14px] font-bold text-gray-800 mb-1">เกี่ยวกับพืช</h3>
          <p className="text-[13px] text-gray-600 leading-relaxed">{plant.description}</p>
        </div>

        <div>
          <h3 className="text-[14px] font-bold text-gray-800 mb-3">ความต้องการ</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center text-center gap-1">
              <Sun className="w-6 h-6 text-yellow-500" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">แสงแดด</span>
              <span className="text-[11px] text-gray-800 font-medium">{plant.sunlight}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Droplets className="w-6 h-6 text-blue-500" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">น้ำ</span>
              <span className="text-[11px] text-gray-800 font-medium">{plant.water}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Thermometer className="w-6 h-6 text-red-400" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">อุณหภูมิ</span>
              <span className="text-[11px] text-gray-800 font-medium">{plant.temperature}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Box className="w-6 h-6 text-amber-700" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">ดิน</span>
              <span className="text-[11px] text-gray-800 font-medium">{plant.soil}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        {isEditMode ? (
          <>
            <button
              onClick={() => {
                updateItem(selectedItem.id, { name: editName, zone: editZone });
                setEditMode(false);
              }}
              className="w-full bg-[#3b8045] hover:bg-[#2d6635] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-5 h-5" />
              บันทึก
            </button>
            <button
              onClick={() => {
                if (confirm(`ลบ${selectedItem.type === "pot" ? "กระถาง" : "แปลง"}นี้?`)) {
                  removeItem(selectedItem.id);
                }
              }}
              className="w-full border border-red-200 hover:bg-red-50 text-red-600 py-2.5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              ลบไอเทมนี้
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              ยกเลิก
            </button>
          </>
        ) : (
          <>
            <button className="w-full bg-[#3b8045] hover:bg-[#2d6635] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-green-900/10 transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22V12" />
                <path d="M12 12C12 12 17 8 17 4" />
                <path d="M17 4C17 4 20 6 20 10 20 12.5 17 14 17 14" />
                <path d="M12 12C12 12 7 8 7 4" />
                <path d="M7 4C7 4 4 6 4 10 4 12.5 7 14 7 14" />
              </svg>
              ดูแลตอนนี้
              <ChevronDown className="w-4 h-4" />
            </button>
            <Link
              href="/history"
              className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              ดูประวัติการดูแล
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
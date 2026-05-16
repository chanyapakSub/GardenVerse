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
  Cpu,
  Lightbulb,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useStore, PLANT_CATALOG, DEVICE_CATALOG } from "@/store/useStore";
import { useLatestReading } from "@/lib/useLatestReading";

export default function PlantDetailPanel() {
  const selectedItemId = useStore((s) => s.selectedItemId);
  const items = useStore((s) => s.items);
  const isEditMode = useStore((s) => s.isEditMode);
  const setEditMode = useStore((s) => s.setEditMode);
  const updateItem = useStore((s) => s.updateItem);
  const removeItem = useStore((s) => s.removeItem);
  const openAddModal = useStore((s) => s.openAddModal);
  const selectItem = useStore((s) => s.selectItem);
  const setActiveCareTool = useStore((s) => s.setActiveCareTool);
  const setAnimatingItemId = useStore((s) => s.setAnimatingItemId);

  const [showCareMenu, setShowCareMenu] = useState(false);

  const selectedItem = items.find((it) => it.id === selectedItemId);
  const plant = selectedItem?.plantId
    ? PLANT_CATALOG.find((p) => p.id === selectedItem.plantId)
    : null;

  // Local state สำหรับฟอร์มแก้ไข
  const [editName, setEditName] = useState("");
  const [editZone, setEditZone] = useState("");
  const [editDeviceId, setEditDeviceId] = useState<string>("");

  useEffect(() => {
    if (selectedItem) {
      setEditName(selectedItem.name || plant?.name || "");
      setEditZone(selectedItem.zone || "");
      setEditDeviceId(selectedItem.deviceId || "");
    }
  }, [selectedItem, plant]);

  // ===== Live sensor reading จาก Supabase Realtime =====
  const { reading, isLoading: isReadingLoading, error: readingError } =
    useLatestReading(selectedItem?.deviceId);

  const device = selectedItem?.deviceId
    ? DEVICE_CATALOG.find((d) => d.id === selectedItem.deviceId)
    : null;

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

          {(() => {
            const h = selectedItem.health || 85;
            if (h >= 80) return (
              <div className="mt-3 flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                <span className="text-sm font-semibold text-green-700">🌱 สุขภาพดีมาก</span>
              </div>
            );
            if (h >= 60) return (
              <div className="mt-3 flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
                <span className="text-sm font-semibold text-blue-700">🌿 สุขภาพดี</span>
              </div>
            );
            if (h >= 40) return (
              <div className="mt-3 flex items-center gap-2 bg-yellow-50 w-fit px-3 py-1 rounded-full border border-yellow-100">
                <span className="text-sm font-semibold text-yellow-700">🍃 สุขภาพปานกลาง</span>
              </div>
            );
            return (
              <div className="mt-3 flex items-center gap-2 bg-red-50 w-fit px-3 py-1 rounded-full border border-red-100">
                <span className="text-sm font-semibold text-red-700">🍂 ต้องดูแลเพิ่ม</span>
              </div>
            );
          })()}

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

        {/* ===== Live sensor reading ===== */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[14px] font-bold text-gray-800">ค่าจากเซนเซอร์</h3>
            </div>
            {isEditMode && (
              <select
                value={editDeviceId}
                onChange={(e) => {
                  const v = e.target.value;
                  setEditDeviceId(v);
                  updateItem(selectedItem.id, { deviceId: v || undefined });
                }}
                className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-500"
              >
                <option value="">ไม่ผูกเซนเซอร์</option>
                {DEVICE_CATALOG.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            )}
          </div>

          {!selectedItem.deviceId ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">
                {isEditMode
                  ? "เลือกเซนเซอร์จาก dropdown ด้านบนเพื่อผูกกับพืชนี้"
                  : "ยังไม่ได้ผูกเซนเซอร์ — กด ✏ เพื่อแก้ไขแล้วเลือกเซนเซอร์"}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-emerald-700">
                  {device?.name || selectedItem.deviceId}
                </span>
                {reading && (
                  <span className="text-[10px] text-gray-400">
                    {new Date(reading.recorded_at).toLocaleTimeString("th-TH")}
                  </span>
                )}
              </div>

              {readingError ? (
                <p className="text-[11px] text-red-500">โหลดข้อมูลไม่สำเร็จ: {readingError}</p>
              ) : !reading && isReadingLoading ? (
                <p className="text-[11px] text-gray-500">กำลังโหลด...</p>
              ) : !reading ? (
                <p className="text-[11px] text-gray-500">ยังไม่มีข้อมูลจากเซนเซอร์นี้</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center text-center bg-white rounded-lg p-2">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <span className="text-[10px] text-gray-500 mt-1">อุณหภูมิ</span>
                    <span className="text-sm font-bold text-gray-800">
                      {reading.temperature != null ? `${reading.temperature.toFixed(1)}°C` : "-"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center bg-white rounded-lg p-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] text-gray-500 mt-1">ความชื้น</span>
                    <span className="text-sm font-bold text-gray-800">
                      {reading.humidity != null ? `${reading.humidity.toFixed(1)}%` : "-"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center bg-white rounded-lg p-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <span className="text-[10px] text-gray-500 mt-1">แสง</span>
                    <span className="text-sm font-bold text-gray-800">
                      {reading.lux != null ? `${Math.round(reading.lux)} lx` : "-"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
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
            {showCareMenu ? (
              <div className="flex gap-2 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={() => {
                    setActiveCareTool('water');
                    setAnimatingItemId(selectedItem.id);
                    setShowCareMenu(false);
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Droplets className="w-5 h-5" />
                  รดน้ำ
                </button>
                <button
                  onClick={() => {
                    setActiveCareTool('fertilize');
                    setAnimatingItemId(selectedItem.id);
                    setShowCareMenu(false);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Sprout className="w-5 h-5" />
                  ใส่ปุ๋ย
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowCareMenu(true)}
                className="w-full bg-[#3b8045] hover:bg-[#2d6635] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-green-900/10 transition-all active:scale-[0.98]"
              >
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
                <ChevronDown className={`w-4 h-4 transition-transform ${showCareMenu ? 'rotate-180' : ''}`} />
              </button>
            )}
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
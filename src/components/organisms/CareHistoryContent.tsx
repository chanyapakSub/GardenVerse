"use client";

import { useState } from "react";
import { Droplets, Leaf, ClipboardList, BookOpen, Activity, LayoutGrid, Search } from "lucide-react";
import SensorChart from "./SensorChart";
import CareTable from "./CareTable";
import CareSummary from "./CareSummary";
import AlertPanel from "./AlertPanel";
import { StatCard } from "@/components/molecules/StatCard";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";

const TABS = [
  { id: "overview", label: "ภาพรวม", icon: LayoutGrid },
  { id: "sensor", label: "ข้อมูลเซนเซอร์", icon: Activity },
  { id: "water", label: "การให้น้ำ", icon: Droplets },
  { id: "fertilizer", label: "การให้ปุ๋ย", icon: Leaf },
  { id: "ai", label: "AI วินิจฉัย", icon: Search },
  { id: "activity", label: "กิจกรรม", icon: ClipboardList },
  { id: "notes", label: "บันทึก", icon: BookOpen },
];

// Per-plant mock data keyed by plant id
const plantProfiles: Record<string, {
  name: string;
  scientific: string;
  emoji: string;
  health: number;
  age: string;
  plantedAt: string;
  humidity: { value: string; badge: string; trend: number[] };
  temp: { value: string; badge: string; trend: number[] };
  light: { value: string; badge: string; trend: number[] };
}> = {
  p1: {
    name: "แปลงทิวลิป", scientific: "Tulipa spp.", emoji: "🌷",
    health: 85, age: "45 วัน", plantedAt: "1 มี.ค. 2567",
    humidity: { value: "60", badge: "ปกติ", trend: [55,58,62,60,64,61,59,63,60,58,61,60,62,63,60,61,59,60,62,60] },
    temp: { value: "18.6", badge: "ปกติ", trend: [16,17,17.5,18,18.2,18.4,18.6,18.8,19,18.7,18.5,18.3,18.6,18.4,18.2,18.5,18.7,18.6,18.4,18.6] },
    light: { value: "6.2", badge: "เหมาะสม", trend: [5.5,6,6.2,5.8,6.3,6.1,6.4,6.2,5.9,6.1,6.3,6.2,6.0,6.2,6.3,6.1,6.0,6.2,6.3,6.2] },
  },
  p2: {
    name: "แปลงกุหลาบ", scientific: "Rosa spp.", emoji: "🌹",
    health: 78, age: "60 วัน", plantedAt: "15 ก.พ. 2567",
    humidity: { value: "55", badge: "ปกติ", trend: [50,53,55,54,56,55,53,54,55,56,54,55,53,55,56,54,55,53,55,55] },
    temp: { value: "22.3", badge: "ปกติ", trend: [20,21,21.5,22,22.3,22.1,21.8,22.0,22.3,22.5,22.2,22.0,22.3,22.1,21.9,22.2,22.4,22.3,22.1,22.3] },
    light: { value: "7.1", badge: "เหมาะสม", trend: [6.5,7,7.2,6.8,7.3,7.1,7.4,7.2,6.9,7.1,7.3,7.2,7.0,7.2,7.3,7.1,7.0,7.2,7.3,7.1] },
  },
  p3: {
    name: "แปลงลาเวนเดอร์", scientific: "Lavandula spp.", emoji: "💜",
    health: 90, age: "30 วัน", plantedAt: "15 มี.ค. 2567",
    humidity: { value: "45", badge: "ต่ำ", trend: [40,42,45,43,44,45,43,44,45,46,44,45,43,44,45,46,44,45,46,45] },
    temp: { value: "20.1", badge: "ปกติ", trend: [18,19,19.5,20,20.1,19.8,20.0,20.1,20.3,20.0,19.8,20.1,20.0,19.9,20.1,20.2,20.0,20.1,19.9,20.1] },
    light: { value: "8.0", badge: "เหมาะสม", trend: [7.5,8,8.2,7.8,8.3,8.1,8.0,7.9,8.1,8.0,7.8,8.0,8.1,7.9,8.0,8.2,8.0,7.9,8.1,8.0] },
  },
  p4: {
    name: "แปลงเบญจมาศ", scientific: "Chrysanthemum spp.", emoji: "🌼",
    health: 72, age: "20 วัน", plantedAt: "25 มี.ค. 2567",
    humidity: { value: "65", badge: "ปกติ", trend: [60,62,65,63,64,65,63,64,65,66,64,65,63,64,65,66,64,65,66,65] },
    temp: { value: "19.0", badge: "ปกติ", trend: [17,18,18.5,19,19.0,18.8,19.0,19.1,19.3,19.0,18.8,19.0,19.1,18.9,19.0,19.2,19.0,18.9,19.1,19.0] },
    light: { value: "5.5", badge: "ต่ำ", trend: [4.5,5,5.2,4.8,5.3,5.1,5.4,5.2,4.9,5.1,5.3,5.2,5.0,5.2,5.3,5.1,5.0,5.2,5.3,5.5] },
  },
  p5: {
    name: "แปลงโหระพา", scientific: "Ocimum basilicum", emoji: "🌿",
    health: 88, age: "25 วัน", plantedAt: "20 มี.ค. 2567",
    humidity: { value: "58", badge: "ปกติ", trend: [53,55,58,56,57,58,56,57,58,59,57,58,56,57,58,59,57,58,59,58] },
    temp: { value: "25.0", badge: "สูง", trend: [23,24,24.5,25,25.0,24.8,25.0,25.1,25.3,25.0,24.8,25.0,25.1,24.9,25.0,25.2,25.0,24.9,25.1,25.0] },
    light: { value: "6.8", badge: "เหมาะสม", trend: [6.0,6.5,6.8,6.4,6.9,6.7,7.0,6.8,6.5,6.7,6.9,6.8,6.6,6.8,6.9,6.7,6.6,6.8,6.9,6.8] },
  },
};

// Default fallback
const defaultProfile = plantProfiles["p1"];

interface CareHistoryContentProps {
  selectedPlantId?: string | null;
}

export default function CareHistoryContent({ selectedPlantId }: CareHistoryContentProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const profile = (selectedPlantId && plantProfiles[selectedPlantId]) || defaultProfile;
  const { detectionHistory } = useStore();

  const statCards = [
    {
      id: "humidity_air",
      label: "ความชื้นอากาศ",
      value: profile.humidity.value,
      unit: "%",
      badge: profile.humidity.badge,
      badgeColor: "bg-blue-100 text-blue-700",
      color: "text-blue-600",
      icon: "💧",
      subLabel: "ช่วงเหมาะสม 50-70%",
      trend: profile.humidity.trend,
      lineColor: "#3b82f6",
    },
    {
      id: "temp",
      label: "อุณหภูมิ",
      value: profile.temp.value,
      unit: "°C",
      badge: profile.temp.badge,
      badgeColor: "bg-orange-100 text-orange-700",
      color: "text-orange-600",
      icon: "🌡️",
      subLabel: "ช่วงเหมาะสม 15-20°C",
      trend: profile.temp.trend,
      lineColor: "#f97316",
    },
    {
      id: "light",
      label: "แสงแดด",
      value: profile.light.value,
      unit: " ชม./วัน",
      badge: profile.light.badge,
      badgeColor: "bg-yellow-100 text-yellow-700",
      color: "text-yellow-600",
      icon: "☀️",
      subLabel: "ช่วงเหมาะสม 6-8 ชม./วัน",
      trend: profile.light.trend,
      lineColor: "#eab308",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{profile.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-sm text-gray-500 italic">{profile.scientific}</p>
          </div>
        </div>
        {(() => {
          const h = profile.health;
          if (h >= 80) return (
            <div className="flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 ml-2">
              <span className="text-sm font-semibold text-green-700">🌱 สุขภาพดีมาก</span>
            </div>
          );
          if (h >= 60) return (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 ml-2">
              <span className="text-sm font-semibold text-blue-700">🌿 สุขภาพดี</span>
            </div>
          );
          if (h >= 40) return (
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-1.5 rounded-full border border-yellow-200 ml-2">
              <span className="text-sm font-semibold text-yellow-700">🍃 สุขภาพปานกลาง</span>
            </div>
          );
          return (
            <div className="flex items-center gap-2 bg-red-50 px-4 py-1.5 rounded-full border border-red-200 ml-2">
              <span className="text-sm font-semibold text-red-700">🍂 ต้องดูแลเพิ่ม</span>
            </div>
          );
        })()}
        <div className="ml-auto text-sm text-gray-500">อายุ {profile.age} • ปลูกเมื่อ {profile.plantedAt}</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px shrink-0 ${
                activeTab === tab.id
                  ? "border-green-600 text-green-700 bg-green-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4">
            {statCards.map((card) => (
              <StatCard key={card.id} card={card} />
            ))}
          </div>

          {/* Chart + Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <SensorChart />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <CareSummary />
            </div>
          </div>

          {/* Table + Alerts */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <CareTable />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <AlertPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              ประวัติการวินิจฉัยด้วย AI
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
              {detectionHistory.length} รายการ
            </span>
          </div>
          
          {detectionHistory.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {detectionHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex gap-6 hover:border-green-200 transition-all hover:shadow-md group">
                  <div className="relative w-40 h-28 rounded-2xl overflow-hidden shrink-0 border-4 border-gray-50 shadow-sm">
                    <Image src={item.imageUrl} alt={item.prediction} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.timestamp}</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        CONFIDENCE {item.confidence}%
                      </div>
                    </div>
                    <h4 className="font-black text-gray-900 text-xl mb-1">{item.prediction}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1 font-medium">{item.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-16 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-50 p-8 rounded-full mb-6">
                <Search className="w-12 h-12 text-gray-200" />
              </div>
              <p className="text-gray-400 font-bold text-lg mb-1">ยังไม่มีข้อมูลการวินิจฉัย</p>
              <p className="text-gray-300 text-sm mb-6">ข้อมูลที่คุณตรวจสอบจะถูกบันทึกไว้ที่นี่เพื่อติดตามอาการ</p>
              <Link 
                href="/disease-detect" 
                className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-900/10"
              >
                เริ่มการตรวจโรคพืช
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab !== "overview" && activeTab !== "ai" && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">กำลังพัฒนาเนื้อหาส่วนนี้...</p>
        </div>
      )}
    </div>
  );
}

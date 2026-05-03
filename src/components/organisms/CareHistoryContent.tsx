"use client";

import { useState } from "react";
import { Droplets, Leaf, ClipboardList, BookOpen, Activity, LayoutGrid } from "lucide-react";
import SensorChart from "./SensorChart";
import CareTable from "./CareTable";
import CareSummary from "./CareSummary";
import AlertPanel from "./AlertPanel";
import { StatCard } from "@/components/molecules/StatCard";

const TABS = [
  { id: "overview", label: "ภาพรวม", icon: LayoutGrid },
  { id: "sensor", label: "ข้อมูลเซนเซอร์", icon: Activity },
  { id: "water", label: "การให้น้ำ", icon: Droplets },
  { id: "fertilizer", label: "การให้ปุ๋ย", icon: Leaf },
  { id: "activity", label: "กิจกรรม", icon: ClipboardList },
  { id: "notes", label: "บันทึก", icon: BookOpen },
];

const statCards = [
  {
    id: "health",
    label: "สุขภาพพืช",
    value: "85",
    unit: "%",
    badge: "ดีมาก",
    badgeColor: "bg-green-100 text-green-700",
    color: "text-green-600",
    icon: "🌿",
    trend: [40, 42, 45, 44, 48, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 84, 85],
    lineColor: "#22c55e",
  },
  {
    id: "humidity_air",
    label: "ความชื้นอากาศ",
    value: "60",
    unit: "%",
    badge: "ปกติ",
    badgeColor: "bg-blue-100 text-blue-700",
    color: "text-blue-600",
    icon: "💧",
    subLabel: "ช่วงเหมาะสม 50-70%",
    trend: [55, 58, 62, 60, 64, 61, 59, 63, 60, 58, 61, 60, 62, 63, 60, 61, 59, 60, 62, 60],
    lineColor: "#3b82f6",
  },
  {
    id: "temp",
    label: "อุณหภูมิ",
    value: "18.6",
    unit: "°C",
    badge: "ปกติ",
    badgeColor: "bg-orange-100 text-orange-700",
    color: "text-orange-600",
    icon: "🌡️",
    subLabel: "ช่วงเหมาะสม 15-20°C",
    trend: [16, 17, 17.5, 18, 18.2, 18.4, 18.6, 18.8, 19, 18.7, 18.5, 18.3, 18.6, 18.4, 18.2, 18.5, 18.7, 18.6, 18.4, 18.6],
    lineColor: "#f97316",
  },
  {
    id: "light",
    label: "แสงแดด",
    value: "6.2",
    unit: " ชม./วัน",
    badge: "เหมาะสม",
    badgeColor: "bg-yellow-100 text-yellow-700",
    color: "text-yellow-600",
    icon: "☀️",
    subLabel: "ช่วงเหมาะสม 6-8 ชม./วัน",
    trend: [5.5, 6, 6.2, 5.8, 6.3, 6.1, 6.4, 6.2, 5.9, 6.1, 6.3, 6.2, 6.0, 6.2, 6.3, 6.1, 6.0, 6.2, 6.3, 6.2],
    lineColor: "#eab308",
  },
  {
    id: "humidity_soil",
    label: "ความชื้นดิน",
    value: "45",
    unit: "%",
    badge: "ปกติ",
    badgeColor: "bg-amber-100 text-amber-700",
    color: "text-amber-700",
    icon: "🪴",
    subLabel: "ช่วงเหมาะสม 40-60%",
    trend: [38, 40, 42, 45, 43, 44, 46, 45, 43, 44, 46, 45, 43, 44, 45, 46, 44, 45, 46, 45],
    lineColor: "#92400e",
  },
];



export default function CareHistoryContent() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌷</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ทิวลิป</h1>
            <p className="text-sm text-gray-500 italic">Tulipa spp.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 ml-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold text-green-700">สุขภาพดี 85%</span>
        </div>
        <div className="ml-auto text-sm text-gray-500">อายุ 45 วัน • ปลูกเมื่อ 1 มี.ค. 2567</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
          <div className="grid grid-cols-5 gap-4">
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

      {activeTab !== "overview" && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">กำลังพัฒนาเนื้อหาส่วนนี้...</p>
        </div>
      )}
    </div>
  );
}

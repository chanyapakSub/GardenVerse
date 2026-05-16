"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SensorChart from "./SensorChart";
import CareTable from "./CareTable";
import CareSummary from "./CareSummary";
import AlertPanel from "./AlertPanel";
import { StatCard } from "@/components/molecules/StatCard";
import { useStore, PLANT_CATALOG, DECO_CATALOG } from "@/store/useStore";
import { supabase } from "@/lib/supabase";

interface CareHistoryContentProps {
  selectedPlantId?: string | null; // ตอนนี้คือ item.id (จาก Sidebar)
}

interface ReadingRow {
  recorded_at: string;
  temperature: number | null;
  humidity: number | null;
  lux: number | null;
}

// คำนวณค่าเฉลี่ย 24 ชม. และตัดสินใจ badge ความเหมาะสมจาก range พืช
function avg(nums: number[]): number | null {
  const ok = nums.filter((n) => Number.isFinite(n)) as number[];
  if (ok.length === 0) return null;
  return ok.reduce((a, b) => a + b, 0) / ok.length;
}
function inRange(v: number | null, lo: number, hi: number): "ปกติ" | "ต่ำ" | "สูง" | "-" {
  if (v === null) return "-";
  if (v < lo) return "ต่ำ";
  if (v > hi) return "สูง";
  return "ปกติ";
}

export default function CareHistoryContent({ selectedPlantId }: CareHistoryContentProps) {
  const { detectionHistory, items } = useStore();

  // หา item ที่กำลังเลือก (จาก sidebar)
  const selectedItem = useMemo(
    () => items.find((it) => it.id === selectedPlantId) ?? null,
    [items, selectedPlantId]
  );
  const plant = selectedItem?.plantId
    ? (selectedItem.type === "deco" ? DECO_CATALOG : PLANT_CATALOG).find((p) => p.id === selectedItem.plantId)
    : null;

  // โหลด sensor readings 24h สำหรับ stat cards
  const [readings, setReadings] = useState<ReadingRow[]>([]);
  useEffect(() => {
    let cancelled = false;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    (async () => {
      try {
        let q = supabase
          .from("sensor_readings")
          .select("recorded_at, temperature, humidity, lux")
          .gte("recorded_at", since)
          .order("recorded_at", { ascending: true })
          .limit(5000);
        if (selectedItem?.deviceId) q = q.eq("device_id", selectedItem.deviceId);
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelled) setReadings(data ?? []);
      } catch {
        if (!cancelled) setReadings([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedItem?.deviceId]);

  const tempAvg = useMemo(() => avg(readings.map((r) => r.temperature ?? NaN)), [readings]);
  const humidAvg = useMemo(() => avg(readings.map((r) => r.humidity ?? NaN)), [readings]);
  const luxAvg = useMemo(() => avg(readings.map((r) => r.lux ?? NaN)), [readings]);

  // ค่าช่วงเหมาะสม (default — overrides ได้ในอนาคต)
  const tempRange = { lo: 15, hi: 25 };
  const humidRange = { lo: 50, hi: 70 };
  const luxRange = { lo: 200, hi: 10000 };

  const statCards = [
    {
      id: "humidity",
      label: "ความชื้นอากาศ (เฉลี่ย 24 ชม.)",
      value: humidAvg === null ? "-" : humidAvg.toFixed(1),
      unit: "%",
      badge: inRange(humidAvg, humidRange.lo, humidRange.hi),
      badgeColor: "bg-blue-100 text-blue-700",
      color: "text-blue-600",
      icon: "💧",
      subLabel: `เหมาะสม ${humidRange.lo}-${humidRange.hi}%`,
      trend: readings.map((r) => r.humidity ?? 0).slice(-30),
      lineColor: "#3b82f6",
    },
    {
      id: "temp",
      label: "อุณหภูมิ (เฉลี่ย 24 ชม.)",
      value: tempAvg === null ? "-" : tempAvg.toFixed(1),
      unit: "°C",
      badge: inRange(tempAvg, tempRange.lo, tempRange.hi),
      badgeColor: "bg-orange-100 text-orange-700",
      color: "text-orange-600",
      icon: "🌡️",
      subLabel: `เหมาะสม ${tempRange.lo}-${tempRange.hi}°C`,
      trend: readings.map((r) => r.temperature ?? 0).slice(-30),
      lineColor: "#f97316",
    },
    {
      id: "lux",
      label: "ความสว่าง (เฉลี่ย 24 ชม.)",
      value: luxAvg === null ? "-" : Math.round(luxAvg).toString(),
      unit: " lux",
      badge: inRange(luxAvg, luxRange.lo, luxRange.hi),
      badgeColor: "bg-yellow-100 text-yellow-700",
      color: "text-yellow-600",
      icon: "☀️",
      subLabel: `เหมาะสม ${luxRange.lo}+ lux`,
      trend: readings.map((r) => r.lux ?? 0).slice(-30),
      lineColor: "#eab308",
    },
  ];

  // Header info
  const headerName = plant?.name ?? "ภาพรวมโรงเรือน";
  const headerSci = plant?.scientificName ?? "";
  const headerEmoji = plant?.emoji ?? "🏡";
  const health = selectedItem?.health ?? 85;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{headerEmoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{headerName}</h1>
            {headerSci && <p className="text-sm text-gray-500 italic">{headerSci}</p>}
          </div>
        </div>
        {selectedItem && (() => {
          if (health >= 80) return (
            <div className="flex items-center gap-2 bg-green-50 px-4 py-1.5 rounded-full border border-green-200 ml-2">
              <span className="text-sm font-semibold text-green-700">🌱 สุขภาพดีมาก</span>
            </div>
          );
          if (health >= 60) return (
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 ml-2">
              <span className="text-sm font-semibold text-blue-700">🌿 สุขภาพดี</span>
            </div>
          );
          if (health >= 40) return (
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
        {selectedItem?.plantedAt && (
          <div className="ml-auto text-sm text-gray-500">ปลูกเมื่อ {selectedItem.plantedAt}</div>
        )}
      </div>

      {/* Tab indicator (เหลือเฉพาะ "ภาพรวม") */}
      <div className="flex gap-1 border-b border-gray-200">
        <div className="flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 border-green-600 text-green-700 bg-green-50/50">
          ภาพรวม
        </div>
      </div>

      {/* Overview content */}
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
            <SensorChart deviceId={selectedItem?.deviceId} />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <CareSummary />
          </div>
        </div>

        {/* Table + Alerts */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <CareTable itemId={selectedItem?.id ?? null} />
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <AlertPanel />
          </div>
        </div>

        {/* AI Detection History (ยังเก็บไว้เพราะข้อมูลจริงและมีประโยชน์) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              ประวัติการวินิจฉัยด้วย AI
            </h3>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {detectionHistory.length} รายการ
            </span>
          </div>

          {detectionHistory.length > 0 ? (
            <div className="flex flex-col gap-3">
              {detectionHistory.slice(0, 5).map((item) => (
                <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                    <Image src={item.imageUrl} alt={item.prediction} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.timestamp}</span>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {item.confidence}%
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm truncate">{item.prediction}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-gray-50 p-5 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mb-3">ยังไม่มีข้อมูลการวินิจฉัย</p>
              <Link
                href="/disease-detect"
                className="text-xs bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
              >
                เริ่มการตรวจโรคพืช
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

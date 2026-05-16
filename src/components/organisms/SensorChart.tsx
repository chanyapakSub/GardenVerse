"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Reading {
  recorded_at: string;
  temperature: number | null;
  humidity: number | null;
  lux: number | null;
}

const W = 560;
const H = 200;
const PAD = { top: 16, right: 44, bottom: 32, left: 44 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

// แบ่ง 24 ชม. ออกเป็น N bins แล้วเฉลี่ยค่าในแต่ละ bin → กราฟไม่จิ๊กจ๊อกเกินไป
function bin24h(readings: Reading[], bins = 24) {
  const now = Date.now();
  const start = now - 24 * 60 * 60 * 1000;
  const span = now - start;
  const tBins: number[][] = Array.from({ length: bins }, () => []);
  const hBins: number[][] = Array.from({ length: bins }, () => []);
  const lBins: number[][] = Array.from({ length: bins }, () => []);
  for (const r of readings) {
    const t = new Date(r.recorded_at).getTime();
    if (isNaN(t) || t < start) continue;
    const i = Math.min(bins - 1, Math.floor(((t - start) / span) * bins));
    if (typeof r.temperature === "number") tBins[i].push(r.temperature);
    if (typeof r.humidity === "number") hBins[i].push(r.humidity);
    if (typeof r.lux === "number") lBins[i].push(r.lux);
  }
  const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN);
  return {
    temperature: tBins.map(avg),
    humidity: hBins.map(avg),
    lux: lBins.map(avg),
  };
}

function pathFrom(values: number[], min: number, max: number): string {
  const valid = values.map((v, i) => ({ v, i })).filter((p) => Number.isFinite(p.v));
  if (valid.length === 0) return "";
  return valid
    .map((p, idx) => {
      const x = PAD.left + (p.i / Math.max(values.length - 1, 1)) * chartW;
      const y = PAD.top + chartH - ((p.v - min) / (max - min || 1)) * chartH;
      return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const SERIES_META = [
  { key: "temperature" as const, label: "อุณหภูมิ (°C)", color: "#ef4444", axis: "left" as const },
  { key: "humidity" as const,    label: "ความชื้น (%)",   color: "#3b82f6", axis: "left" as const },
  { key: "lux" as const,         label: "ความสว่าง (lux)", color: "#eab308", axis: "right" as const },
];

const LEFT_RANGE = { min: 0, max: 100 };

export default function SensorChart({ deviceId }: { deviceId?: string }) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastAtRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    lastAtRef.current = null;

    const fetchInitial = async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      setIsLoading(true);
      setError(null);
      try {
        let q = supabase
          .from("sensor_readings")
          .select("recorded_at, temperature, humidity, lux")
          .gte("recorded_at", since)
          .order("recorded_at", { ascending: true })
          .limit(5000);
        if (deviceId) q = q.eq("device_id", deviceId);
        const { data, error } = await q;
        if (error) throw error;
        if (cancelled) return;
        const rows = data ?? [];
        setReadings(rows);
        lastAtRef.current = rows.length > 0 ? rows[rows.length - 1].recorded_at : null;
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : "load failed");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    // Poll: ดึงเฉพาะ row ที่มาใหม่กว่าตัวล่าสุดที่มี
    const fetchIncremental = async () => {
      try {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        let q = supabase
          .from("sensor_readings")
          .select("recorded_at, temperature, humidity, lux")
          .gt("recorded_at", lastAtRef.current ?? cutoff)
          .order("recorded_at", { ascending: true })
          .limit(500);
        if (deviceId) q = q.eq("device_id", deviceId);
        const { data, error } = await q;
        if (error || !data || data.length === 0 || cancelled) return;
        lastAtRef.current = data[data.length - 1].recorded_at;
        setReadings((prev) => {
          const cutMs = Date.now() - 24 * 60 * 60 * 1000;
          const merged = [...prev, ...data];
          return merged.filter((r) => new Date(r.recorded_at).getTime() >= cutMs);
        });
      } catch {
        // เงียบไว้ — รอ poll รอบหน้า
      }
    };

    fetchInitial();
    const interval = setInterval(fetchIncremental, 5000); // poll ทุก 5 วินาที
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [deviceId]);

  const binned = useMemo(() => bin24h(readings), [readings]);

  // คำนวณ right-axis range จาก lux จริง (lux อาจสูงมาก)
  const rightRange = useMemo(() => {
    const luxVals = binned.lux.filter((v) => Number.isFinite(v)) as number[];
    if (luxVals.length === 0) return { min: 0, max: 100 };
    const max = Math.max(...luxVals);
    const rounded = max <= 100 ? 100 : Math.ceil(max / 100) * 100;
    return { min: 0, max: rounded };
  }, [binned]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[15px] font-bold text-gray-800">ข้อมูลเซนเซอร์ 24 ชม. ล่าสุด</h3>
        {isLoading && <span className="text-[11px] text-gray-400">กำลังโหลด...</span>}
        {error && <span className="text-[11px] text-red-500">{error}</span>}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-3">
        {SERIES_META.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {readings.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-[200px] bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-400">ไม่มีข้อมูลเซนเซอร์ใน 24 ชม. ที่ผ่านมา</p>
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: "inherit" }}>
          {/* Left Y grid */}
          {[0, 25, 50, 75, 100].map((v) => {
            const y = PAD.top + chartH - ((v - LEFT_RANGE.min) / (LEFT_RANGE.max - LEFT_RANGE.min)) * chartH;
            return (
              <g key={`l-${v}`}>
                <line x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
                <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#aaa">{v}</text>
              </g>
            );
          })}
          {/* Right Y labels for lux */}
          {[0, 0.5, 1].map((p) => {
            const v = rightRange.min + p * (rightRange.max - rightRange.min);
            const y = PAD.top + chartH - p * chartH;
            return (
              <text key={`r-${p}`} x={PAD.left + chartW + 6} y={y + 4} fontSize="9" fill="#aaa">
                {Math.round(v)}
              </text>
            );
          })}

          {/* X axis: hours ago (-24, -18, -12, -6, 0) */}
          {[0, 6, 12, 18, 24].map((hoursAgo) => {
            const x = PAD.left + ((24 - hoursAgo) / 24) * chartW;
            const label = hoursAgo === 0 ? "ตอนนี้" : `-${hoursAgo}ชม.`;
            return (
              <text key={`x-${hoursAgo}`} x={x} y={H - 6} textAnchor="middle" fontSize="9" fill="#aaa">
                {label}
              </text>
            );
          })}

          {/* Lines */}
          {SERIES_META.map((s) => {
            const values = binned[s.key];
            const [min, max] = s.axis === "right" ? [rightRange.min, rightRange.max] : [LEFT_RANGE.min, LEFT_RANGE.max];
            const path = pathFrom(values, min, max);
            return (
              <g key={s.key}>
                <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {values.map((v, i) => {
                  if (!Number.isFinite(v)) return null;
                  const x = PAD.left + (i / Math.max(values.length - 1, 1)) * chartW;
                  const y = PAD.top + chartH - ((v - min) / (max - min || 1)) * chartH;
                  return <circle key={i} cx={x} cy={y} r="2" fill={s.color} />;
                })}
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

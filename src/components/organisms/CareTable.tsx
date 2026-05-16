"use client";

import { useEffect, useState } from "react";
import { Droplets, Sprout, FileText, type LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStore, PLANT_CATALOG } from "@/store/useStore";

interface CareActionRow {
  id: number;
  itemId: string | null;
  action: "water" | "fertilize" | "note";
  detail: string | null;
  performedAt: string;
}

interface CareTableProps {
  itemId?: string | null;
}

const ACTION_META: Record<
  CareActionRow["action"],
  { label: string; icon: LucideIcon; iconColor: string; iconBg: string }
> = {
  water:     { label: "รดน้ำ",   icon: Droplets, iconColor: "text-blue-500",   iconBg: "bg-blue-50" },
  fertilize: { label: "ให้ปุ๋ย", icon: Sprout,   iconColor: "text-orange-500", iconBg: "bg-orange-50" },
  note:      { label: "บันทึก",  icon: FileText, iconColor: "text-amber-500",  iconBg: "bg-amber-50" },
};

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function CareTable({ itemId }: CareTableProps) {
  const items = useStore((s) => s.items);
  const [rows, setRows] = useState<CareActionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const userStr = typeof window !== "undefined" ? localStorage.getItem("current_user") : null;
    if (!userStr) {
      setIsLoading(false);
      return;
    }
    const fetchRows = async () => {
      try {
        const user = JSON.parse(userStr);
        if (!user?.username) return;
        let q = supabase
          .from("care_actions")
          .select("id, itemId, action, detail, performedAt")
          .eq("username", user.username)
          .order("performedAt", { ascending: false })
          .limit(50);
        if (itemId) q = q.eq("itemId", itemId);
        const { data, error } = await q;
        if (error) throw error;
        if (!cancelled) setRows((data as CareActionRow[]) ?? []);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchRows();
    // refresh ทุก 8 วินาที — เพื่อให้ history update ตอน user กดรดน้ำ/ใส่ปุ๋ย
    const interval = setInterval(fetchRows, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [itemId]);

  // map itemId → ชื่อพืช (ใช้แสดงคอลัมน์ "โดย" หรือ context)
  const itemNameMap = new Map<string, string>();
  for (const it of items) {
    if (!it.plantId) continue;
    const plant = PLANT_CATALOG.find((p) => p.id === it.plantId);
    if (plant) itemNameMap.set(it.id, plant.name);
  }

  const visibleRows = showAll ? rows : rows.slice(0, 5);

  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-800 mb-4">ประวัติการดูแลล่าสุด</h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Droplets className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">ยังไม่มีประวัติการดูแล</p>
          <p className="text-xs text-gray-400 mt-1">กด &quot;รดน้ำ&quot; หรือ &quot;ใส่ปุ๋ย&quot; ในแถบด้านขวาเพื่อเริ่มบันทึก</p>
        </div>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 font-semibold border-b border-gray-100">
                <th className="text-left pb-2 pr-4">วันที่ / เวลา</th>
                <th className="text-left pb-2 pr-4">รายการ</th>
                <th className="text-left pb-2 pr-4">รายละเอียด</th>
                <th className="text-left pb-2">พืช</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => {
                const meta = ACTION_META[r.action] ?? ACTION_META.note;
                const Icon = meta.icon;
                const { date, time } = formatDateTime(r.performedAt);
                const itemName = r.itemId ? itemNameMap.get(r.itemId) ?? "—" : "ทั้งสวน";
                return (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-gray-700">{date}</div>
                      <div className="text-xs text-gray-400">{time}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${meta.iconBg} flex items-center justify-center`}>
                          <Icon className={`w-3.5 h-3.5 ${meta.iconColor}`} />
                        </div>
                        <span className="font-semibold text-gray-700">{meta.label}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 text-xs max-w-[200px]">{r.detail ?? "-"}</td>
                    <td className="py-3 text-xs text-gray-500">{itemName}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length > 5 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {showAll ? "แสดงน้อยลง" : `ดูประวัติทั้งหมด (${rows.length})`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { ChevronUp, ChevronDown, Search, Plus, Pencil, Trash2, Check, X, Sprout } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStore, PLANT_CATALOG, DECO_CATALOG, type PlantItem } from "@/store/useStore";

interface SidebarProps {
  onPlantClick?: (itemId: string) => void;
}

// แปลงรายการ items → label พร้อมเลข auto-numbering (#1, #2, ...) ภายในแต่ละชนิดพืช
function buildItemLabels(items: PlantItem[]): Map<string, string> {
  const counts = new Map<number, number>();
  const labels = new Map<string, string>();
  for (const it of items) {
    if (!it.plantId) continue;
    const catalog = it.type === "deco" ? DECO_CATALOG : PLANT_CATALOG;
    const plant = catalog.find((p) => p.id === it.plantId);
    if (!plant) continue;
    const n = (counts.get(it.plantId) ?? 0) + 1;
    counts.set(it.plantId, n);
    labels.set(it.id, `${plant.name} #${n}`);
  }
  return labels;
}

export default function Sidebar({ onPlantClick }: SidebarProps) {
  const greenhouses = useStore((s) => s.greenhouses);
  const items = useStore((s) => s.items);
  const loadGreenhouses = useStore((s) => s.loadGreenhouses);
  const addGreenhouse = useStore((s) => s.addGreenhouse);
  const renameGreenhouse = useStore((s) => s.renameGreenhouse);
  const removeGreenhouse = useStore((s) => s.removeGreenhouse);
  const selectedPlotId = useStore((s) => s.selectedPlotId);
  const setSelectedPlotId = useStore((s) => s.setSelectedPlotId);
  const selectedItemId = useStore((s) => s.selectedItemId);
  const selectItem = useStore((s) => s.selectItem);

  // โหลดโรงเรือนจาก Supabase ครั้งแรก
  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("current_user") : null;
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      if (user?.username) loadGreenhouses(user.username);
    } catch {}
  }, [loadGreenhouses]);

  // UI state
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editingGhId, setEditingGhId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [addingGhName, setAddingGhName] = useState<string | null>(null);

  const toggleCollapse = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const startEditGh = (id: string, currentName: string) => {
    setEditingGhId(id);
    setEditingName(currentName);
  };
  const commitEditGh = async () => {
    if (editingGhId && editingName.trim()) {
      await renameGreenhouse(editingGhId, editingName.trim());
    }
    setEditingGhId(null);
    setEditingName("");
  };
  const beginAddGh = () => setAddingGhName("");
  const commitAddGh = async () => {
    if (addingGhName && addingGhName.trim()) {
      const gh = await addGreenhouse(addingGhName.trim());
      if (gh) {
        setSelectedPlotId(gh.id);
        setCollapsed((prev) => {
          const next = new Set(prev);
          next.delete(gh.id);
          return next;
        });
      }
    }
    setAddingGhName(null);
  };

  const confirmRemoveGh = async (id: string, name: string) => {
    if (typeof window === "undefined") return;
    if (window.confirm(`ลบโรงเรือน "${name}" และพืช/กระถางทั้งหมดข้างใน?`)) {
      await removeGreenhouse(id);
    }
  };

  // Auto-numbering per greenhouse — แยกตามชนิดพืช
  const itemsByGreenhouse = useMemo(() => {
    const m: Record<string, PlantItem[]> = {};
    for (const it of items) {
      if (!it.plotId || !it.plantId) continue;
      (m[it.plotId] ??= []).push(it);
    }
    return m;
  }, [items]);

  const labelsByGreenhouse = useMemo(() => {
    const out: Record<string, Map<string, string>> = {};
    for (const ghId of Object.keys(itemsByGreenhouse)) {
      out[ghId] = buildItemLabels(itemsByGreenhouse[ghId]);
    }
    return out;
  }, [itemsByGreenhouse]);

  const onClickItem = (itemId: string, ghId: string) => {
    if (selectedPlotId !== ghId) setSelectedPlotId(ghId);
    selectItem(itemId);
    onPlantClick?.(itemId);
  };

  return (
    <div className="bg-white rounded-2xl h-full shadow-sm border border-gray-100 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
        <h2 className="font-semibold text-gray-800 text-[15px]">โรงเรือนของฉัน</h2>
        <button
          onClick={beginAddGh}
          className="p-1 rounded-md text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
          title="เพิ่มโรงเรือน"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Inline add greenhouse */}
      {addingGhName !== null && (
        <div className="flex items-center gap-1 mb-1 px-2">
          <input
            autoFocus
            value={addingGhName}
            onChange={(e) => setAddingGhName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitAddGh();
              if (e.key === "Escape") setAddingGhName(null);
            }}
            placeholder="ชื่อโรงเรือน..."
            className="flex-1 text-[13px] px-2 py-1.5 border border-green-300 rounded-md outline-none focus:border-green-500"
          />
          <button onClick={commitAddGh} className="p-1.5 text-green-600 hover:bg-green-50 rounded">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setAddingGhName(null)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {greenhouses.length === 0 && addingGhName === null ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-3 py-6 gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-green-300" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-700">ยังไม่มีโรงเรือน</p>
            <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
              เริ่มต้นด้วยการเพิ่ม<br />โรงเรือนแรกของคุณ
            </p>
          </div>
          <button
            onClick={beginAddGh}
            className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            เพิ่มโรงเรือน
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {greenhouses.map((g) => {
            const isOpen = !collapsed.has(g.id);
            const isActive = selectedPlotId === g.id;
            const isEditingThisGh = editingGhId === g.id;
            const ghItems = itemsByGreenhouse[g.id] ?? [];
            const labels = labelsByGreenhouse[g.id];

            return (
              <div key={g.id} className="flex flex-col">
                {/* Greenhouse row */}
                <div
                  className={`group flex items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                    isActive ? "bg-green-50/60" : "hover:bg-gray-50"
                  }`}
                >
                  <button
                    onClick={() => toggleCollapse(g.id)}
                    className="w-6 flex justify-center text-green-600 shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 8C8 10 5.9 16.1738 5.9 16.1738C5.9 16.1738 7 8 16 5C17 4.66667 19.5 4 19.5 4C19.5 4 20 6.5 17 8Z" />
                    </svg>
                  </button>

                  {isEditingThisGh ? (
                    <>
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEditGh();
                          if (e.key === "Escape") setEditingGhId(null);
                        }}
                        className="flex-1 text-[14px] font-medium px-2 py-0.5 border border-green-300 rounded-md outline-none focus:border-green-500"
                      />
                      <button onClick={commitEditGh} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditingGhId(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedPlotId(g.id);
                          if (collapsed.has(g.id)) toggleCollapse(g.id);
                        }}
                        className={`flex-1 text-left text-[14px] font-medium truncate ${
                          isActive ? "text-green-700" : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        {g.name}
                      </button>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditGh(g.id, g.name)}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="เปลี่ยนชื่อ"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => confirmRemoveGh(g.id, g.name)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="ลบโรงเรือน"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <button onClick={() => toggleCollapse(g.id)} className="text-gray-400 shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>

                {/* Sub-list: plants in this greenhouse */}
                {isOpen && (
                  <div className="flex flex-col gap-0.5 mt-1 mb-2 ml-4">
                    {ghItems.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic px-3 py-1.5">
                        ยังไม่มีพืชในโรงเรือนนี้
                      </p>
                    ) : (
                      ghItems.map((it) => {
                        const label = labels?.get(it.id) ?? "?";
                        const isSel = selectedItemId === it.id;
                        return (
                          <button
                            key={it.id}
                            onClick={() => onClickItem(it.id, g.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors ${
                              isSel
                                ? "bg-amber-50 text-amber-700 font-semibold ring-1 ring-amber-200"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <Sprout className={`w-3 h-3 shrink-0 ${isSel ? "text-amber-500" : "text-green-400"}`} />
                            <span className="text-[13px] flex-1 truncate">{label}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* เมนูเสริมด้านล่าง */}
      <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
        <Link
          href="/disease-detect"
          className="flex items-center gap-3 py-3 px-3 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-all border border-green-100 group shadow-sm shadow-green-900/5"
        >
          <div className="bg-green-600 text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-md">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold">AI ตรวจโรคพืช</span>
            <span className="text-[10px] opacity-70">วิเคราะห์ใบไม้จากรูปถ่าย</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

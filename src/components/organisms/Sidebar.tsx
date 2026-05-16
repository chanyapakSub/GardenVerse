"use client";

import { ChevronUp, ChevronDown, Search, Plus, Pencil, Trash2, Check, X, ArrowRightLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

interface SidebarProps {
  onPlantClick?: (plantId: string) => void;
}

export default function Sidebar({ onPlantClick }: SidebarProps) {
  const greenhouses = useStore((s) => s.greenhouses);
  const plots = useStore((s) => s.plots);
  const loadGreenhouses = useStore((s) => s.loadGreenhouses);
  const loadPlots = useStore((s) => s.loadPlots);
  const addGreenhouse = useStore((s) => s.addGreenhouse);
  const renameGreenhouse = useStore((s) => s.renameGreenhouse);
  const removeGreenhouse = useStore((s) => s.removeGreenhouse);
  const addPlot = useStore((s) => s.addPlot);
  const renamePlot = useStore((s) => s.renamePlot);
  const removePlot = useStore((s) => s.removePlot);
  const movePlot = useStore((s) => s.movePlot);
  const selectedPlotId = useStore((s) => s.selectedPlotId);
  const setSelectedPlotId = useStore((s) => s.setSelectedPlotId);

  // โหลดจาก Supabase ครั้งแรก
  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("current_user") : null;
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      if (user?.username) {
        loadGreenhouses(user.username);
        loadPlots(user.username);
      }
    } catch {}
  }, [loadGreenhouses, loadPlots]);

  // UI state
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editingGhId, setEditingGhId] = useState<string | null>(null);
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [addingGhName, setAddingGhName] = useState<string | null>(null); // null = ไม่กำลังเพิ่ม
  const [addingPlotFor, setAddingPlotFor] = useState<string | null>(null);
  const [addingPlotName, setAddingPlotName] = useState("");
  const [movingPlotId, setMovingPlotId] = useState<string | null>(null);
  const moveMenuRef = useRef<HTMLDivElement | null>(null);

  // ปิด move menu เมื่อคลิกข้างนอก
  useEffect(() => {
    if (!movingPlotId) return;
    const onClick = (e: MouseEvent) => {
      if (moveMenuRef.current && !moveMenuRef.current.contains(e.target as Node)) {
        setMovingPlotId(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [movingPlotId]);

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
    setEditingPlotId(null);
  };
  const commitEditGh = async () => {
    if (editingGhId && editingName.trim()) {
      await renameGreenhouse(editingGhId, editingName.trim());
    }
    setEditingGhId(null);
    setEditingName("");
  };
  const startEditPlot = (id: string, currentName: string) => {
    setEditingPlotId(id);
    setEditingName(currentName);
    setEditingGhId(null);
  };
  const commitEditPlot = async () => {
    if (editingPlotId && editingName.trim()) {
      await renamePlot(editingPlotId, editingName.trim());
    }
    setEditingPlotId(null);
    setEditingName("");
  };

  const beginAddGh = () => {
    setAddingGhName("");
    setAddingPlotFor(null);
  };
  const commitAddGh = async () => {
    if (addingGhName && addingGhName.trim()) {
      const gh = await addGreenhouse(addingGhName.trim());
      if (gh) setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(gh.id);
        return next;
      });
    }
    setAddingGhName(null);
  };

  const beginAddPlot = (ghId: string) => {
    setAddingPlotFor(ghId);
    setAddingPlotName("");
  };
  const commitAddPlot = async () => {
    if (addingPlotFor && addingPlotName.trim()) {
      await addPlot(addingPlotFor, addingPlotName.trim());
    }
    setAddingPlotFor(null);
    setAddingPlotName("");
  };

  const confirmRemoveGh = async (id: string, name: string) => {
    if (typeof window === "undefined") return;
    if (window.confirm(`ลบโรงเรือน "${name}" และแปลงทั้งหมดข้างใน?`)) {
      await removeGreenhouse(id);
    }
  };
  const confirmRemovePlot = async (id: string, name: string) => {
    if (typeof window === "undefined") return;
    if (window.confirm(`ลบแปลง "${name}" และพืช/กระถางในแปลงนี้?`)) {
      await removePlot(id);
    }
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
            const ghPlots = plots.filter((p) => p.greenhouseId === g.id);
            const isEditingThisGh = editingGhId === g.id;

            return (
              <div key={g.id} className="flex flex-col">
                {/* Greenhouse row */}
                <div className="group flex items-center gap-1 py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">
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
                        onClick={() => toggleCollapse(g.id)}
                        className="flex-1 text-left text-[14px] font-medium text-gray-700 hover:text-gray-900 truncate"
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
                      <button
                        onClick={() => toggleCollapse(g.id)}
                        className="text-gray-400 shrink-0"
                      >
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                </div>

                {/* Plots */}
                {isOpen && (
                  <div className="flex flex-col gap-1 mt-1 mb-2 ml-4">
                    {ghPlots.map((plot) => {
                      const isSelected = selectedPlotId === plot.id;
                      const isEditingThisPlot = editingPlotId === plot.id;

                      if (isEditingThisPlot) {
                        return (
                          <div key={plot.id} className="flex items-center gap-1 px-2">
                            <input
                              autoFocus
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitEditPlot();
                                if (e.key === "Escape") setEditingPlotId(null);
                              }}
                              className="flex-1 text-[13px] px-2 py-1 border border-green-300 rounded-md outline-none focus:border-green-500"
                            />
                            <button onClick={commitEditPlot} className="p-1 text-green-600 hover:bg-green-50 rounded">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingPlotId(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      }

                      const isMovingThis = movingPlotId === plot.id;
                      const otherGreenhouses = greenhouses.filter((gh) => gh.id !== plot.greenhouseId);

                      return (
                        <div key={plot.id} className="relative">
                          <div
                            className={`group/plot flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-green-50/80 text-green-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => {
                              setSelectedPlotId(plot.id);
                              onPlantClick?.(plot.id);
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-green-500" : "bg-gray-300"}`} />
                            <span className="text-[14px] flex-1 truncate">{plot.name}</span>
                            <div className={`flex items-center gap-0.5 transition-opacity ${isMovingThis ? "opacity-100" : "opacity-0 group-hover/plot:opacity-100"}`}>
                              {greenhouses.length > 1 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMovingPlotId(isMovingThis ? null : plot.id);
                                  }}
                                  className={`p-1 rounded ${isMovingThis ? "text-green-600 bg-green-50" : "text-gray-400 hover:text-green-600 hover:bg-green-50"}`}
                                  title="ย้ายไปโรงเรือนอื่น"
                                >
                                  <ArrowRightLeft className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditPlot(plot.id, plot.name);
                                }}
                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                title="เปลี่ยนชื่อ"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmRemovePlot(plot.id, plot.name);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="ลบแปลง"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Move menu */}
                          {isMovingThis && otherGreenhouses.length > 0 && (
                            <div
                              ref={moveMenuRef}
                              className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 min-w-[180px] max-h-60 overflow-y-auto"
                            >
                              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                ย้ายไปยัง
                              </div>
                              {otherGreenhouses.map((gh) => (
                                <button
                                  key={gh.id}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await movePlot(plot.id, gh.id);
                                    setMovingPlotId(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-[13px] text-gray-700 hover:bg-green-50 hover:text-green-700 truncate"
                                >
                                  {gh.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Inline add plot */}
                    {addingPlotFor === g.id ? (
                      <div className="flex items-center gap-1 px-2">
                        <input
                          autoFocus
                          value={addingPlotName}
                          onChange={(e) => setAddingPlotName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitAddPlot();
                            if (e.key === "Escape") setAddingPlotFor(null);
                          }}
                          placeholder="ชื่อแปลง..."
                          className="flex-1 text-[13px] px-2 py-1 border border-green-300 rounded-md outline-none focus:border-green-500"
                        />
                        <button onClick={commitAddPlot} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setAddingPlotFor(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => beginAddPlot(g.id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        เพิ่มแปลง
                      </button>
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

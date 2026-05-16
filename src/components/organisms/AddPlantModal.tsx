"use client";

import { X, Save, Leaf, Search, Upload, Plus, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useStore, PLANT_CATALOG } from "@/store/useStore";
import { supabase } from "@/lib/supabase";
import type { UserPlant } from "@/store/useStore";

export default function AddPlantModal() {
  const isOpen = useStore((s) => s.isAddPlantModalOpen);
  const closeAddPlantModal = useStore((s) => s.closeAddPlantModal);
  const addUserPlant = useStore((s) => s.addUserPlant);

  const [form, setForm] = useState({
    name: "",
    sciName: "",
    image: PLANT_CATALOG[0].image,
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        sciName: "",
        image: PLANT_CATALOG[0].image,
      });
      setSearchTerm("");
      setShowResults(false);
    }
  }, [isOpen]);

  // Click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredCatalog = PLANT_CATALOG.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectFromCatalog = (p: typeof PLANT_CATALOG[0]) => {
    setForm({
      name: p.name,
      sciName: p.scientificName,
      image: p.image,
    });
    setSearchTerm(p.name);
    setShowResults(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const userStr = localStorage.getItem("current_user");
      const username = userStr ? JSON.parse(userStr)?.username ?? "guest" : "guest";

      const newPlantData = {
        username,
        name: form.name,
        sciName: form.sciName,
        status: "สุขภาพดี",
        statusColor: "bg-green-50 text-green-600 border-green-200",
        age: "1 วัน",
        planted: new Date().toLocaleDateString("th-TH", {
          day: "numeric", month: "short", year: "numeric",
        }),
        water: "100%",
        image: form.image,
      };

      const { data, error } = await supabase
        .from("plants")
        .insert([newPlantData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        addUserPlant(data as UserPlant);
        closeAddPlantModal();
      }
    } catch (err: any) {
      console.error("Error adding plant:", err);
      alert("บันทึกพืชไม่สำเร็จ: " + (err.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">เพิ่มพืชใหม่</h2>
          </div>
          <button
            onClick={closeAddPlantModal}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Search Box */}
          <div className="space-y-1.5 relative" ref={searchRef}>
            <label className="text-sm font-bold text-gray-700 ml-1">ค้นหาจากชนิดที่มีในระบบ</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="ค้นหาชื่อพืชเพื่อเติมข้อมูลอัตโนมัติ..."
                className="w-full pl-11 pr-10 py-3.5 bg-green-50/50 border border-green-100 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm font-medium"
              />
              <ChevronDown className={`w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${showResults ? 'rotate-180' : ''}`} />
            </div>

            {/* Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-2 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in duration-200">
                {filteredCatalog.length > 0 ? (
                  filteredCatalog.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectFromCatalog(p)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-green-50 rounded-xl transition-all group border border-transparent hover:border-green-100 mb-1 last:mb-0"
                    >
                      <div className="w-12 h-12 relative shrink-0 bg-gray-50 rounded-lg group-hover:bg-white transition-colors overflow-hidden">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-1.5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800 group-hover:text-green-700 transition-colors">{p.name}</div>
                        <div className="text-[11px] text-gray-400 italic font-medium">{p.scientificName}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-400">ไม่พบพืชที่ตรงกับ "{searchTerm}"</p>
                    <button 
                      type="button"
                      onClick={() => {
                        setForm({...form, name: searchTerm});
                        setShowResults(false);
                      }}
                      className="mt-2 text-xs text-green-600 font-bold hover:underline"
                    >
                      ใช้เป็นชื่อพืชใหม่เลย
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">ชื่อพืชที่แสดง</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ชื่อที่จะแสดงในระบบ"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">ชื่อวิทยาศาสตร์</label>
                <input
                  type="text"
                  value={form.sciName}
                  onChange={(e) => setForm({ ...form, sciName: e.target.value })}
                  placeholder="Scientific Name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all italic text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 ml-1 flex justify-between items-center">
                รูปภาพพืช
                <span className="text-[10px] font-normal text-gray-400 uppercase tracking-wider">คลิกที่รูปเพื่อเปลี่ยน</span>
              </label>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 relative rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden group shadow-inner">
                    <Image src={form.image} alt="Preview" fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-2">
                      <Upload className="w-6 h-6 text-white" />
                      <span className="text-[10px] text-white font-bold uppercase">อัปโหลด</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                    <Upload className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    คุณสามารถเลือกรูปจากรายการยอดนิยมด้านล่าง หรืออัปโหลดไฟล์ภาพจากเครื่องได้โดยตรง
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {(filteredCatalog.length > 0 ? filteredCatalog : PLANT_CATALOG).slice(0, 5).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setForm({ ...form, image: p.image })}
                        className={`w-12 h-12 relative rounded-xl border-2 transition-all overflow-hidden ${
                          form.image === p.image ? 'border-green-500 bg-green-50 ring-4 ring-green-500/10' : 'border-gray-100 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <Image src={p.image} alt="Option" fill className="object-contain p-1.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
          <button
            type="button"
            onClick={closeAddPlantModal}
            className="flex-1 py-3.5 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.name || isSaving}
            className="flex-1 py-3.5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 shadow-xl shadow-green-200 active:scale-95"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            บันทึกพืชใหม่
          </button>
        </div>
      </div>
    </div>
  );
}

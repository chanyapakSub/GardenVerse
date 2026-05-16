"use client";

import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";
import { WeatherWidget } from "@/components/molecules/WeatherWidget";
import Image from "next/image";
import { Search, Plus, MoreVertical, Droplet, ChevronDown, ChevronLeft, ChevronRight, MoveRight, Lightbulb, Leaf, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import type { UserPlant } from "@/store/useStore";
import AddPlantModal from "@/components/organisms/AddPlantModal";

export default function PlantsPage() {
  const { userPlants, setUserPlants, openAddPlantModal } = useStore();
  const plants = userPlants;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("current_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        fetchPlants(user.username);
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // ดึงข้อมูลจาก Supabase เท่านั้น
  const fetchPlants = async (username: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("username", username)
        .order("id", { ascending: true });

      if (error) throw error;
      setUserPlants(data ?? []);
    } catch (err: any) {
      console.warn("ไม่สามารถดึงข้อมูลพืชจาก Supabase ได้:", err?.message ?? err);
      setUserPlants([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats calculation
  const totalPlants = plants.length;
  const healthyPlants = plants.filter((p: UserPlant) => p.status === "สุขภาพดี").length;
  const warningPlants = plants.filter((p: UserPlant) => p.status === "เฝ้าระวัง").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex gap-4 h-[calc(100vh-80px)]">

        {/* Left Sidebar */}
        <div className="w-[280px] h-full shrink-0 flex flex-col gap-4">
          <div className="flex-1 overflow-hidden">
            <Sidebar />
          </div>
          <WeatherWidget temperature={32.0} humidity={60.0} />
        </div>

        {/* Center Content */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col p-6 overflow-y-auto custom-scrollbar relative">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">พืชของฉัน</h1>
                <p className="text-sm text-gray-500">จัดการพืชทั้งหมดในโรงเรือนของคุณ</p>
              </div>
            </div>
            <button
              onClick={openAddPlantModal}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              เพิ่มพืชใหม่
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-6 gap-6">
            <button className="text-green-600 border-b-2 border-green-600 pb-3 text-sm font-medium">
              พืชทั้งหมด
            </button>
            <button className="text-gray-500 hover:text-gray-700 pb-3 text-sm font-medium">
              ตามโซน
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อพืช..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-300 focus:ring-1 focus:ring-green-300 transition-all"
                suppressHydrationWarning
              />
            </div>
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 min-w-[130px] hover:bg-gray-50">
              ประเภทพืช <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 min-w-[130px] hover:bg-gray-50">
              สถานะ <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="text-sm text-gray-500 mb-4 font-medium">ทั้งหมด {totalPlants} ต้น</div>

          {/* Plant Grid */}
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
            </div>
          ) : plants.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Leaf className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-gray-800 font-bold mb-2">ยังไม่มีพืชในสวนของคุณ</h3>
              <p className="text-gray-500 text-sm max-w-[300px] mb-6">
                เริ่มต้นปลูกพืชต้นแรกของคุณ เพื่อดูข้อมูลและติดตามการเจริญเติบโต
              </p>
              <button
                onClick={openAddPlantModal}
                className="flex items-center gap-2 bg-white border border-green-200 text-green-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                เพิ่มพืชต้นแรก
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mb-8">
              {plants.map((plant: UserPlant) => (
                <div key={plant.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-md transition-all group flex flex-col">
                  <div className="relative h-40 w-full mb-4 flex items-center justify-center overflow-hidden bg-gray-50/50 rounded-xl">
                    <Image
                      src={plant.image}
                      alt={plant.name}
                      fill
                      className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                    />
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 bg-white/80 rounded-full p-1 backdrop-blur-sm z-10">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Leaf className="w-3.5 h-3.5 text-green-600" />
                    <h3 className="font-bold text-gray-800 text-sm">{plant.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 italic mb-3">{plant.sciName}</p>

                  <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit border ${plant.statusColor || "bg-green-50 text-green-600 border-green-200"} mb-4`}>
                    {plant.status || "สุขภาพดี"}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
                    <div>
                      <div className="text-gray-400 mb-0.5">อายุ</div>
                      <div className="text-gray-700 font-medium">{plant.age || "1 วัน"}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-0.5">ปลูกเมื่อ</div>
                      <div className="text-gray-700 font-medium">{plant.planted || "-"}</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                      <Leaf className="w-3 h-3" /> {plant.water || "100%"}
                    </div>
                    <Droplet className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {plants.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-auto">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 text-white font-medium text-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

          {/* ภาพรวมพืช */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm mb-4">ภาพรวมพืช</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-gray-100">
                <Leaf className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-lg font-bold text-gray-800">{totalPlants}</span>
                <span className="text-[11px] text-gray-500 font-medium">ชนิดพืช</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-gray-100">
                <Leaf className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-lg font-bold text-gray-800">{totalPlants}</span>
                <span className="text-[11px] text-gray-500 font-medium">ต้นทั้งหมด</span>
              </div>
              <div className="bg-green-50/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-green-100">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mb-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800">{healthyPlants}</span>
                <span className="text-[11px] text-gray-500 font-medium">สุขภาพดี</span>
              </div>
              <div className="bg-orange-50/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-orange-100">
                <AlertTriangle className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-lg font-bold text-gray-800">{warningPlants}</span>
                <span className="text-[11px] text-gray-500 font-medium">เฝ้าระวัง</span>
              </div>
            </div>
          </div>

          {/* การดำเนินการด่วน */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm mb-3">การดำเนินการด่วน</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={openAddPlantModal}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group text-sm text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="text-green-600"><Plus className="w-4 h-4" /></div>
                  <span className="font-medium group-hover:text-green-700">เพิ่มพืชใหม่</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </button>
              <button className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="text-green-600"><MoveRight className="w-4 h-4" /></div>
                  <span className="font-medium group-hover:text-green-700">ย้ายพืช</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </button>
            </div>
          </div>

          {/* เคล็ดลับ */}
          <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100 flex gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800 text-sm">เคล็ดลับ</span>
              <p className="text-xs text-gray-600 leading-relaxed">
                ตรวจสอบสุขภาพพืชอย่างสม่ำเสมอ เพื่อให้พืชเจริญเติบโตแข็งแรง
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Shared Add Plant Modal */}
      <AddPlantModal />
    </div>
  );
}

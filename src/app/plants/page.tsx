"use client";

import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";
import { WeatherWidget } from "@/components/molecules/WeatherWidget";
import Image from "next/image";
import { Search, Plus, MoreVertical, Droplet, ChevronDown, ChevronLeft, ChevronRight, Download, MoveRight, Save, Lightbulb, Leaf, Activity, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function PlantsPage() {
  const [plants, setPlants] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlantForm, setNewPlantForm] = useState({
    name: "",
    sciName: "",
    image: "/images/flower/Tilip.png"
  });

  const imageOptions = [
    { label: "ทิวลิป", value: "/images/flower/Tilip.png" },
    { label: "กุหลาบ", value: "/images/flower/Rose.png" },
    { label: "ลาเวนเดอร์", value: "/images/flower/Lavender.png" },
    { label: "ทานตะวัน", value: "/images/flower/Tantawan.png" },
    { label: "มะเขือเทศ", value: "/images/vegetable/Tomato.png" },
  ];

  useEffect(() => {
    const userStr = localStorage.getItem("current_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchPlants(user.username);
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchPlants = async (username: string) => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase.from('plants').select('*').eq('username', username);
      if (error) throw error;

      if (data && data.length > 0) {
        setPlants(data);
      } else {
        // If empty, check local storage fallback
        const localPlants = localStorage.getItem(`gardenverse_plants_${username}`);
        if (localPlants) {
          setPlants(JSON.parse(localPlants));
        }
      }
    } catch (error) {
      console.error("Supabase fetch error, falling back to local storage:", error);
      const localPlants = localStorage.getItem(`gardenverse_plants_${username}`);
      if (localPlants) {
        setPlants(JSON.parse(localPlants));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newPlantData = {
      username: currentUser.username,
      name: newPlantForm.name,
      sciName: newPlantForm.sciName,
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "1 วัน",
      planted: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
      water: "100%",
      image: newPlantForm.image,
    };

    try {
      // Save to Supabase database
      const { data, error } = await supabase.from('plants').insert([newPlantData]).select();
      if (error) {
        console.warn("Could not save to Supabase. Table might not exist.", error);
      }

      const plantToSave = data && data.length > 0 ? data[0] : { ...newPlantData, id: Date.now() };

      const updatedPlants = [...plants, plantToSave];
      setPlants(updatedPlants);

      // Always save to localStorage as a reliable fallback
      localStorage.setItem(`gardenverse_plants_${currentUser.username}`, JSON.stringify(updatedPlants));

      setIsAddModalOpen(false);
      setNewPlantForm({ name: "", sciName: "", image: "/images/flower/Tilip.png" });
    } catch (err) {
      console.error("Failed to add plant:", err);
    }
  };

  // Stats calculation
  const totalPlants = plants.length;
  const healthyPlants = plants.filter(p => p.status === "สุขภาพดี").length;
  const warningPlants = plants.filter(p => p.status === "เฝ้าระวัง").length;

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
              onClick={() => setIsAddModalOpen(true)}
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
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : plants.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Leaf className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-gray-800 font-bold mb-2">ยังไม่มีพืชในสวนของคุณ</h3>
              <p className="text-gray-500 text-sm max-w-[300px] mb-6">เริ่มต้นปลูกพืชต้นแรกของคุณ เพื่อดูข้อมูลและติดตามการเจริญเติบโต</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-white border border-green-200 text-green-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                เพิ่มพืชต้นแรก
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mb-8">
              {plants.map((plant) => (
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

                  <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit border ${plant.statusColor || 'bg-green-50 text-green-600 border-green-200'} mb-4`}>
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
                <div className="flex mb-1 relative">
                  <Leaf className="w-4 h-4 text-green-500 absolute -left-2" />
                  <Leaf className="w-5 h-5 text-green-600" />
                  <Leaf className="w-4 h-4 text-green-500 absolute -right-2" />
                </div>
                <span className="text-lg font-bold text-gray-800 mt-1">{totalPlants}</span>
                <span className="text-[11px] text-gray-500 font-medium">ต้นทั้งหมด</span>
              </div>
              <div className="bg-green-50/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-green-100">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mb-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
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
                onClick={() => setIsAddModalOpen(true)}
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

      {/* Add Plant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">เพิ่มพืชใหม่</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlant} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ชื่อพืช</label>
                <input
                  type="text"
                  required
                  value={newPlantForm.name}
                  onChange={(e) => setNewPlantForm({ ...newPlantForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  placeholder="เช่น ทิวลิป, มะเขือเทศ"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">ชื่อวิทยาศาสตร์ (ไม่บังคับ)</label>
                <input
                  type="text"
                  value={newPlantForm.sciName}
                  onChange={(e) => setNewPlantForm({ ...newPlantForm, sciName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm italic"
                  placeholder="เช่น Tulipa spp."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">รูปภาพ</label>
                <div className="grid grid-cols-5 gap-2">
                  {imageOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewPlantForm({ ...newPlantForm, image: opt.value })}
                      className={`p-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${newPlantForm.image === opt.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-transparent hover:bg-gray-50'
                        }`}
                    >
                      <Image src={opt.value} alt={opt.label} width={40} height={40} className="object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

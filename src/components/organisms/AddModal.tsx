"use client";

import { useStore } from "@/store/useStore";
import { X, Search, Plus, Leaf, Box, Cpu, Settings2, MoreHorizontal, Thermometer, Droplets, Sun } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const plantTypes = [
  { id: 1, name: "ทิวลิป", sci: "Tulipa spp.", img: "/images/flower/Tilip.png" },
  { id: 2, name: "กุหลาบ", sci: "Rosa spp.", img: "/images/flower/Rose.png" },
  { id: 3, name: "ลาเวนเดอร์", sci: "Lavandula spp.", img: "/images/flower/Lavender.png" },
  { id: 4, name: "มะเขือเทศ", sci: "Solanum lycopersicum", img: "/images/vegetable/Tomato.png" },
  { id: 5, name: "ทานตะวัน", sci: "Helianthus annuus", img: "/images/flower/Tantawan.png" },
  { id: 6, name: "ไฮเดรนเยีย", sci: "Hydrangea macrophylla", img: "/images/flower/Haidenyia.png" },
  { id: 7, name: "อื่นๆ (เพิ่มชนิดใหม่)", sci: "กำหนดพืชใหม่ด้วยตนเอง", img: "", isMore: true },
];

const filters = ["ทั้งหมด", "ไม้ดอก", "ผัก", "สมุนไพร"];

export default function AddModal() {
  const { isAddModalOpen, closeAddModal, addItem, updateItem, selectedItemId } = useStore();
  const [activeTab, setActiveTab] = useState("add-plant-type");
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);

  const [sensors, setSensors] = useState({
    moisture: true,
    ldr: false,
    temperature: false
  });
  const [customPlant, setCustomPlant] = useState({ name: "", sci: "" });
  const [itemName, setItemName] = useState("");
  const [itemZone, setItemZone] = useState("โซน A : ไม้ดอกเมืองหนาว");
  const [selectedContainer, setSelectedContainer] = useState<"bed" | "pot">("bed");

  if (!isAddModalOpen) return null;

  const handleNextStep = () => {
    if (activeTab === "add-plant-type") {
      if (selectedItemId) setActiveTab("add-sensor");
      else setActiveTab("add-bed");
    }
    else if (activeTab === "add-bed" || activeTab === "add-pot") {
      setSelectedContainer(activeTab === "add-bed" ? "bed" : "pot");
      setActiveTab("add-sensor");
    }
    else {
      if (selectedItemId) {
        updateItem(selectedItemId, {
          plantId: selectedPlant || 1,
          name: itemName,
          zone: itemZone
        });
      } else {
        addItem({
          id: Math.random().toString(),
          type: selectedContainer,
          plantId: selectedPlant || 1,
          position: [(Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5],
          name: itemName,
          zone: itemZone
        });
      }
      closeAddModal();
    }
  };

  const toggleSensor = (key: keyof typeof sensors) => {
    setSensors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderContent = () => {
    if (activeTab === "add-plant-type") {
      return (
        <>
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-gray-800">1. เลือกชนิดพืช</h2>
            <p className="text-[14px] text-gray-500 mt-1">เลือกพืชที่มีอยู่ในระบบ หรือเพิ่มชนิดใหม่ด้วยตนเอง</p>
          </div>

          <div className="relative mb-5">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="ค้นหาพืช..." 
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-[14px] rounded-full py-3 pl-12 pr-4 outline-none focus:border-green-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto custom-scrollbar pb-1">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-[#3b8045] text-white"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {plantTypes.map((plant) => (
                <div 
                  key={plant.id} 
                  onClick={() => setSelectedPlant(plant.id)}
                  className={`border rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer transition-all group flex flex-col items-center text-center relative ${
                    selectedPlant === plant.id ? "border-green-500 bg-green-50/30 ring-2 ring-green-500/20" : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-50 mb-3 flex items-center justify-center border-2 border-white shadow-sm">
                    {plant.isMore ? (
                      <Plus className={`w-8 h-8 ${selectedPlant === plant.id ? "text-green-500" : "text-gray-400"}`} />
                    ) : (
                      <Image src={plant.img} alt={plant.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <h4 className="text-[14px] font-bold text-gray-800">{plant.name}</h4>
                  <p className="text-[11px] text-gray-500 italic mt-0.5 leading-tight">{plant.sci}</p>
                </div>
              ))}
            </div>

            {/* Custom Plant Form - Appears when "Other" is selected */}
            {selectedPlant === 5 && (
              <div className="bg-green-50/50 border border-green-200 rounded-2xl p-5 mb-4 animate-in fade-in slide-in-from-top-4">
                <h4 className="text-[14px] font-bold text-green-800 mb-3">รายละเอียดพืชชนิดใหม่</h4>
                <div className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    placeholder="ชื่อพืช (เช่น สาระแหน่)" 
                    value={customPlant.name}
                    onChange={e => setCustomPlant({...customPlant, name: e.target.value})}
                    className="w-full bg-white border border-green-200 text-gray-800 rounded-xl py-2 px-3 outline-none focus:border-green-500 text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="ชื่อวิทยาศาสตร์ (ไม่บังคับ)" 
                    value={customPlant.sci}
                    onChange={e => setCustomPlant({...customPlant, sci: e.target.value})}
                    className="w-full bg-white border border-green-200 text-gray-800 rounded-xl py-2 px-3 outline-none focus:border-green-500 text-sm italic"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      );
    }

    if (activeTab === "add-bed" || activeTab === "add-pot") {
      return (
        <>
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-gray-800">2. เลือกประเภทและกำหนดพื้นที่ปลูก</h2>
            <p className="text-[14px] text-gray-500 mt-1">เลือกว่าจะปลูกลงแปลงหรือกระถาง พร้อมกำหนดรายละเอียด</p>
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-2">
              <button 
                onClick={() => setActiveTab("add-bed")}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  activeTab === "add-bed" ? "border-green-500 bg-green-50/50 text-green-700" : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Box className={`w-6 h-6 ${activeTab === "add-bed" ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <span className="font-bold">เพิ่มแปลง (Bed)</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("add-pot")}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  activeTab === "add-pot" ? "border-green-500 bg-green-50/50 text-green-700" : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <Leaf className={`w-6 h-6 ${activeTab === "add-pot" ? "text-green-600" : "text-gray-400"}`} />
                </div>
                <span className="font-bold">เพิ่มกระถาง (Pot)</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">ชื่อ{activeTab === "add-bed" ? "แปลง" : "กระถาง"}</label>
              <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder={`เช่น ${activeTab === "add-bed" ? "แปลงทิวลิป 01" : "กระถางกุหลาบหน้าบ้าน"}`} className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl py-3 px-4 outline-none focus:border-green-500" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">ระบุโซนในโรงเรือน</label>
              <select value={itemZone} onChange={(e) => setItemZone(e.target.value)} className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl py-3 px-4 outline-none focus:border-green-500">
                <option>โซน A : ไม้ดอกเมืองหนาว</option>
                <option>โซน B : สมุนไพร</option>
                <option>โซน C : ผักสวนครัว</option>
              </select>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "add-sensor") {
      return (
        <>
          <div className="mb-6">
            <h2 className="text-[22px] font-bold text-gray-800">3. เชื่อมต่อเซนเซอร์</h2>
            <p className="text-[14px] text-gray-500 mt-1">เลือกเซนเซอร์ที่ต้องการติดตั้งกับแปลงนี้ เพื่อรับข้อมูลแบบ Realtime</p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Soil Moisture Sensor */}
            <div className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${sensors.moisture ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white opacity-80 hover:opacity-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${sensors.moisture ? 'bg-white border-green-100 text-blue-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-800">เซนเซอร์วัดความชื้นดิน (Soil Moisture)</h4>
                  <p className={`text-[12px] mt-0.5 ${sensors.moisture ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {sensors.moisture ? 'ESP32-Node-01 • เชื่อมต่อแล้ว' : 'รอการติดตั้ง'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleSensor('moisture')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${sensors.moisture ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
              >
                {sensors.moisture ? 'ถอดออก' : 'ติดตั้ง'}
              </button>
            </div>

            {/* LDR Sensor */}
            <div className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${sensors.ldr ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white opacity-80 hover:opacity-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${sensors.ldr ? 'bg-white border-green-100 text-amber-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-800">เซนเซอร์วัดแสง (LDR Sensor)</h4>
                  <p className={`text-[12px] mt-0.5 ${sensors.ldr ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {sensors.ldr ? 'ESP32-Node-02 • เชื่อมต่อแล้ว' : 'รอการติดตั้ง'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleSensor('ldr')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${sensors.ldr ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
              >
                {sensors.ldr ? 'ถอดออก' : 'ติดตั้ง'}
              </button>
            </div>

            {/* Temperature Sensor */}
            <div className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${sensors.temperature ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-white opacity-80 hover:opacity-100'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border ${sensors.temperature ? 'bg-white border-green-100 text-red-400' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-800">เซนเซอร์วัดอุณหภูมิ (Temperature)</h4>
                  <p className={`text-[12px] mt-0.5 ${sensors.temperature ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                    {sensors.temperature ? 'ESP32-Node-03 • เชื่อมต่อแล้ว' : 'รอการติดตั้ง'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => toggleSensor('temperature')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${sensors.temperature ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
              >
                {sensors.temperature ? 'ถอดออก' : 'ติดตั้ง'}
              </button>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">กำลังพัฒนาเนื้อหาส่วนนี้...</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#f8f9fa] w-full max-w-[900px] h-[600px] rounded-[24px] shadow-2xl flex overflow-hidden border border-gray-100">
        
        {/* Left Sidebar (Stepper / Nav) */}
        <div className="w-[240px] bg-white border-r border-gray-100 p-4 flex flex-col gap-6 shrink-0 h-full">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 px-3">ลำดับการเพิ่มพืช</h3>
            <div className="flex flex-col gap-1 relative">
              {/* Connector line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 -z-10"></div>
              
              <button 
                onClick={() => setActiveTab("add-plant-type")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                  activeTab === "add-plant-type" ? "bg-green-50 text-green-700 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${activeTab === "add-plant-type" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
                เลือกชนิดพืช
              </button>
              
              {!selectedItemId && (
                <button 
                  onClick={() => setActiveTab("add-bed")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                    (activeTab === "add-bed" || activeTab === "add-pot") ? "bg-green-50 text-green-700 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${(activeTab === "add-bed" || activeTab === "add-pot") ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
                  เลือกแปลง/กระถาง
                </button>
              )}

              <button 
                onClick={() => setActiveTab("add-sensor")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${
                  activeTab === "add-sensor" ? "bg-green-50 text-green-700 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${activeTab === "add-sensor" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>{selectedItemId ? "2" : "3"}</div>
                เชื่อมต่อเซนเซอร์
              </button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full">
              <Settings2 className="w-5 h-5 text-gray-400" />
              การตั้งค่าขั้นสูง
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white p-8 flex flex-col h-full relative">
          
          <button onClick={closeAddModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>

          {renderContent()}

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-6 px-8 flex justify-end gap-3 border-t border-gray-100/50">
            <button 
              onClick={closeAddModal}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleNextStep}
              className="px-8 py-2.5 rounded-xl bg-[#3b8045] hover:bg-[#2d6635] text-white text-[14px] font-bold shadow-md shadow-green-900/10 transition-colors flex items-center gap-2"
            >
              {activeTab === "add-sensor" ? "เสร็จสิ้นการเพิ่มพืช" : "ถัดไป"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

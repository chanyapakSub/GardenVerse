"use client";

import { Wind, Plus, ShieldCheck, Gift } from "lucide-react";
import { myPlants } from "@/lib/mockData";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { WeatherWidget } from "@/components/molecules/WeatherWidget";

export default function BottomPanel() {
  const { openAddModal } = useStore();
  const [temperature, setTemperature] = useState<number>(32);
  const [humidity, setHumidity] = useState<number>(60);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('https://gardenverse-a21d0-default-rtdb.asia-southeast1.firebasedatabase.app/readings.json?orderBy="$key"&limitToLast=1');
        const data = await response.json();
        if (data) {
          const key = Object.keys(data)[0];
          const latestReading = data[key];
          if (latestReading) {
            setTemperature(latestReading.temperature);
            setHumidity(latestReading.humidity);
          }
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 h-[140px] shrink-0">
      
      {/* Weather Card */}
      <WeatherWidget temperature={temperature} humidity={humidity} />

      {/* Plants Scroll List */}
      <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-[14px] font-bold text-gray-800 mb-3">พืชในสวนของคุณ (12)</h3>
        
        <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-1 items-center">
          {myPlants.map((plant) => (
            <div 
              key={plant.id} 
              className={`flex flex-col items-center gap-2 min-w-[70px] shrink-0 ${
                plant.active ? "bg-green-50/50 p-2 -m-2 rounded-xl border border-green-200" : ""
              }`}
            >
              <div className="w-14 h-14 relative rounded-full overflow-hidden shadow-sm border border-gray-100 bg-white">
                <Image 
                  src={plant.img} 
                  alt={plant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className={`text-[12px] font-medium ${plant.active ? "text-green-700" : "text-gray-600"}`}>
                {plant.name}
              </span>
            </div>
          ))}
          
          <button 
            onClick={openAddModal}
            className="flex flex-col items-center justify-center gap-2 min-w-[70px] shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[12px] font-medium text-gray-500">เพิ่มพืช</span>
          </button>
        </div>
      </div>

      {/* Daily Tasks */}
      <div className="w-[300px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 shrink-0 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[14px] font-bold text-gray-800">ภารกิจประจำวัน</h3>
          <a href="#" className="text-xs text-green-600 font-medium">ดูทั้งหมด</a>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 text-orange-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <span className="text-[13px] font-bold text-gray-800">รดน้ำพืช 5 ต้น</span>
              <div className="w-full bg-gray-100 rounded-full h-2 relative overflow-hidden">
                <div className="bg-green-500 h-full absolute left-0 top-0 w-3/5 rounded-full"></div>
              </div>
            </div>
            <span className="text-[12px] font-semibold text-gray-500 mt-5">3/5</span>
          </div>

          <div className="flex items-center justify-between mt-auto bg-gray-50 px-3 py-2 rounded-xl">
            <span className="text-[11px] font-medium text-gray-500">รางวัล</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[12px] font-bold text-gray-700">
                <div className="w-4 h-4 rounded-full bg-yellow-400 text-white flex items-center justify-center text-[8px]">C</div>
                50
              </div>
              <div className="flex items-center gap-1 text-[12px] font-bold text-gray-700">
                <div className="w-4 h-4 rounded-full bg-blue-400 text-white flex items-center justify-center text-[8px]">D</div>
                10
              </div>
              <Gift className="w-4 h-4 text-green-500" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

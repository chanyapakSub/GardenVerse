"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { zones } from "@/lib/mockData";
import { useState } from "react";

interface SidebarProps {
  onPlantClick?: (plantId: string) => void;
  selectedPlantId?: string | null;
}

export default function Sidebar({ onPlantClick, selectedPlantId }: SidebarProps) {
  const [activeZone, setActiveZone] = useState<string[]>(zones.map(z => z.id));

  const toggleZone = (id: string) => {
    setActiveZone(prev => 
      prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-2xl h-full shadow-sm border border-gray-100 p-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
        <h2 className="font-semibold text-gray-800 text-[15px]">โซนในโรงเรือน</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {zones.map((zone) => {
          const isOpen = activeZone.includes(zone.id);
          return (
            <div key={zone.id} className="flex flex-col">
              <button 
                onClick={() => toggleZone(zone.id)}
                className="flex items-center justify-between w-full py-2.5 px-2 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 flex justify-center text-green-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.1738 5.9 16.1738C5.9 16.1738 7 8 16 5C17 4.66667 19.5 4 19.5 4C19.5 4 20 6.5 17 8Z"/></svg>
                  </div>
                  <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900">{zone.name}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isOpen && (
                <div className="flex flex-col gap-1 mt-1 mb-2">
                  {zone.plants.map((plant) => {
                    const isSelected = selectedPlantId === plant.id;
                    return (
                      <div 
                        key={plant.id}
                        onClick={() => onPlantClick?.(plant.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ml-4 cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-green-50/80 text-green-700 font-medium"
                            : plant.active && !selectedPlantId
                              ? "bg-green-50/80 text-green-700 font-medium" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          isSelected ? "bg-green-500" : plant.active && !selectedPlantId ? "bg-green-500" : plant.color.replace('text-', 'bg-')
                        }`} />
                        <span className="text-[14px]">{plant.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

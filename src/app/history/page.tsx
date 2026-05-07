"use client";

import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";
import CareHistoryContent from "@/components/organisms/CareHistoryContent";

export default function HistoryPage() {
  const [selectedPlantId, setSelectedPlantId] = useState<string>("p1");

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar />
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4">
        <div className="flex gap-4 h-full">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0">
            <Sidebar
              onPlantClick={(id) => setSelectedPlantId(id)}
              selectedPlantId={selectedPlantId}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <CareHistoryContent selectedPlantId={selectedPlantId} />
          </div>
        </div>
      </main>
    </div>
  );
}

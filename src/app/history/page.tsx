"use client";

import Navbar from "@/components/organisms/Navbar";
import CareHistoryContent from "@/components/organisms/CareHistoryContent";

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar />
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4">
        <CareHistoryContent />
      </main>
    </div>
  );
}

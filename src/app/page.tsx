import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";
import PlantDetailPanel from "@/components/organisms/PlantDetailPanel";
import BottomPanel from "@/components/organisms/BottomPanel";
import Garden3D from "@/components/organisms/Garden3D";
import AddModal from "@/components/organisms/AddModal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6]">
      <Navbar />
      
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 flex flex-col gap-4">
        <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[500px]">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
            <Garden3D />
            
            {/* Wooden Sign Overlay */}
            <div className="absolute bottom-10 left-10">
              <div className="bg-[#6b4c3a] text-white px-8 py-4 rounded-xl shadow-lg border-2 border-[#523828] flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 12 17 8 17 4"/><path d="M17 4C17 4 20 6 20 10 20 12.5 17 14 17 14"/><path d="M12 12C12 12 7 8 7 4"/><path d="M7 4C7 4 4 6 4 10 4 12.5 7 14 7 14"/></svg>
                <span className="text-xl font-medium">แปลงทิวลิป</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[340px] shrink-0">
            <PlantDetailPanel />
          </div>
        </div>

        {/* Bottom Area */}
        <BottomPanel />
      </main>

      {/* Modals */}
      <AddModal />
    </div>
  );
}

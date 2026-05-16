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
        <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[500px]">
          {/* Left Sidebar */}
          <div className="w-[280px] shrink-0">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white rounded-2xl overflow-hidden relative shadow-sm border border-gray-100">
            <Garden3D />
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

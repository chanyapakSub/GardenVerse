import Navbar from "@/components/organisms/Navbar";
import Sidebar from "@/components/organisms/Sidebar";
import { WeatherWidget } from "@/components/molecules/WeatherWidget";
import Image from "next/image";
import { Search, Plus, MoreVertical, Droplet, ChevronDown, ChevronLeft, ChevronRight, Download, MoveRight, Save, Lightbulb, Leaf, Activity, AlertTriangle } from "lucide-react";

export default function PlantsPage() {
  const plants = [
    {
      id: 1,
      name: "ทิวลิป",
      sciName: "Tulipa spp.",
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "45 วัน",
      planted: "1 มี.ค. 2567",
      water: "86%",
      image: "/images/flower/Tilip.png"
    },
    {
      id: 2,
      name: "กุหลาบ",
      sciName: "Rosa spp.",
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "120 วัน",
      planted: "15 ธ.ค. 2566",
      water: "78%",
      image: "/images/flower/Rose.png"
    },
    {
      id: 3,
      name: "ลาเวนเดอร์",
      sciName: "Lavandula spp.",
      status: "ปานกลาง",
      statusColor: "bg-blue-50 text-blue-600 border-blue-200",
      age: "90 วัน",
      planted: "10 ก.พ. 2567",
      water: "62%",
      image: "/images/flower/Lavender.png"
    },
    {
      id: 4,
      name: "เบญจมาศ",
      sciName: "Chrysanthemum",
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "60 วัน",
      planted: "25 ก.พ. 2567",
      water: "84%",
      image: "/images/flower/Tantawan.png"
    },
    {
      id: 5,
      name: "โหระพา",
      sciName: "Ocimum basilicum",
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "30 วัน",
      planted: "20 มี.ค. 2567",
      water: "91%",
      image: "/images/flower/Forget-me-not.png"
    },
    {
      id: 6,
      name: "โรสแมรี่",
      sciName: "Rosmarinus officinalis",
      status: "เฝ้าระวัง",
      statusColor: "bg-orange-50 text-orange-600 border-orange-200",
      age: "75 วัน",
      planted: "5 ก.พ. 2567",
      water: "58%",
      image: "/images/flower/Haidenyia.png"
    },
    {
      id: 7,
      name: "มิ้นท์",
      sciName: "Mentha spp.",
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "40 วัน",
      planted: "15 มี.ค. 2567",
      water: "88%",
      image: "/images/flower/Lavender.png"
    },
    {
      id: 8,
      name: "มะเขือเทศ",
      sciName: "Solanum lycopersicum",
      status: "สุขภาพดี",
      statusColor: "bg-green-50 text-green-600 border-green-200",
      age: "50 วัน",
      planted: "5 มี.ค. 2567",
      water: "80%",
      image: "/images/vegetable/Tomato.png"
    }
  ];

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
        <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col p-6 overflow-y-auto custom-scrollbar">
          
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
            <button className="flex items-center gap-2 bg-white border border-green-200 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
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
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 min-w-[130px] hover:bg-gray-50">
              <div className="flex items-center gap-1.5"><ArrowUpDownIcon className="w-3.5 h-3.5" /> จัดเรียง</div> <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="text-sm text-gray-500 mb-4 font-medium">ทั้งหมด 12 ชนิด • 86 ต้น</div>

          {/* Plant Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {plants.map((plant) => (
              <div key={plant.id} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-green-200 hover:shadow-md transition-all group flex flex-col">
                <div className="relative h-32 w-full mb-3 flex items-center justify-center">
                  <Image src={plant.image} alt={plant.name} width={100} height={100} className="object-contain group-hover:scale-110 transition-transform duration-300" />
                  <button className="absolute top-0 right-0 text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Leaf className="w-3.5 h-3.5 text-green-600" />
                  <h3 className="font-bold text-gray-800 text-sm">{plant.name}</h3>
                </div>
                <p className="text-xs text-gray-400 italic mb-3">{plant.sciName}</p>
                
                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit border ${plant.statusColor} mb-4`}>
                  {plant.status}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-4">
                  <div>
                    <div className="text-gray-400 mb-0.5">อายุ</div>
                    <div className="text-gray-700 font-medium">{plant.age}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-0.5">ปลูกเมื่อ</div>
                    <div className="text-gray-700 font-medium">{plant.planted}</div>
                  </div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                    <Leaf className="w-3 h-3" /> {plant.water}
                  </div>
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-auto">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 text-white font-medium text-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          
          {/* ภาพรวมพืช */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm mb-4">ภาพรวมพืช</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-gray-100">
                <Leaf className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-lg font-bold text-gray-800">12</span>
                <span className="text-[11px] text-gray-500 font-medium">ชนิดพืช</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-gray-100">
                <div className="flex mb-1 relative">
                  <Leaf className="w-4 h-4 text-green-500 absolute -left-2" />
                  <Leaf className="w-5 h-5 text-green-600" />
                  <Leaf className="w-4 h-4 text-green-500 absolute -right-2" />
                </div>
                <span className="text-lg font-bold text-gray-800 mt-1">86</span>
                <span className="text-[11px] text-gray-500 font-medium">ต้นทั้งหมด</span>
              </div>
              <div className="bg-green-50/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-green-100">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mb-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-lg font-bold text-gray-800">72</span>
                <span className="text-[11px] text-gray-500 font-medium">สุขภาพดี</span>
              </div>
              <div className="bg-orange-50/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 border border-orange-100">
                <AlertTriangle className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-lg font-bold text-gray-800">14</span>
                <span className="text-[11px] text-gray-500 font-medium">เฝ้าระวัง</span>
              </div>
            </div>
          </div>

          {/* การกระจายตามประเภท */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm mb-4">การกระจายตามประเภท</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 relative shrink-0">
                {/* Simplified Donut Chart via SVG */}
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Background Circle */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="6"></circle>
                  {/* Segment 1: ไม้ดอก (50%) - Green */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="50 50" strokeDashoffset="0"></circle>
                  {/* Segment 2: ผักสวนครัว (25%) - Yellow */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#fbbf24" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-50"></circle>
                  {/* Segment 3: สมุนไพร (25%) - Blue */}
                  <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-75"></circle>
                  {/* Inner white circle for donut effect */}
                  <circle cx="18" cy="18" r="11" fill="#ffffff"></circle>
                </svg>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">ไม้ดอก</span>
                    <span className="text-[10px] text-gray-500">6 ชนิด (50%)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">สมุนไพร</span>
                    <span className="text-[10px] text-gray-500">3 ชนิด (25%)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700">ผักสวนครัว</span>
                    <span className="text-[10px] text-gray-500">3 ชนิด (25%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* การดำเนินการด่วน */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm mb-3">การดำเนินการด่วน</h3>
            <div className="flex flex-col gap-1">
              <button className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group text-sm text-gray-700">
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
              <button className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="text-green-600"><Save className="w-4 h-4" /></div>
                  <span className="font-medium group-hover:text-green-700">บันทึกข้อมูลพืช</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </button>
              <button className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors group text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <div className="text-green-600"><Download className="w-4 h-4" /></div>
                  <span className="font-medium group-hover:text-green-700">ดาวน์โหลดรายงาน</span>
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
    </div>
  );
}

// ArrowUpDownIcon
function ArrowUpDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  )
}

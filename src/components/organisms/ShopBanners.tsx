"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function ShopBanners({ onAddStarterPack }: { onAddStarterPack?: () => void }) {
  const copyCode = () => {
    navigator.clipboard.writeText("GARDEN10");
    alert("คัดลอกโค้ด GARDEN10 เรียบร้อยแล้ว! สามารถนำไปใช้ในหน้าชำระเงินได้เลย");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Banner 1: Free Shipping */}
      <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden border border-green-100 h-28">
        <div className="z-10 w-1/2">
          <h3 className="text-green-800 font-bold text-lg leading-tight mb-1">ส่งฟรีทั่วประเทศ</h3>
          <p className="text-green-600 text-xs mb-3">เมื่อสั่งซื้อครบ 500 บาท</p>
          <button
            onClick={() => alert("ระบบกำลังรวบรวมสินค้าที่ร่วมรายการส่งฟรี...")}
            className="bg-white border border-green-200 text-green-700 text-xs font-medium px-3 py-1 rounded-md hover:bg-green-100 transition-colors"
          >
            ช้อปเลย
          </button>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] w-28 h-28">
          <div className="w-full h-full bg-green-200/50 rounded-full flex items-center justify-center">
            <span className="text-4xl">🚚</span>
          </div>
        </div>
      </div>

      {/* Banner 2: 10% Discount */}
      <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden border border-amber-100 h-28">
        <div className="z-10">
          <h3 className="text-amber-900 font-bold text-lg leading-tight mb-1">ลด 10%</h3>
          <p className="text-amber-700 text-xs mb-3">  </p>
          <button
            onClick={copyCode}
            className="bg-white border border-amber-200 text-amber-800 text-[10px] font-medium px-2 py-0.5 rounded-md inline-block hover:bg-amber-100 transition-colors cursor-pointer"
          >
            ใช้โค้ด: GARDEN10
          </button>
        </div>
        <div className="absolute right-2 bottom-2 w-16 h-16 transform rotate-[-15deg]">
          <div className="w-full h-full bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            %
          </div>
        </div>
      </div>

      {/* Banner 3: Starter Pack */}
      <div
        onClick={() => {
          if (onAddStarterPack) {
            onAddStarterPack();
          } else {
            alert("กำลังเปิดรายละเอียด แพ็กเกจเริ่มต้นมือใหม่");
          }
        }}
        className="bg-blue-50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden border border-blue-100 h-28 group cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="z-10 w-2/3">
          <h3 className="text-blue-900 font-bold text-md leading-tight mb-1">แพ็กเกจเริ่มต้นมือใหม่</h3>
          <p className="text-blue-700 text-[11px] mb-2">ชุดปลูกครบ จบในกล่องเดียว</p>
          <p className="text-blue-800 font-medium text-xs">เริ่มต้นเพียง 399 บาท</p>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] w-28 h-28">
          <Image
            src="/images/products/แพ็กเกจเริ่มต้นมือใหม่.png"
            alt="Starter Pack"
            fill
            className="object-contain p-3 drop-shadow-md"
          />
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}

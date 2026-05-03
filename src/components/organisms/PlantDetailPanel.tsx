"use client";

import { Pencil, Settings, Clock, List, Sun, Droplets, Thermometer, Box, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PlantDetailPanel() {
  return (
    <div className="bg-white rounded-2xl h-full shadow-sm border border-gray-100 p-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar relative">
      
      {/* Header Info */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-red-500">🌷</span>
            <h2 className="text-[22px] font-bold text-gray-800">ทิวลิป</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 italic">Tulipa spp.</p>
          
          <div className="mt-3 flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold text-green-700">สุขภาพดี 85%</span>
          </div>

          <div className="mt-3 flex flex-col gap-1 text-[13px] text-gray-600">
            <p>อายุ 45 วัน</p>
            <p>ปลูกเมื่อ 1 มี.ค. 2567</p>
          </div>
        </div>

        {/* Plant Image */}
        <div className="w-24 h-28 relative rounded-xl overflow-hidden shrink-0">
          <Image 
            src="https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300&h=400&fit=crop"
            alt="Tulip"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full border-b border-gray-100 mt-2">
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 border-b-2 border-green-600 text-green-600">
          <Box className="w-5 h-5" />
          <span className="text-xs font-semibold">ข้อมูล</span>
        </button>
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">การดูแล</span>
        </button>
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <Clock className="w-5 h-5" />
          <span className="text-xs font-medium">บันทึก</span>
        </button>
        <button className="flex-1 pb-2 flex flex-col items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <List className="w-5 h-5" />
          <span className="text-xs font-medium">ประวัติ</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-[14px] font-bold text-gray-800 mb-1">เกี่ยวกับพืช</h3>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            ทิวลิปเป็นไม้ดอกหัวฤดูหนาวที่นิยมปลูกในโรงเรือน
            ต้องการแสงแดดเพียงพอ อากาศเย็น และดินระบายน้ำดี
          </p>
        </div>

        <div>
          <h3 className="text-[14px] font-bold text-gray-800 mb-3">ความต้องการ</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center text-center gap-1">
              <Sun className="w-6 h-6 text-yellow-500" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">แสงแดด</span>
              <span className="text-[11px] text-gray-800 font-medium">6-8 ชม./วัน</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Droplets className="w-6 h-6 text-blue-500" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">น้ำ</span>
              <span className="text-[11px] text-gray-800 font-medium">ปานกลาง</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Thermometer className="w-6 h-6 text-red-400" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">อุณหภูมิ</span>
              <span className="text-[11px] text-gray-800 font-medium">15-20 °C</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Box className="w-6 h-6 text-amber-700" />
              <span className="text-[11px] text-gray-500 font-medium mt-1">ดิน</span>
              <span className="text-[11px] text-gray-800 font-medium">ร่วนซุย</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-4 flex flex-col gap-2">
        <button className="w-full bg-[#3b8045] hover:bg-[#2d6635] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md shadow-green-900/10 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22V12"/><path d="M12 12C12 12 17 8 17 4"/><path d="M17 4C17 4 20 6 20 10 20 12.5 17 14 17 14"/><path d="M12 12C12 12 7 8 7 4"/><path d="M7 4C7 4 4 6 4 10 4 12.5 7 14 7 14"/></svg>
          ดูแลตอนนี้
          <ChevronDown className="w-4 h-4" />
        </button>
        <Link
          href="/history"
          className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <Clock className="w-4 h-4 text-gray-400" />
          ดูประวัติการดูแล
        </Link>
      </div>

    </div>
  );
}

"use client";

import { Bell, Droplet, Coins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* Left section: Logo */}
      <div className="flex items-center gap-2 w-[240px]">
        <div className="flex items-center justify-center">
          <Image
            src="/images/logo_main.png"
            alt="GardenVerse Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="font-bold text-gray-800 leading-tight">GardenVerse</h1>
          <p className="text-[10px] text-gray-500 font-medium">Grow with happiness</p>
        </div>
      </div>

      {/* Middle section: Links */}
      <div className="flex items-center gap-8 text-[15px] font-medium h-full">
        <Link href="/home" className={`h-[52px] flex items-center border-b-2 transition-colors ${pathname === "/home" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent hover:text-green-600"}`}>สวนของฉัน</Link>
        <Link href="#" className={`h-[52px] flex items-center border-b-2 transition-colors ${pathname === "/plants" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent hover:text-green-600"}`}>พืชของฉัน</Link>
        <Link href="/history" className={`h-[52px] flex items-center border-b-2 transition-colors ${pathname === "/history" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent hover:text-green-600"}`}>ประวัติการดูแล</Link>
        <Link href="/shop" className={`h-[52px] flex items-center border-b-2 transition-colors ${pathname === "/shop" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent hover:text-green-600"}`}>ร้านค้า</Link>
      </div>

      {/* Right section: Stats & Profile */}
      <div className="flex items-center gap-4 w-[240px] justify-end">
        {/* Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
            <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">12,450</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <Droplet className="w-4 h-4 text-blue-500 fill-blue-500" />
            <span className="text-sm font-semibold text-gray-700">120</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          <span className="absolute top-0 right-0 -mr-1 -mt-1 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer relative">
          <div className="w-9 h-9 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm">
            <Image
              src="/images/profile.png"
              alt="User"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded absolute -bottom-1 -right-2 border border-white">Lv.25</span>
        </div>
      </div>
    </nav>
  );
}

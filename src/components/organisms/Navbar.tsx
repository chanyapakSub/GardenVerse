"use client";

import { Bell, Droplet, Coins, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SettingsModal from "./SettingsModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("นักปลูกต้นไม้");
  const [profileImage, setProfileImage] = useState("/images/profile.png");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("current_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.username) setUsername(user.username);
        if (user.profileImage) setProfileImage(user.profileImage);
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    // Load and apply theme
    const savedTheme = localStorage.getItem("gardenverse_theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleLogout = () => {
    // Clear the simulated auth cookie and user info
    document.cookie = "is_authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("current_user");
    router.push("/login");
  };

  const handleSaveSettings = (newUsername: string, newImage: string, theme: string) => {
    setUsername(newUsername);
    setProfileImage(newImage);
    const userStr = localStorage.getItem("current_user");
    let user = userStr ? JSON.parse(userStr) : {};
    user.username = newUsername;
    user.profileImage = newImage;
    localStorage.setItem("current_user", JSON.stringify(user));
  };

  return (
    <>
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
          <Link href="/plants" className={`h-[52px] flex items-center border-b-2 transition-colors ${pathname === "/plants" ? "text-green-600 border-green-600" : "text-gray-500 border-transparent hover:text-green-600"}`}>พืชของฉัน</Link>
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
          <div className="flex items-center gap-2 cursor-pointer relative group">
            <div className="w-9 h-9 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm relative">
              <Image
                src={profileImage}
                alt="User"
                fill
                className="object-cover"
              />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-52 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <span className="text-[11px] text-gray-500 block uppercase tracking-wider font-semibold mb-0.5">บัญชีผู้ใช้</span>
                <span className="text-[14px] font-bold text-gray-800 truncate block">{username}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(true); }}
                className="flex items-center gap-2 px-4 py-3 text-[14px] font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 w-full transition-colors"
              >
                <Settings className="w-[18px] h-[18px]" /> ตั้งค่าโปรไฟล์และธีม
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                className="flex items-center gap-2 px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut className="w-[18px] h-[18px]" /> ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUsername={username}
        currentImage={profileImage}
        onSave={handleSaveSettings}
      />
    </>
  );
}

"use client";

import { Bell, Droplet, Coins, LogOut, Settings, Lightbulb, Droplets, Leaf, X, CheckCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SettingsModal from "./SettingsModal";
import { supabase } from "@/lib/supabase";

// ===== ข้อมูลการแจ้งเตือน =====
const INITIAL_ALERTS = [
  {
    id: 1,
    icon: Lightbulb,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    ringColor: "ring-yellow-200",
    title: "อุณหภูมิเพิ่มสูงขึ้น",
    desc: "อุณหภูมิวันนี้สูงกว่าค่าเฉลี่ยเล็กน้อย แนะนำให้เพิ่มการระบายอากาศ",
    time: "09:30",
    read: false,
  },
  {
    id: 2,
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    ringColor: "ring-blue-200",
    title: "ความชื้นอากาศต่ำกว่าปกติ",
    desc: "ความชื้นอากาศเหลือ 35% แนะนำให้เพิ่มการพ่นหมอก",
    time: "เมื่อวาน 17:00",
    read: false,
  },
  {
    id: 3,
    icon: Leaf,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    ringColor: "ring-green-200",
    title: "พืชกำลังเจริญเติบโตดี",
    desc: "สุขภาพพืชดีขึ้น 5% จากสัปดาห์ที่ผ่านมา",
    time: "2 พ.ค. 2567",
    read: false,
  },
];

// ===== Notification Bell Component =====
function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = alerts.filter((a) => !a.read).length;

  // ปิด dropdown เมื่อคลิกนอก
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const markOneRead = (id: number) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen((v) => !v)}
        className={`relative p-2 rounded-xl transition-all ${
          isOpen ? "bg-green-50 text-green-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
              {unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100]"
          style={{ animation: "notifSlideIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="font-bold text-gray-800 text-sm">การแจ้งเตือน</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 font-semibold">
                  {unreadCount} ใหม่
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] text-green-600 hover:text-green-700 font-semibold px-2 py-1 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  อ่านทั้งหมด
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alert List */}
          <div className="flex flex-col max-h-72 overflow-y-auto">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <button
                  key={alert.id}
                  onClick={() => markOneRead(alert.id)}
                  className={`flex gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 last:border-0 w-full ${
                    alert.read ? "bg-white hover:bg-gray-50" : "bg-blue-50/30 hover:bg-blue-50/60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full ${alert.iconBg} ring-1 ${alert.ringColor} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon className={`w-4 h-4 ${alert.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm font-semibold leading-tight ${alert.read ? "text-gray-600" : "text-gray-900"}`}>
                        {alert.title}
                      </span>
                      {!alert.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{alert.desc}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{alert.time}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/40">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs font-semibold text-green-600 hover:text-green-700 transition-colors py-1 hover:underline"
            >
              ดูการแจ้งเตือนทั้งหมด →
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

// ===== Main Navbar =====
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("นักปลูกต้นไม้");
  const [profileImage, setProfileImage] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Garden");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // โหลด username จาก Supabase session + profiles table
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();
        if (profile?.username) setUsername(profile.username);
      }
    };
    loadUser();

    // theme ยังคง localStorage เพราะเป็นแค่ UI preference
    const savedTheme = localStorage.getItem("gardenverse_theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("current_user");
    document.cookie = "is_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    router.push("/login");
  };

  const handleSaveSettings = (newUsername: string, newImage: string, theme: string) => {
    setUsername(newUsername);
    setProfileImage(newImage);
    // profileImage เก็บใน localStorage ไว้ก่อน (UI preference)
    localStorage.setItem("gardenverse_profileImage", newImage);
  };

  return (
    <>
      <nav className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-50">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 w-[240px]">
          <div className="flex items-center justify-center">
            <Image src="/images/logo_main.png" alt="GardenVerse Logo" width={48} height={48} className="object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">GardenVerse</h1>
            <p className="text-[10px] text-gray-500 font-medium">Grow with happiness</p>
          </div>
        </div>

        {/* Middle: Nav Links */}
        <div className="flex items-center gap-8 text-[15px] font-medium h-full">
          {[
            { href: "/home",          label: "สวนของฉัน" },
            { href: "/plants",        label: "พืชของฉัน" },
            { href: "/history",       label: "ประวัติการดูแล" },
            { href: "/disease-detect",label: "AI ตรวจโรคพืช" },
            { href: "/shop",          label: "ร้านค้า" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`h-[52px] flex items-center border-b-2 transition-colors ${
                pathname === href
                  ? "text-green-600 border-green-600"
                  : "text-gray-500 border-transparent hover:text-green-600"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Stats & Profile */}
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

          {/* Notification Bell */}
          <NotificationBell />

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2 cursor-pointer relative group">
            <div className="w-9 h-9 rounded-full bg-indigo-100 overflow-hidden border-2 border-white shadow-sm relative">
              <Image src={profileImage} alt="User" fill className="object-cover" />
            </div>
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

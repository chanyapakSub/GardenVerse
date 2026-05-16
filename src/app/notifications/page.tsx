"use client";

import { useState } from "react";
import { Bell, Lightbulb, Droplets, Leaf, CheckCheck, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/organisms/Navbar";

const ALL_ALERTS = [
  {
    id: 1,
    icon: Lightbulb,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    ringColor: "ring-yellow-200",
    category: "สภาพแวดล้อม",
    categoryColor: "text-yellow-600 bg-yellow-50",
    title: "อุณหภูมิเพิ่มสูงขึ้น",
    desc: "อุณหภูมิวันนี้สูงกว่าค่าเฉลี่ยเล็กน้อย แนะนำให้เพิ่มการระบายอากาศในโรงเรือน และตรวจสอบระบบระบายความร้อน",
    time: "วันนี้ 09:30",
    read: false,
  },
  {
    id: 2,
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    ringColor: "ring-blue-200",
    category: "ความชื้น",
    categoryColor: "text-blue-600 bg-blue-50",
    title: "ความชื้นอากาศต่ำกว่าปกติ",
    desc: "ความชื้นอากาศเหลือ 35% ซึ่งต่ำกว่าค่าเหมาะสม (50–70%) แนะนำให้เพิ่มการพ่นหมอกหรือใช้เครื่องเพิ่มความชื้น",
    time: "เมื่อวาน 17:00",
    read: false,
  },
  {
    id: 3,
    icon: Leaf,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    ringColor: "ring-green-200",
    category: "สุขภาพพืช",
    categoryColor: "text-green-700 bg-green-50",
    title: "พืชกำลังเจริญเติบโตดี",
    desc: "สุขภาพพืชดีขึ้น 5% จากสัปดาห์ที่ผ่านมา พืชทุกต้นอยู่ในสภาวะปกติ ระดับคะแนนสุขภาพเฉลี่ย 87/100",
    time: "2 พ.ค. 2567",
    read: true,
  },
];

type FilterTab = "all" | "unread" | "read";

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState(ALL_ALERTS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const unreadCount = alerts.filter((a) => !a.read).length;

  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  const markOneRead = (id: number) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  const deleteOne = (id: number) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const filtered = alerts.filter((a) => {
    if (activeTab === "unread") return !a.read;
    if (activeTab === "read") return a.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/home"
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">การแจ้งเตือน</h1>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-bold">
                  {unreadCount} ใหม่
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">การแจ้งเตือนและคำแนะนำทั้งหมดของสวน</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              อ่านทั้งหมด
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-4">
          {([
            { key: "all",    label: "ทั้งหมด", count: alerts.length },
            { key: "unread", label: "ยังไม่อ่าน", count: alerts.filter((a) => !a.read).length },
            { key: "read",   label: "อ่านแล้ว",  count: alerts.filter((a) => a.read).length },
          ] as { key: FilterTab; label: string; count: number }[]).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === key
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label}
              <span
                className={`text-[11px] rounded-full px-1.5 py-0.5 font-bold ${
                  activeTab === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Alert Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">ไม่มีการแจ้งเตือน</p>
            <p className="text-gray-400 text-sm mt-1">ทุกอย่างเรียบร้อยดี 🌿</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  onClick={() => markOneRead(alert.id)}
                  className={`group flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    alert.read
                      ? "bg-white border-gray-100 hover:border-gray-200"
                      : "bg-white border-blue-100 hover:border-blue-200 shadow-sm"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-2xl ${alert.iconBg} ring-1 ${alert.ringColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${alert.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${alert.categoryColor}`}
                        >
                          {alert.category}
                        </span>
                        <p className={`text-sm font-bold leading-tight ${alert.read ? "text-gray-700" : "text-gray-900"}`}>
                          {alert.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!alert.read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-1" />}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteOne(alert.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{alert.desc}</p>
                    <span className="text-[11px] text-gray-400 mt-2 block">{alert.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

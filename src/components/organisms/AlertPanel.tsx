"use client";

import { Lightbulb, Droplets, Leaf } from "lucide-react";

const alerts = [
  {
    icon: Lightbulb,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    title: "อุณหภูมิเพิ่มสูงขึ้น",
    desc: "อุณหภูมิวันนี้สูงกว่าค่าเฉลี่ยเล็กน้อย แนะนำให้เพิ่มการระบายอากาศ",
    time: "09:30",
    timeColor: "text-gray-400",
  },
  {
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    title: "ความชื้นดินต่ำกว่าปกติ",
    desc: "ความชื้นดินเหลือ 35% แนะนำให้รดน้ำเพิ่ม",
    time: "เมื่อวาน 17:00",
    timeColor: "text-gray-400",
  },
  {
    icon: Leaf,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    title: "พืชกำลังเจริญเติบโตดี",
    desc: "สุขภาพพืชดีขึ้น 5% จากสัปดาห์ที่ผ่านมา",
    time: "2 พ.ค. 2567",
    timeColor: "text-green-500",
  },
];

export default function AlertPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-gray-800">การแจ้งเตือนและคำแนะนำ</h3>
        <button className="text-xs font-semibold text-green-600 hover:underline">ดูทั้งหมด</button>
      </div>

      <div className="flex flex-col gap-3">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50/60 border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className={`w-9 h-9 rounded-full ${alert.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${alert.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-sm font-bold text-gray-800 leading-tight">{alert.title}</span>
                  <span className={`text-[10px] ${alert.timeColor} shrink-0 mt-0.5`}>{alert.time}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{alert.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          ดูคำแนะนำทั้งหมด
        </button>
      </div>
    </div>
  );
}

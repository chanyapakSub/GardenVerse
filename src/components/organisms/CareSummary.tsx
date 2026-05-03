"use client";

import { Droplets, Leaf, ClipboardList, BookOpen, ChevronRight, TrendingUp } from "lucide-react";

const summaryItems = [
  {
    icon: Droplets,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    label: "รดน้ำ",
    count: "5 ครั้ง",
    status: "มากกว่าปกติ",
    statusColor: "text-orange-500",
    trending: true,
  },
  {
    icon: Leaf,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    label: "ให้ปุ๋ย",
    count: "1 ครั้ง",
    status: "ตามแผน",
    statusColor: "text-green-600",
    trending: false,
  },
  {
    icon: ClipboardList,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    label: "กิจกรรม",
    count: "3 รายการ",
    status: "ดูเพิ่มเติม",
    statusColor: "text-gray-400",
    hasChevron: true,
  },
  {
    icon: BookOpen,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    label: "บันทึก",
    count: "2 รายการ",
    status: "ดูเพิ่มเติม",
    statusColor: "text-gray-400",
    hasChevron: true,
  },
];

export default function CareSummary() {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-800 mb-4">สรุปการดูแล</h3>
      <div className="flex flex-col gap-3">
        {summaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1">{item.label}</span>
              <span className="text-sm font-bold text-gray-800">{item.count}</span>
              <span className={`text-xs font-semibold ${item.statusColor} flex items-center gap-0.5`}>
                {item.trending && <TrendingUp className="w-3 h-3" />}
                {item.status}
                {item.hasChevron && <ChevronRight className="w-3 h-3" />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

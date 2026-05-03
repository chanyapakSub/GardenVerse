"use client";

import { Droplets, Leaf, ClipboardList, BookOpen } from "lucide-react";

const records = [
  {
    date: "7 พ.ค. 2567",
    time: "08:30",
    type: "รดน้ำ",
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    detail: "รดน้ำอัตโนมัติ 15 นาที",
    by: "ระบบอัตโนมัติ",
  },
  {
    date: "6 พ.ค. 2567",
    time: "09:15",
    type: "ให้ปุ๋ย",
    icon: Leaf,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    detail: "ปุ๋ยละลายน้ำ NPK 20-20-20 อัตรา 1 กรัม/ลิตร",
    by: "คุณแนน",
  },
  {
    date: "5 พ.ค. 2567",
    time: "17:20",
    type: "ตรวจแปลง",
    icon: ClipboardList,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-50",
    detail: "ตรวจใบและตอก ไม่พบโรค/แมลง",
    by: "คุณแนน",
  },
  {
    date: "4 พ.ค. 2567",
    time: "08:30",
    type: "รดน้ำ",
    icon: Droplets,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    detail: "รดน้ำอัตโนมัติ 15 นาที",
    by: "ระบบอัตโนมัติ",
  },
  {
    date: "3 พ.ค. 2567",
    time: "14:45",
    type: "บันทึก",
    icon: BookOpen,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    detail: "เริ่มเห็นตาดอกเพิ่มขึ้นประมาณ 20%",
    by: "คุณแนน",
  },
];

export default function CareTable() {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-800 mb-4">ประวัติการดูแลล่าสุด</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 font-semibold border-b border-gray-100">
            <th className="text-left pb-2 pr-4">วันที่ / เวลา</th>
            <th className="text-left pb-2 pr-4">รายการ</th>
            <th className="text-left pb-2 pr-4">รายละเอียด</th>
            <th className="text-left pb-2">โดย</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => {
            const Icon = r.icon;
            return (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="font-medium text-gray-700">{r.date}</div>
                  <div className="text-xs text-gray-400">{r.time}</div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full ${r.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${r.iconColor}`} />
                    </div>
                    <span className="font-semibold text-gray-700">{r.type}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-600 text-xs max-w-[200px]">{r.detail}</td>
                <td className="py-3 text-xs text-gray-500">{r.by}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        <button className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          ดูประวัติทั้งหมด
        </button>
      </div>
    </div>
  );
}

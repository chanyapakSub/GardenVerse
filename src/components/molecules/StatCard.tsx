import { MiniSparkline } from "@/components/atoms/MiniSparkline";

function getBadgeColor(badge: string): string {
  if (["เหมาะสม", "ดีมาก", "ดี"].includes(badge)) return "bg-green-100 text-green-700";
  if (["ปกติ"].includes(badge)) return "bg-blue-100 text-blue-700";
  if (["สูง", "ต่ำ"].includes(badge)) return "bg-yellow-100 text-yellow-700";
  if (["แย่", "วิกฤต"].includes(badge)) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
}

export interface StatCardProps {
  id: string;
  label: string;
  value: string;
  unit: string;
  badge: string;
  badgeColor?: string;
  color: string;
  icon: string;
  subLabel?: string;
  trend: number[];
  lineColor: string;
}

export function StatCard({ card }: { card: StatCardProps }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <span>{card.icon}</span>
        <span className="font-medium">{card.label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${card.color}`}>
          {card.value}
          <span className="text-lg font-semibold">{card.unit}</span>
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${getBadgeColor(card.badge)}`}>
          {card.badge}
        </span>
      </div>
      {card.subLabel && <p className="text-xs text-gray-400">{card.subLabel}</p>}
      <MiniSparkline data={card.trend} color={card.lineColor} />
    </div>
  );
}


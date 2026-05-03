import { MiniSparkline } from "@/components/atoms/MiniSparkline";

export interface StatCardProps {
  id: string;
  label: string;
  value: string;
  unit: string;
  badge: string;
  badgeColor: string;
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
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${card.badgeColor}`}>
          {card.badge}
        </span>
      </div>
      {card.subLabel && <p className="text-xs text-gray-400">{card.subLabel}</p>}
      <MiniSparkline data={card.trend} color={card.lineColor} />
    </div>
  );
}

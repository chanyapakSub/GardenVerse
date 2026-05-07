"use client";

// กราฟเส้นข้อมูลเซนเซอร์แบบ SVG (ไม่ใช้ library เพิ่มเติม)
const DAYS = ["1 พ.ค.", "2 พ.ค.", "3 พ.ค.", "4 พ.ค.", "5 พ.ค.", "6 พ.ค.", "7 พ.ค."];

const SERIES = [
  {
    label: "อุณหภูมิ (°C)",
    color: "#ef4444",
    data: [18, 19, 17, 20, 18.5, 19.5, 18.6],
    yAxis: "left",
  },
  {
    label: "ความชื้นอากาศ (%)",
    color: "#3b82f6",
    data: [58, 62, 65, 60, 63, 61, 60],
    yAxis: "left",
  },
  {
    label: "แสงแดด (ชม.)",
    color: "#eab308",
    data: [5.5, 6.2, 5.8, 6.4, 6.0, 6.3, 6.2],
    yAxis: "right",
  },
];

const W = 560;
const H = 200;
const PAD = { top: 16, right: 40, bottom: 32, left: 48 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

function toPath(data: number[], min: number, max: number): string {
  return data
    .map((v, i) => {
      const x = PAD.left + (i / (data.length - 1)) * chartW;
      const y = PAD.top + chartH - ((v - min) / (max - min || 1)) * chartH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const leftMin = 0, leftMax = 100;
const rightMin = 0, rightMax = 15;

export default function SensorChart() {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-gray-800 mb-4">กราฟข้อมูลเซนเซอร์</h3>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
        {SERIES.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily: "inherit" }}>
        {/* Y grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = PAD.top + chartH - (v / 100) * chartH;
          return (
            <g key={v}>
              <line x1={PAD.left} x2={PAD.left + chartW} y1={y} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#aaa">{v}</text>
            </g>
          );
        })}
        {/* Right axis labels */}
        {[0, 5, 10, 15].map((v) => {
          const y = PAD.top + chartH - (v / 15) * chartH;
          return (
            <text key={v} x={PAD.left + chartW + 6} y={y + 4} fontSize="9" fill="#aaa">{v}</text>
          );
        })}

        {/* X axis labels */}
        {DAYS.map((d, i) => {
          const x = PAD.left + (i / (DAYS.length - 1)) * chartW;
          return (
            <text key={d} x={x} y={H - 6} textAnchor="middle" fontSize="9" fill="#aaa">{d}</text>
          );
        })}

        {/* Lines */}
        {SERIES.map((s) => {
          const [min, max] = s.yAxis === "right" ? [rightMin, rightMax] : [leftMin, leftMax];
          const path = toPath(s.data, min, max);
          return (
            <g key={s.label}>
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {s.data.map((v, i) => {
                const x = PAD.left + (i / (s.data.length - 1)) * chartW;
                const y = PAD.top + chartH - ((v - min) / (max - min || 1)) * chartH;
                return <circle key={i} cx={x} cy={y} r="3" fill={s.color} />;
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

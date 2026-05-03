import { Sun, Droplets, Wind } from "lucide-react";

interface WeatherWidgetProps {
  temperature: number;
  humidity: number;
}

export function WeatherWidget({ temperature, humidity }: WeatherWidgetProps) {
  return (
    <div className="w-[200px] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between shrink-0">
      <div className="flex items-center gap-3">
        <Sun className="w-10 h-10 text-yellow-400 fill-yellow-400" />
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-800 leading-none">{temperature.toFixed(1)}°C</span>
          <span className="text-xs text-gray-500 font-medium">ปัจจุบัน</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-gray-500 font-medium">ความชื้น</span>
          <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-sm">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            {humidity.toFixed(1)}%
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-gray-500 font-medium">ลม</span>
          <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-sm">
            <Wind className="w-3.5 h-3.5 text-gray-400" />
            12 km/h
          </div>
        </div>
      </div>
    </div>
  );
}

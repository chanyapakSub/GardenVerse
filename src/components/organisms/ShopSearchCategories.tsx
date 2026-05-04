"use client";

import { Search, LayoutGrid, Flower2, Leaf, Carrot, Shovel, Droplets, SprayCan, TicketPercent } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "ทั้งหมด", icon: LayoutGrid },
  { id: "flowers", label: "พืชดอก", icon: Flower2 },
  { id: "herbs", label: "สมุนไพร", icon: Leaf },
  { id: "veggies", label: "ผักสวนครัว", icon: Carrot },
  { id: "tools", label: "อุปกรณ์ปลูก", icon: Shovel },
  { id: "soil", label: "ดินและปุ๋ย", icon: Droplets },
  { id: "maintenance", label: "สารบำรุง", icon: SprayCan },
  { id: "promotions", label: "โปรโมชั่น", icon: TicketPercent },
];

export default function ShopSearchCategories() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="mb-6 space-y-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors shadow-sm"
          placeholder="ค้นหาพืช อุปกรณ์ หรือสินค้า..."
        />
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                isActive 
                  ? "bg-green-50 border-green-200 text-green-700 shadow-sm" 
                  : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-green-600" : "text-gray-400"}`} />
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

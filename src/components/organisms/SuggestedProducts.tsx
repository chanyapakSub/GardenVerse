import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const SUGGESTED_ITEMS = [
  {
    id: "s1",
    name: "สเปรย์ไล่แมลงออร์แกนิค",
    price: 120,
    image: "https://images.unsplash.com/photo-1584985558066-880ea8bb2d24?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "s2",
    name: "ปุ๋ยน้ำสูตรเร่งดอก",
    price: 150,
    image: "https://images.unsplash.com/photo-1598418361093-605fb7dbd486?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function SuggestedProducts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">คุณอาจสนใจ</h3>
        <Link href="#" className="text-xs font-medium text-green-600 hover:text-green-700">ดูทั้งหมด</Link>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {SUGGESTED_ITEMS.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 relative">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <h4 className="text-[11px] font-semibold text-gray-800 leading-tight line-clamp-2 mb-2 min-h-[28px]">{item.name}</h4>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-bold text-gray-900">฿{item.price}</span>
              <button className="p-1 text-green-600 border border-green-200 rounded hover:bg-green-50 transition-colors">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

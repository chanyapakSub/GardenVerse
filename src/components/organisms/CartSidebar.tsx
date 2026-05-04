import { Trash2 } from "lucide-react";
import Image from "next/image";

const CART_ITEMS = [
  {
    id: "1",
    name: "ทิวลิป",
    price: 120,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1520764848981-1250266042db?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "2",
    name: "โหระพา",
    price: 45,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1596547609652-9cb5d8d1f706?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "3",
    name: "ดินปลูกอเนกประสงค์",
    price: 85,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1628156488344-93ff5105eb09?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function CartSidebar() {
  const totalPrice = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-full max-h-[calc(100vh-120px)] sticky top-[88px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">ตะกร้าของฉัน ({CART_ITEMS.length})</h2>
        <button className="text-xs font-medium text-green-600 hover:text-green-700">ดูตะกร้า</button>
      </div>

      {/* Cart Items */}
      <div className="p-4 overflow-y-auto flex-grow space-y-4">
        {CART_ITEMS.map((item) => (
          <div key={item.id} className="flex gap-3 relative border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
              <p className="text-sm font-bold text-gray-700 mt-1">฿{item.price}</p>
              <p className="text-xs text-gray-500 mt-0.5">จำนวน {item.quantity}</p>
            </div>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">ราคารวม</span>
          <span className="text-lg font-bold text-gray-900">฿{totalPrice}</span>
        </div>
        <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm shadow-green-200">
          ไปยังหน้าชำระเงิน
        </button>
      </div>
    </div>
  );
}

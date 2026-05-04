import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  cartItems: CartItem[];
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
}

export default function CartSidebar({ cartItems, onChangeQuantity, onRemoveFromCart }: CartSidebarProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">ตะกร้าของฉัน ({cartItems.length})</h2>
        <button className="text-xs font-medium text-green-600 hover:text-green-700">ดูตะกร้า</button>
      </div>

      {/* Cart Items */}
      <div className="p-4 overflow-y-auto flex-grow space-y-4 max-h-[400px]">
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-4">ยังไม่มีสินค้าในตะกร้า</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 relative border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</h4>
                <p className="text-sm font-bold text-gray-700 mt-1">฿{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => onChangeQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs text-gray-700 w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onChangeQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button 
                onClick={() => onRemoveFromCart(item.id)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">ราคารวม</span>
          <span className="text-lg font-bold text-gray-900">฿{totalPrice}</span>
        </div>
        <button 
          disabled={cartItems.length === 0}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors shadow-sm shadow-green-200"
        >
          ไปยังหน้าชำระเงิน
        </button>
      </div>
    </div>
  );
}

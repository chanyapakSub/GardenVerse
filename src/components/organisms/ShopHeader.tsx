import { ShoppingBag, Heart } from "lucide-react";

export default function ShopHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">ร้านค้า</h1>
          <p className="text-sm text-gray-500">เลือกซื้อพืช อุปกรณ์ และผลิตภัณฑ์คุณภาพสำหรับสวนของคุณ</p>
        </div>
      </div>

      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
        <Heart className="w-4 h-4" />
        จัดการสินค้าโปรด
      </button>
    </div>
  );
}

import { ShieldCheck, Lock, Truck } from "lucide-react";

export default function ShopFeatures() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex gap-3">
        <div className="mt-0.5">
          <ShieldCheck className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800">รับประกันคุณภาพ</h4>
          <p className="text-xs text-gray-500 mt-0.5">รับประกันพืชแข็งแรงถึงมือคุณ</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="mt-0.5">
          <Lock className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800">ปลอดภัย 100%</h4>
          <p className="text-xs text-gray-500 mt-0.5">ไม่พอใจยินดีคืนเงินภายใน 7 วัน</p>
        </div>
      </div>
      
      <div className="flex gap-3">
        <div className="mt-0.5">
          <Truck className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800">จัดส่งรวดเร็ว</h4>
          <p className="text-xs text-gray-500 mt-0.5">จัดส่งภายใน 1-3 วันทำการ</p>
        </div>
      </div>
    </div>
  );
}

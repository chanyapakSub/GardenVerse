"use client";

import Navbar from "@/components/organisms/Navbar";
import ShopHeader from "@/components/organisms/ShopHeader";
import ShopSearchCategories from "@/components/organisms/ShopSearchCategories";
import ShopBanners from "@/components/organisms/ShopBanners";
import ProductGrid from "@/components/organisms/ProductGrid";
import CartSidebar from "@/components/organisms/CartSidebar";
import ShopFeatures from "@/components/organisms/ShopFeatures";
import SuggestedProducts from "@/components/organisms/SuggestedProducts";

// Dummy Data
const RECOMMENDED_PRODUCTS = [
  {
    id: "r1",
    name: "ทิวลิป",
    scientificName: "Tulipa spp.",
    price: 120,
    rating: 4.8,
    reviews: 126,
    image: "https://images.unsplash.com/photo-1520764848981-1250266042db?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "r2",
    name: "ลาเวนเดอร์",
    scientificName: "Lavandula spp.",
    price: 150,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1595958567554-469bfb043c7b?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "r3",
    name: "โหระพา",
    scientificName: "Ocimum basilicum",
    price: 45,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1596547609652-9cb5d8d1f706?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "r4",
    name: "มะเขือเทศเชอร์รี่",
    scientificName: "Solanum lycopersicum",
    price: 65,
    rating: 4.6,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "r5",
    name: "ดินปลูกอเนกประสงค์",
    scientificName: "สำหรับพืชทุกชนิด",
    price: 85,
    rating: 4.8,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1628156488344-93ff5105eb09?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
];

const BEST_SELLERS = [
  {
    id: "b1",
    name: "กุหลาบ",
    scientificName: "Rosa spp.",
    price: 150,
    rating: 4.8,
    reviews: 126,
    image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "b2",
    name: "ผักสลัดรวม",
    scientificName: "Mixed Lettuce",
    price: 35,
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "b3",
    name: "ปุ๋ยอินทรีย์อัดเม็ด",
    scientificName: "Organic Pellet",
    price: 120,
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1596489375323-904325e672c8?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
  {
    id: "b4",
    name: "เครื่องวัดความชื้นดิน",
    scientificName: "Soil Moisture Meter",
    price: 250,
    rating: 4.6,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1598418361093-605fb7dbd486?auto=format&fit=crop&q=80&w=400&h=400", // placeholder
    isFavorite: false,
  },
  {
    id: "b5",
    name: "พริกหวาน 3 สี",
    scientificName: "Bell Pepper Mix",
    price: 60,
    rating: 4.7,
    reviews: 114,
    image: "https://images.unsplash.com/photo-1563514222080-e51080bd03c5?auto=format&fit=crop&q=80&w=400&h=400",
    isFavorite: false,
  },
];


export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <ShopHeader />
            <ShopSearchCategories />
            <ShopBanners />
            
            <ProductGrid 
              title="แนะนำสำหรับคุณ" 
              products={RECOMMENDED_PRODUCTS} 
              viewAllLink="#" 
            />
            
            <ProductGrid 
              title="สินค้าขายดี" 
              products={BEST_SELLERS} 
              viewAllLink="#" 
            />
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 space-y-6 relative z-30">
            <CartSidebar />
            <ShopFeatures />
            <SuggestedProducts />
          </div>
          
        </div>
      </div>
    </div>
  );
}

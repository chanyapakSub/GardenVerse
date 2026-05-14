"use client";

import { useState } from "react";
import Navbar from "@/components/organisms/Navbar";
import ShopHeader from "@/components/organisms/ShopHeader";
import ShopSearchCategories from "@/components/organisms/ShopSearchCategories";
import ShopBanners from "@/components/organisms/ShopBanners";
import ProductGrid from "@/components/organisms/ProductGrid";
import CartSidebar, { CartItem } from "@/components/organisms/CartSidebar";
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
    image: "/images/products/tulip.png",
    isFavorite: false,
    categoryId: "flowers",
  },
  {
    id: "r2",
    name: "ลาเวนเดอร์",
    scientificName: "Lavandula spp.",
    price: 150,
    rating: 4.7,
    reviews: 98,
    image: "/images/products/lavender.png",
    isFavorite: false,
    categoryId: "flowers",
  },
  {
    id: "r3",
    name: "โหระพา",
    scientificName: "Ocimum basilicum",
    price: 45,
    rating: 4.9,
    reviews: 203,
    image: "/images/products/basil.png",
    isFavorite: false,
    categoryId: "veggies",
  },
  {
    id: "r4",
    name: "มะเขือเทศเชอร์รี่",
    scientificName: "Solanum lycopersicum",
    price: 65,
    rating: 4.6,
    reviews: 76,
    image: "/images/products/มะเขือเทศเชอรี่.png",
    isFavorite: false,
    categoryId: "veggies",
  },
  {
    id: "r5",
    name: "ดินปลูกอเนกประสงค์",
    scientificName: "สำหรับพืชทุกชนิด",
    price: 85,
    rating: 4.8,
    reviews: 91,
    image: "/images/products/ดินปลูกอเนกประสงค์.png",
    isFavorite: false,
    categoryId: "soil",
  },
  {
    id: "r6",
    name: "กระถางต้นไม้มินิมอล",
    scientificName: "Plant Pot",
    price: 120,
    rating: 4.7,
    reviews: 84,
    image: "/images/products/กระถาง.jpg",
    isFavorite: false,
    categoryId: "tools",
  },
];

const BEST_SELLERS = [
  {
    id: "b1",
    name: "ทานตะวัน",
    scientificName: "Helianthus annuus",
    price: 80,
    rating: 4.8,
    reviews: 126,
    image: "/images/products/sunflower.png",
    isFavorite: false,
    categoryId: "flowers",
  },
  {
    id: "b2",
    name: "ไฮเดรนเยีย",
    scientificName: "Hydrangea macrophylla",
    price: 250,
    rating: 4.9,
    reviews: 203,
    image: "/images/products/hydrenyia.png",
    isFavorite: false,
    categoryId: "flowers",
  },
  {
    id: "b3",
    name: "ขุยมะพร้าว",
    scientificName: "สำหรับผสมดินปลูก",
    price: 40,
    rating: 4.8,
    reviews: 156,
    image: "/images/products/ขุยมะพร้าว.png",
    isFavorite: false,
    categoryId: "soil",
  },
  {
    id: "b4",
    name: "บัวรดน้ำมินิมอล",
    scientificName: "Watering Can",
    price: 150,
    rating: 4.6,
    reviews: 76,
    image: "/images/products/บัวรดน้ำ.png",
    isFavorite: false,
    categoryId: "tools",
  },
  {
    id: "b5",
    name: "ชุดเครื่องมือปลูก 3 ชิ้น",
    scientificName: "Gardening Tool Set",
    price: 199,
    rating: 4.7,
    reviews: 114,
    image: "/images/products/ชุดเครื่องมือปลูกสามชิ้น.png",
    isFavorite: false,
    categoryId: "tools",
  },
  {
    id: "b6",
    name: "ดอกเดซี่",
    scientificName: "Bellis perennis",
    price: 90,
    rating: 4.7,
    reviews: 88,
    image: "/images/products/daisy.png",
    isFavorite: false,
    categoryId: "flowers",
  },
  {
    id: "b7",
    name: "ฟอร์เก็ตมีน็อต",
    scientificName: "Myosotis sylvatica",
    price: 110,
    rating: 4.8,
    reviews: 95,
    image: "/images/products/forget-me-not.png",
    isFavorite: false,
    categoryId: "flowers",
  },
  {
    id: "b8",
    name: "เมล็ดผักสลัดรวม",
    scientificName: "Mixed Lettuce Seeds",
    price: 35,
    rating: 4.7,
    reviews: 98,
    image: "/images/products/เมล็ดผักสลัด.png",
    isFavorite: false,
    categoryId: "seeds",
  },
];


export default function ShopPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [recommended, setRecommended] = useState(RECOMMENDED_PRODUCTS);
  const [bestSellers, setBestSellers] = useState(BEST_SELLERS);
  const [showFavorites, setShowFavorites] = useState(false);

  const ALL_PRODUCTS = [...recommended, ...bestSellers];
  const filteredProducts = ALL_PRODUCTS.filter(p => activeCategory === "all" || p.categoryId === activeCategory);
  
  // Deduplicate products by id for the favorites list
  const favoriteProducts = Array.from(new Map(ALL_PRODUCTS.filter(p => p.isFavorite).map(item => [item.id, item])).values());

  const handleToggleFavorite = (id: string) => {
    setRecommended(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setBestSellers(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangeQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8 relative">

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <ShopHeader 
              onToggleShowFavorites={() => setShowFavorites(!showFavorites)} 
              isShowingFavorites={showFavorites} 
            />

            {showFavorites ? (
              <div className="mt-4">
                <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">สินค้าโปรดของคุณ ({favoriteProducts.length} รายการ)</h2>
                </div>
                {favoriteProducts.length > 0 ? (
                  <ProductGrid 
                    title="" 
                    products={favoriteProducts} 
                    viewAllLink="#" 
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ) : (
                  <div className="py-20 text-center text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
                    <div className="text-5xl mb-4">💔</div>
                    <p className="text-lg font-medium text-gray-800">ยังไม่มีสินค้าโปรด</p>
                    <p className="text-sm mt-1">กดหัวใจที่สินค้าที่คุณชอบ เพื่อบันทึกไว้ดูภายหลัง</p>
                    <button 
                      onClick={() => setShowFavorites(false)}
                      className="mt-6 px-6 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors"
                    >
                      เลือกดูสินค้าเลย
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <ShopSearchCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                <ShopBanners 
                  onAddStarterPack={() => handleAddToCart({
                    id: "pkg-starter",
                    name: "แพ็กเกจเริ่มต้นมือใหม่",
                    price: 399,
                    image: "/images/products/แพ็กเกจเริ่มต้นมือใหม่.png"
                  })} 
                />

                {activeCategory === "all" ? (
                  <>
                    <ProductGrid 
                      title="แนะนำสำหรับคุณ" 
                      products={recommended} 
                      viewAllLink="#" 
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                    />
                    <ProductGrid 
                      title="สินค้าขายดี" 
                      products={bestSellers} 
                      viewAllLink="#" 
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </>
                ) : (
                  <>
                    {filteredProducts.length > 0 ? (
                      <ProductGrid 
                        title="สินค้าในหมวดหมู่นี้" 
                        products={filteredProducts} 
                        viewAllLink="#" 
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ) : (
                      <div className="py-20 text-center text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm mt-6">
                        <div className="text-4xl mb-4">🌱</div>
                        <p className="text-lg font-medium text-gray-800">ไม่พบสินค้าในหมวดหมู่นี้</p>
                        <p className="text-sm mt-1">ลองเปลี่ยนหมวดหมู่หรือค้นหาด้วยคำอื่น</p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 relative z-30">
            <div className="sticky top-[88px] space-y-6 h-[calc(100vh-100px)] overflow-y-auto pb-4 pr-1 scrollbar-hide">
              <CartSidebar
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onChangeQuantity={handleChangeQuantity}
              />
              <ShopFeatures />
              <SuggestedProducts />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

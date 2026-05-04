import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isFavorite?: boolean;
}

export default function ProductCard({
  id,
  name,
  scientificName,
  price,
  rating,
  reviews,
  image,
  isFavorite = false,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
      {/* Favorite Button */}
      <button className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-50 transition-colors z-10">
        <Heart 
          className={`w-5 h-5 ${isFavorite ? "fill-green-500 text-green-500" : "text-gray-300 group-hover:text-gray-400"}`} 
        />
      </button>

      {/* Product Image */}
      <div className="w-full h-40 relative mb-4 flex items-center justify-center bg-gray-50/50 rounded-lg overflow-hidden">
        <Image 
          src={image} 
          alt={name} 
          width={120} 
          height={120} 
          className="object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">{name}</h3>
        <p className="text-xs text-gray-500 italic line-clamp-1">{scientificName}</p>
      </div>

      {/* Price & Action */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <span className="text-lg font-bold text-gray-800">฿{price}</span>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500 font-medium">{rating} ({reviews})</span>
          </div>
        </div>
        
        <button className="p-2 border border-green-100 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

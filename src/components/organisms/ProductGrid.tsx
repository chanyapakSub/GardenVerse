import ProductCard from "@/components/molecules/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  isFavorite?: boolean;
}

interface ProductGridProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export default function ProductGrid({ title, products, viewAllLink = "#" }: ProductGridProps) {
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <Link href={viewAllLink} className="text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
          ดูทั้งหมด
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

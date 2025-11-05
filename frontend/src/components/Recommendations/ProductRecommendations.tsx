"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";

interface Product {
  id: number;
  sku: string;
  name: string;
  price_regular: number;
  price_sale?: number;
  currency: string;
  short_desc?: string;
  description?: string;
  images?: string[];
  rating_avg?: number;
  review_count?: number;
}

interface ProductRecommendationsProps {
  productId?: number;
  sku?: string;
  type?: "similar" | "related" | "popular" | "personalized";
  limit?: number;
  title?: string;
  showTitle?: boolean;
}

export function ProductRecommendations({
  productId,
  sku,
  type = "related",
  limit = 4,
  title,
  showTitle = true,
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [productId, sku, type, limit]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (productId) params.append("product_id", productId.toString());
      if (sku) params.append("sku", sku);
      params.append("type", type);
      params.append("limit", limit.toString());

      const res = await fetch(`/api/recommendations?${params.toString()}`);
      const data = await res.json();

      if (data.ok && data.recommendations) {
        setProducts(data.recommendations);
      } else {
        setError(data.error || "שגיאה בטעינת המלצות");
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("שגיאה בטעינת המלצות");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "similar":
        return "מוצרים דומים";
      case "related":
        return "מוצרים קשורים";
      case "popular":
        return "מוצרים פופולריים";
      case "personalized":
        return "מוצרים מומלצים עבורך";
      default:
        return "מוצרים מומלצים";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {showTitle && (
          <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg p-4 animate-pulse"
            >
              <div className="h-48 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ArrowLeft className="text-gold" />
          {getTitle()}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              sku: product.sku,
              name: product.name,
              price_regular: product.price_regular,
              price_sale: product.price_sale,
              currency: product.currency || "ILS",
              short_desc: product.short_desc || product.description || "",
            }}
          />
        ))}
      </div>
    </div>
  );
}


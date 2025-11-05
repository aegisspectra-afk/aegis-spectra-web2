"use client";

import { useEffect, useState, useCallback } from "react";
import { ReviewStars } from "./ReviewStars";
import { ThumbsUp, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface Review {
  id: number;
  user_name: string;
  rating: number;
  title: string | null;
  review_text: string;
  images: string[] | null;
  verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  status: string;
}

interface ReviewListProps {
  productId?: number;
  sku?: string;
  limit?: number;
  showFilters?: boolean;
}

export function ReviewList({ productId, sku, limit = 10, showFilters = true }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());

  const fetchReviews = useCallback(async () => {
    if (!productId && !sku) {
      setError("נדרש product_id או sku");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (productId) params.append("product_id", productId.toString());
      if (sku) params.append("sku", sku);
      if (ratingFilter) params.append("rating", ratingFilter);
      if (sortBy) params.append("sort", sortBy);
      if (verifiedOnly) params.append("verified_only", "true");
      params.append("limit", limit.toString());

      const res = await fetch(`/api/reviews?${params.toString()}`);
      const data = await res.json();

      if (data.ok) {
        setReviews(data.reviews || []);
      } else {
        setError(data.error || "שגיאה בטעינת ביקורות");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("שגיאה בטעינת ביקורות");
    } finally {
      setLoading(false);
    }
  }, [productId, sku, ratingFilter, sortBy, verifiedOnly, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);


  const handleHelpful = async (reviewId: number) => {
    if (helpfulReviews.has(reviewId)) return;

    try {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const newHelpful = new Set(helpfulReviews);
        newHelpful.add(reviewId);
        setHelpfulReviews(newHelpful);
        // Update the review's helpful count
        setReviews(reviews.map(r => 
          r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
        ));
      }
    } catch (err) {
      console.error("Error marking review as helpful:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        ))}
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

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>אין ביקורות עדיין. היה הראשון לכתוב ביקורה!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">סינון לפי דירוג:</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white"
            >
              <option value="">הכל</option>
              <option value="5">5 כוכבים</option>
              <option value="4">4 כוכבים</option>
              <option value="3">3 כוכבים</option>
              <option value="2">2 כוכבים</option>
              <option value="1">1 כוכב</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">מיון:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm text-white"
            >
              <option value="newest">החדש ביותר</option>
              <option value="oldest">העתיק ביותר</option>
              <option value="helpful">המועיל ביותר</option>
              <option value="rating_high">דירוג גבוה</option>
              <option value="rating_low">דירוג נמוך</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-300">רק רכישות מאומתות</span>
          </label>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white">{review.user_name}</h4>
                  {review.verified_purchase && (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle2 size={14} />
                      <span>רכישה מאומתת</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <ReviewStars rating={review.rating} size={16} />
                  {review.title && (
                    <h5 className="font-medium text-gray-200">{review.title}</h5>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString("he-IL")}
              </span>
            </div>

            <p className="text-gray-300 mb-3 whitespace-pre-wrap">{review.review_text}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {review.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded border border-gray-600 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <Image
                      src={img}
                      alt={`תמונה ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleHelpful(review.id)}
                disabled={helpfulReviews.has(review.id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  helpfulReviews.has(review.id)
                    ? "text-green-400 cursor-not-allowed"
                    : "text-gray-400 hover:text-green-400 cursor-pointer"
                }`}
              >
                <ThumbsUp size={16} />
                <span>מועיל ({review.helpful_count})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


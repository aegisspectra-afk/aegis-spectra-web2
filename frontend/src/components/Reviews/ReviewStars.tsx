"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface ReviewStarsProps {
  rating: number;
  interactive?: boolean;
  size?: number;
  onRatingChange?: (rating: number) => void;
  showEmptyStars?: boolean;
}

export function ReviewStars({ 
  rating, 
  interactive = false, 
  size = 20,
  onRatingChange,
  showEmptyStars = true
}: ReviewStarsProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  const displayRating = interactive && hoveredRating > 0 ? hoveredRating : rating;

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= displayRating;
        return (
          <button
            key={value}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(value)}
            onMouseEnter={() => handleMouseEnter(value)}
            onMouseLeave={handleMouseLeave}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
            aria-label={`${value} כוכבים`}
          >
            <Star
              size={size}
              className={
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : showEmptyStars
                  ? "fill-gray-300 text-gray-300"
                  : "fill-transparent text-gray-300"
              }
            />
          </button>
        );
      })}
    </div>
  );
}


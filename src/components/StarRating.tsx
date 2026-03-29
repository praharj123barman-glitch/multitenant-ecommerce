"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({
  rating,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Select rating" : `Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className="cursor-pointer transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={`${sizes[size]} ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </button>
        ) : (
          <span key={star} className="cursor-default" aria-hidden="true">
            <Star
              className={`${sizes[size]} ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          </span>
        )
      )}
    </div>
  );
}

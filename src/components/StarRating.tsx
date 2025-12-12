import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number; // 0 to 5
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({ rating, size = 16, interactive = false, onRate }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const full = star <= rating;
        const half = !full && star === Math.ceil(rating) && rating % 1 !== 0; // Simplified half star logic if needed, usually just full stars for input

        return (
          <button
            key={star}
            disabled={!interactive}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Star 
                size={size} 
                className={`${full ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} 
            />
          </button>
        );
      })}
    </div>
  );
}

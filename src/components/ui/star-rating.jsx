import { useState } from "react";
import { cn } from "@/lib/utils";

function StarRating({
  rating = 0,
  onRatingChange,
  readonly = false,
  size = "md",
  showValue = false,
  className = "",
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <div className={cn("flex", sizeClasses[size])}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={cn(
              "transition-colors duration-150",
              readonly
                ? "cursor-default"
                : "transition-transform transform cursor-pointer hover:scale-110"
            )}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            <span
              className={
                star <= displayRating ? "text-yellow-400" : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? rating.toFixed(1) : "No rating"}
        </span>
      )}
    </div>
  );
}

export { StarRating };

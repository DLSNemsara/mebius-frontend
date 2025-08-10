import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from "@/lib/features/wishlistSlice";

const WishlistButton = ({
  productId,
  size = "default",
  variant = "outline",
  className = "",
  showText = false,
}) => {
  const dispatch = useDispatch();
  const { isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, productId)
  );

  const handleWishlistToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when used in cards
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to add items to your wishlist");
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${isInWishlist ? "text-red-500" : ""}`}
      onClick={handleWishlistToggle}
      disabled={isLoading}
    >
      <Heart
        className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""} ${
          showText ? "mr-2" : ""
        }`}
      />
      {showText && (isInWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
    </Button>
  );
};

export default WishlistButton;

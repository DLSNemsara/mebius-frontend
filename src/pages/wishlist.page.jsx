import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { addToCart } from "@/lib/features/cartSlice";
import {
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistError,
} from "@/lib/features/wishlistSlice";
import { toast } from "sonner";

function WishlistPage() {
  const dispatch = useDispatch();
  const { isSignedIn, isLoaded } = useUser();

  const wishlistItems = useSelector(selectWishlistItems);
  const isLoading = useSelector(selectWishlistLoading);
  const error = useSelector(selectWishlistError);
  const cart = useSelector((state) => state.cart.value);

  useEffect(() => {
    if (isSignedIn) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isSignedIn]);

  const handleRemoveFromWishlist = async (productId, productName) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success(`${productName} removed from wishlist`);
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
  };

  const getAvailableStock = (product) => {
    const cartQuantity = cart
      .filter((item) => item.product._id === product._id)
      .reduce((acc, item) => acc + item.quantity, 0);
    return product.stock - cartQuantity;
  };

  if (!isLoaded) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center min-h-[400px] flex flex-col justify-center">
          <Heart className="mx-auto mb-4 w-16 h-16 text-gray-300" />
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Sign In to View Your Wishlist
          </h1>
          <p className="mb-6 text-gray-600">
            Save your favorite products and access them anytime.
          </p>
          <Button asChild>
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="mb-4 w-full h-48" />
                <Skeleton className="mb-2 w-3/4 h-4" />
                <Skeleton className="mb-4 w-1/2 h-4" />
                <Skeleton className="w-full h-10" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center min-h-[400px] flex flex-col justify-center">
          <h1 className="mb-4 text-3xl font-bold text-red-600">Error</h1>
          <p className="mb-6 text-gray-600">{error}</p>
          <Button onClick={() => dispatch(fetchWishlist())}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center min-h-[400px] flex flex-col justify-center">
          <Heart className="mx-auto mb-4 w-16 h-16 text-gray-300" />
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Your Wishlist is Empty
          </h1>
          <p className="mb-6 text-gray-600">
            Start adding products you love to your wishlist.
          </p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-1 text-gray-600">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => {
          const product = item.productId;
          const availableStock = getAvailableStock(product);
          const mainImage = product.images?.[0] || product.image;

          return (
            <Card
              key={item._id}
              className="flex flex-col h-full transition-shadow group hover:shadow-lg"
            >
              <CardContent className="flex flex-col p-0 h-full">
                {/* Product Image */}
                <div className="relative">
                  <Link to={`/shop/product/${product._id}`}>
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="object-contain w-full h-48 rounded-t-lg"
                    />
                  </Link>

                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      handleRemoveFromWishlist(product._id, product.name)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {/* Stock Badge */}
                  {availableStock <= 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute bottom-2 left-2"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex-grow">
                    <Link to={`/shop/product/${product._id}`}>
                      <h3 className="mb-2 text-lg font-semibold transition-colors hover:text-blue-600 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {product.shortDescription || product.description}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      {product.rating && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-1 text-yellow-400">★</span>
                          {product.rating.average.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto w-full">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={availableStock <= 0}
                    >
                      <ShoppingCart className="mr-2 w-4 h-4" />
                      {availableStock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default WishlistPage;

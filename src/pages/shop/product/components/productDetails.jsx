import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { useEffect, useState } from "react";
import { useGetProductQuery } from "@/lib/api";
import WishlistButton from "@/components/WishlistButton";
import ReviewsSection from "@/components/ReviewsSection";

function ProductDetails({ product: initialProduct }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.value);

  // Use RTK Query to get live product data
  const { data: product } = useGetProductQuery(initialProduct._id, {
    initialData: initialProduct,
  });

  // Calculate total quantity of the product in the cart
  const cartQuantity = cart
    .filter((item) => item.product._id === product._id)
    .reduce((acc, item) => acc + item.quantity, 0);

  // Local state for available stock
  const [availableStock, setAvailableStock] = useState(
    product.stock - cartQuantity
  );

  // Local state for selected image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Recalculate available stock whenever cart or product changes
  useEffect(() => {
    setAvailableStock(product.stock - cartQuantity);
  }, [cart, product, cartQuantity]);

  const handleAddToCart = () => {
    if (availableStock <= 0) return; // No stock available
    dispatch(addToCart(product));
  };

  // Get all images and current selected image
  const allImages = product.images || (product.image ? [product.image] : []);
  const currentImage =
    allImages[selectedImageIndex] || allImages[0] || product.image;

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product._id]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <span>Home</span> / <span>Shop</span> /{" "}
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          {/* Main Image */}
          <div className="relative mb-4">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-[400px] object-contain rounded-lg border transition-all duration-300"
            />
            {/* Stock Badge - Only show for urgent situations */}
            <div className="absolute top-2 right-2">
              {
                availableStock <= 0 ? (
                  <Badge variant="destructive" className="animate-pulse">
                    ❌ Out of Stock
                  </Badge>
                ) : availableStock <= 3 ? (
                  <Badge
                    variant="destructive"
                    className="text-white bg-red-500 animate-pulse"
                  >
                    🔥 Only {availableStock} left - Hurry!
                  </Badge>
                ) : availableStock <= 5 ? (
                  <Badge
                    variant="secondary"
                    className="text-white bg-orange-500"
                  >
                    ⚡ Only {availableStock} left
                  </Badge>
                ) : availableStock <= 10 ? (
                  <Badge
                    variant="outline"
                    className="text-yellow-800 bg-yellow-100 border-yellow-300"
                  >
                    📦 Low Stock
                  </Badge>
                ) : null /* Don't show badge for high stock items */
              }
            </div>
          </div>

          {/* Image Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex overflow-x-auto gap-2">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className={`object-contain w-16 h-16 rounded border cursor-pointer transition-all ${
                    selectedImageIndex === index
                      ? "border-blue-500 border-2 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4 w-full md:w-1/2">
          {/* Product Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          {product.rating && product.rating.count > 0 && (
            <div className="flex gap-2 items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(product.rating.average) ? "★" : "☆"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.rating.average.toFixed(1)}) · {product.rating.count}{" "}
                reviews
              </span>
            </div>
          )}

          {/* Price */}
          <p className="text-3xl font-bold text-green-600">${product.price}</p>

          {/* Short Description */}
          <p className="text-lg text-gray-700">
            {product.shortDescription || product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
              disabled={availableStock <= 0}
            >
              {availableStock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <WishlistButton
              productId={product._id}
              size="lg"
              variant="outline"
              showText={false}
            />
          </div>

          {/* Stock Info */}
          <div className="text-sm">
            {availableStock <= 0 ? (
              <p className="font-medium text-red-600">
                📭 Currently out of stock. Check back soon!
              </p>
            ) : availableStock <= 3 ? (
              <p className="font-medium text-red-600">
                🚨 Only {availableStock} items remaining - Order now!
              </p>
            ) : availableStock <= 5 ? (
              <p className="font-medium text-orange-600">
                ⚡ Limited stock: {availableStock} items left
              </p>
            ) : availableStock <= 10 ? (
              <p className="text-yellow-700">📦 Low stock available</p>
            ) : (
              <p className="text-green-600">✅ In stock and ready to ship</p>
            )}
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Specifications
                </h3>
                <div className="p-6 space-y-1 bg-gray-50 rounded-lg border border-gray-200">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => {
                      if (
                        !value ||
                        (Array.isArray(value) && value.length === 0)
                      )
                        return null;

                      const formattedValue = Array.isArray(value)
                        ? value.join(", ")
                        : value;
                      const isLongValue = formattedValue.length > 50;

                      return (
                        <div
                          key={key}
                          className={`${
                            isLongValue
                              ? "flex flex-col space-y-2"
                              : "flex flex-col sm:flex-row sm:justify-between sm:items-start"
                          } py-4 border-b border-gray-300 last:border-b-0`}
                        >
                          <span className="font-semibold text-gray-900 capitalize min-w-0 sm:min-w-[140px] flex-shrink-0 text-sm">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span
                            className={`text-gray-700 text-sm ${
                              isLongValue
                                ? "mt-2 leading-relaxed"
                                : "flex-1 sm:text-right sm:ml-4"
                            }`}
                          >
                            {formattedValue}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

          {/* Detailed Description */}
          {product.detailedDescription && (
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">Product Details</h3>
              <p className="leading-relaxed text-gray-700">
                {product.detailedDescription}
              </p>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <ReviewsSection productId={product._id} />
      </div>
    </div>
  );
}

export default ProductDetails;

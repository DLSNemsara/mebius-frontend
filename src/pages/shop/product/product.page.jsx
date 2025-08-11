import { useParams } from "react-router-dom";
import { useGetProductQuery, useCheckStockQuery } from "@/lib/api";
import ProductDetails from "./components/productDetails.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";

function ProductPage() {
  const { productId } = useParams();
  const { data: product, isLoading, error } = useGetProductQuery(productId);
  const [quantity, setQuantity] = useState(1); // Handle quantity state
  const dispatch = useDispatch();

  // Scroll to top when component mounts or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Use check stock API query to validate stock before adding to cart
  const { data: stockData } = useCheckStockQuery({
    productId: productId,
    quantity: quantity,
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col gap-8 md:flex-row">
          <Skeleton className="w-full md:w-1/2 h-[400px]" />
          <div className="space-y-4 w-full md:w-1/2">
            <Skeleton className="w-3/4 h-8" />
            <Skeleton className="w-1/4 h-6" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading product</div>;
  }

  const handleAddToCart = () => {
    // Check stock before adding to cart
    if (stockData && stockData.isInStock) {
      dispatch(addToCart(product)); // Add the product to cart if stock is sufficient
    } else {
      alert("Sorry, not enough stock available for this item.");
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <ProductDetails product={product} onAddToCart={handleAddToCart} />
    </div>
  );
}

export default ProductPage;

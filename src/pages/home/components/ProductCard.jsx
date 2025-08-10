import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import WishlistButton from "@/components/WishlistButton";

function ProductCard(props) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.value);

  // Get current cart quantity for this product
  const cartItem = cart.find((item) => item.product._id === props._id);
  const cartQuantity = cartItem?.quantity || 0;
  const availableStock = props.stock - cartQuantity;

  const handleClick = (e) => {
    // Check if adding one more would exceed stock
    if (props.stock <= cartQuantity) {
      return;
    }
    dispatch(
      addToCart({
        _id: props._id,
        name: props.name,
        price: props.price,
        image:
          props.images?.[0] ||
          props.image ||
          "/assets/products/placeholder.png",
        description: props.shortDescription || props.description,
        stock: props.stock,
      })
    );
  };

  return (
    <Card className="flex overflow-hidden flex-col h-full rounded-lg border border-gray-200 shadow-md">
      {/* Product Image */}
      <Link to={`/shop/product/${props._id}`} className="block">
        <div className="flex relative justify-center items-center p-4 h-56 sm:h-72 md:h-96 bg-card">
          <img
            src={
              props.images?.[0] ||
              props.image ||
              "/assets/products/placeholder.png"
            }
            alt={props.name}
            className="object-contain w-full h-full"
          />
          {/* Stock Badge - Only show for urgent situations */}
          {
            availableStock <= 0 ? (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 animate-pulse"
              >
                Out of Stock
              </Badge>
            ) : availableStock <= 3 ? (
              <Badge
                variant="destructive"
                className="absolute top-2 right-2 text-white bg-red-500 animate-pulse"
              >
                🔥 {availableStock} left!
              </Badge>
            ) : availableStock <= 5 ? (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 text-white bg-orange-500"
              >
                ⚡ {availableStock} left
              </Badge>
            ) : availableStock <= 10 ? (
              <Badge
                variant="outline"
                className="absolute top-2 right-2 text-yellow-800 bg-yellow-100 border-yellow-300"
              >
                Low Stock
              </Badge>
            ) : null /* Don't show badge for high stock items */
          }

          {/* Wishlist Button */}
          <div className="absolute top-2 left-2">
            <WishlistButton
              productId={props._id}
              size="sm"
              variant="outline"
              className="border-gray-200 bg-white/80 hover:bg-white"
            />
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow gap-2 p-4">
        <div className="flex-grow">
          <Link to={`/shop/product/${props._id}`} className="block h-full">
            <div className="flex justify-between items-start">
              <h2 className="w-3/4 text-lg font-semibold truncate sm:text-xl line-clamp-2">
                {props.name}
              </h2>
              <span className="text-base font-medium sm:text-lg">
                ${props.price}
              </span>
            </div>
            <p className="text-xs sm:text-sm line-clamp-2">
              {props.shortDescription || props.description}
            </p>
          </Link>
        </div>

        {/* Add to Cart Button */}
        <div className="w-full">
          <Button
            className="w-full"
            onClick={handleClick}
            disabled={props.stock <= cartQuantity}
          >
            {props.stock <= cartQuantity ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;

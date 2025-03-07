import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cartSlice";
import { Badge } from "@/components/ui/badge";

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
        image: props.image,
        description: props.description,
        stock: props.stock,
      })
    );
  };

  return (
    <Card className="flex overflow-hidden flex-col h-full rounded-lg border border-gray-200 shadow-md">
      {/* Product Image */}
      <div className="flex relative justify-center items-center p-4 h-56 sm:h-72 md:h-96 bg-card">
        <img
          src={props.image}
          alt={props.name}
          className="object-contain w-full h-full"
        />
        {/* Stock Badge */}
        {availableStock <= 0 ? (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        ) : availableStock <= 5 ? (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Only {availableStock} left
          </Badge>
        ) : null}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow gap-2 p-4">
        <div className="flex justify-between items-start">
          <h2 className="w-3/4 text-lg font-semibold truncate sm:text-xl line-clamp-2">
            {props.name}
          </h2>
          <span className="text-base font-medium sm:text-lg">
            ${props.price}
          </span>
        </div>
        <p className="flex-grow text-xs sm:text-sm line-clamp-2">
          {props.description}
        </p>

        {/* Add to Cart Button */}
        <div className="mt-2 w-full">
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

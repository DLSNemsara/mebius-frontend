import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "./lib/features/cartSlice";

function ProductCard(props) {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    dispatch(
      addToCart({
        _id: props._id,
        name: props.name,
        price: props.price,
        image: props.image,
        description: props.description,
      })
    );
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden border border-gray-200 rounded-lg shadow-md">
      {/* Product Image */}
      <div className="relative flex items-center justify-center h-48 p-4 sm:h-64 md:h-80 bg-card">
        <img
          src={props.image}
          alt={props.name}
          className="object-contain w-full h-full"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow gap-2 p-4">
        <div className="flex items-start justify-between">
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
        <div className="w-full mt-2">
          <Button className="w-full" onClick={handleClick}>
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;

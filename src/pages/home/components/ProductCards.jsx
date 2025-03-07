import ProductCard from "./ProductCard";

function ProductCards(props) {
  return (
    <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {props.products.map((product) => {
        return (
          <ProductCard
            handleAddToCart={props.handleAddToCart}
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
            description={product.description}
            stock={product.stock}
            isAvailable={product.isAvailable}
          />
        );
      })}
    </div>
  );
}

export default ProductCards;

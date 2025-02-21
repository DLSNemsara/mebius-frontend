import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar(props) {
  const cart = useSelector((state) => state.cart.value);

  const getCartQuantity = () => {
    let count = 0;
    cart.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };
  return (
    <nav className="flex items-center justify-between p-8 px-8">
      <div className="flex gap-x-16">
        <a className="text-3xl font-semibold" href="/">
          Mebius
        </a>
        <div className="flex items-center gap-4">
          <a href="/">Home</a>
          <a href="/shop">Shop</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <Link to="/shop/cart" className="relative flex items-center gap-4">
            <p className="text-lg">{getCartQuantity()}</p>
            <div className="flex items-center gap-2">
              <ShoppingCart />
              Cart
            </div>
          </Link>
        </div>
        <SignedOut>
          <div className="flex items-center gap-4">
            <Link to="/sign-in"> Sign In </Link>
            <Link to="/sign-up"> Sign Up </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <Link to={"/account"}> Account </Link>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;

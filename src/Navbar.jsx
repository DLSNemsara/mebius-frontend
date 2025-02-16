import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";

function Navbar(props) {
  // const name = "Sinel Nemsara";
  // const cartCount = 0;
  return (
    <nav className="flex items-center justify-between p-8 mx-16">
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
          <a href="/cart" className="relative flex items-center gap-4">
            <p className="text-lg">{props.cartCount}</p>
            <div className="flex items-center gap-2">
              <ShoppingCart />
              Cart
            </div>
          </a>
        </div>
        {props.name && <p>Hi, {props.name}</p>}
        {!props.name && (
          <div className="flex items-center gap-4">
            <Link to="/sign-in"> Sign In </Link>
            <Link to="/sign-up"> Sign Up </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

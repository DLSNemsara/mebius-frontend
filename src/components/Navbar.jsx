import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { ShoppingCart, Menu, User, Home, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
  const cart = useSelector((state) => state.cart.value);

  const getCartQuantity = () => {
    let count = 0;
    cart.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo and Main Navigation */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link
            to="/"
            className="text-xl font-semibold transition-colors hover:text-primary"
          >
            Mebius
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
            >
              <Package className="w-4 h-4" />
              Shop
            </Link>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            to="/shop/cart"
            className="relative flex items-center gap-2 p-2 transition-colors rounded-full hover:bg-accent"
          >
            <ShoppingCart className="w-5 h-5" />
            {getCartQuantity() > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-primary">
                {getCartQuantity()}
              </span>
            )}
          </Link>

          {/* Auth Buttons */}
          <SignedOut>
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <Link
                to="/account"
                className="hidden p-2 transition-colors rounded-full md:flex hover:bg-accent"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </SignedIn>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 md:hidden">
              <Menu className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/shop">Shop</Link>
              </DropdownMenuItem>
              <SignedOut>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/sign-in">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </DropdownMenuItem>
              </SignedOut>
              <SignedIn>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account">My Account</Link>
                </DropdownMenuItem>
              </SignedIn>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import {
  ShoppingCart,
  Menu,
  User,
  Home,
  Package,
  Heart,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  const { isLoaded, user } = useUser();
  const cart = useSelector((state) => state.cart.value);
  const wishlistCount = useSelector(
    (state) => state.wishlist?.items?.length || 0
  );
  const location = useLocation();

  const getCartQuantity = () => {
    let count = 0;
    cart.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      // If already on home page, refresh it
      window.location.reload();
    } else {
      // If on other page, navigate to home
      window.location.href = "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex justify-between items-center px-4 mx-auto h-16">
        {/* Logo and Main Navigation */}
        <div className="flex gap-6 items-center md:gap-8">
          <Link
            to="/"
            className="text-xl font-semibold transition-colors hover:text-primary"
          >
            Mebius
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <button
              onClick={handleHomeClick}
              className="flex gap-2 items-center text-sm transition-colors hover:text-primary"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <Link
              to="/shop"
              className="flex gap-2 items-center text-sm transition-colors hover:text-primary"
            >
              <Package className="w-4 h-4" />
              Shop
            </Link>
            {/* Admin Navigation */}
            {isLoaded && user?.publicMetadata?.role === "admin" && (
              <Link
                to="/admin"
                className="flex gap-2 items-center text-sm text-blue-600 transition-colors hover:text-primary"
              >
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex gap-4 items-center">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="flex relative gap-2 items-center p-2 rounded-full transition-colors hover:bg-accent"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/shop/cart"
            className="flex relative gap-2 items-center p-2 rounded-full transition-colors hover:bg-accent"
          >
            <ShoppingCart className="w-5 h-5" />
            {getCartQuantity() > 0 && (
              <span className="flex absolute -top-1 -right-1 justify-center items-center w-5 h-5 text-xs text-white rounded-full bg-primary">
                {getCartQuantity()}
              </span>
            )}
          </Link>

          {/* Auth Buttons */}
          {!isLoaded ? (
            // Loading placeholder to prevent layout shift
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="hidden w-8 h-8 bg-gray-200 rounded-full animate-pulse md:block"></div>
            </div>
          ) : (
            <>
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
                <div className="flex gap-4 items-center">
                  <UserButton afterSignOutUrl="/" />
                  <Link
                    to="/account"
                    className="hidden p-2 rounded-full transition-colors md:flex hover:bg-accent"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              </SignedIn>
            </>
          )}

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
              {isLoaded && (
                <>
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
                    {user?.publicMetadata?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                  </SignedIn>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

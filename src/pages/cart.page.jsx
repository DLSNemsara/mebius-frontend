import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  Trash2,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Tag,
  AlertCircle,
} from "lucide-react";
import { updateQuantity, removeFromCart } from "@/lib/features/cartSlice";
import { addToWishlist } from "@/lib/features/wishlistSlice";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function CartPage() {
  const cart = useSelector((state) => state.cart?.value || []);
  const dispatch = useDispatch();

  // Enhanced state management
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      setLoadingItems((prev) => new Set([...prev, productId]));

      // Simulate API call delay for better UX
      setTimeout(() => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
        setLoadingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success("Quantity updated");
      }, 300);
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const handleSaveForLater = (product) => {
    dispatch(addToWishlist(product._id));
    dispatch(removeFromCart(product._id));
    toast.success("Item moved to wishlist");
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    setIsApplyingDiscount(true);

    // Simulate API call for discount validation
    setTimeout(() => {
      const validCodes = {
        SAVE10: { discount: 0.1, description: "10% off" },
        WELCOME: { discount: 0.15, description: "15% off for new customers" },
        STUDENT: { discount: 0.2, description: "20% student discount" },
      };

      if (validCodes[discountCode.toUpperCase()]) {
        setAppliedDiscount(validCodes[discountCode.toUpperCase()]);
        toast.success("Discount code applied!");
      } else {
        toast.error("Invalid discount code");
      }

      setIsApplyingDiscount(false);
    }, 1000);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number.parseFloat(item.product.price) * item.quantity,
    0
  );

  const discountAmount = appliedDiscount
    ? subtotal * appliedDiscount.discount
    : 0;
  const total = subtotal - discountAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              {cart.length > 0 && (
                <p className="mt-1 text-muted-foreground">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your
                  cart
                </p>
              )}
            </div>
            {cart.length > 0 && (
              <Link to="/shop">
                <Button variant="outline" className="gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          <Card className="mx-auto max-w-md">
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8">
              <div className="flex justify-center items-center w-24 h-24 bg-gray-100 rounded-full">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">
                  Discover amazing products and add them to your cart
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/shop">
                  <Button className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Start Shopping
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="outline" className="gap-2">
                    <Heart className="w-4 h-4" />
                    View Wishlist
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-6 lg:col-span-2">
              {cart.map((item) => {
                const isLoading = loadingItems.has(item.product._id);
                const stockStatus =
                  item.product.stock > 10
                    ? "in-stock"
                    : item.product.stock > 0
                      ? "low-stock"
                      : "out-of-stock";

                return (
                  <Card
                    key={item.product._id}
                    className="overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6 sm:flex-row">
                        {/* Enhanced Product Image */}
                        <div className="overflow-hidden relative flex-shrink-0 w-32 h-32 bg-gray-100 rounded-xl">
                          <img
                            src={
                              item.product.images?.[0] ||
                              item.product.image ||
                              "/placeholder.svg"
                            }
                            alt={item.product.name}
                            className="object-cover w-full h-full transition-transform hover:scale-105"
                          />
                          {/* Stock Badge */}
                          {stockStatus === "low-stock" && (
                            <Badge className="absolute top-2 right-2 bg-orange-500">
                              <AlertCircle className="mr-1 w-3 h-3" />
                              Low Stock
                            </Badge>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-4">
                          <div className="flex gap-4 justify-between items-start">
                            <div className="space-y-2">
                              <Link to={`/shop/product/${item.product._id}`}>
                                <h3 className="text-lg font-semibold transition-colors cursor-pointer hover:text-primary">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.product.shortDescription ||
                                  item.product.description ||
                                  "No description available"}
                              </p>
                              {/* Stock Info */}
                              <div className="flex gap-2 items-center text-xs">
                                {stockStatus === "in-stock" && (
                                  <Badge
                                    variant="secondary"
                                    className="text-green-700 bg-green-50"
                                  >
                                    ✓ In Stock
                                  </Badge>
                                )}
                                {stockStatus === "low-stock" && (
                                  <Badge
                                    variant="secondary"
                                    className="text-orange-700 bg-orange-50"
                                  >
                                    Only {item.product.stock} left
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Remove item?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove &ldquo;
                                      {item.product.name}&rdquo; from your cart?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRemoveItem(item.product._id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSaveForLater(item.product)}
                                title="Save for later"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Price and Quantity Controls */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Quantity Controls */}
                            <div className="flex gap-3 items-center">
                              <span className="text-sm font-medium text-muted-foreground">
                                Qty:
                              </span>
                              <div className="flex gap-2 items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-9 h-9"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1 || isLoading}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <div className="w-12 font-medium text-center">
                                  {isLoading ? (
                                    <div className="mx-auto w-4 h-4 rounded-full border-2 animate-spin border-primary border-t-transparent"></div>
                                  ) : (
                                    item.quantity
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-9 h-9"
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    isLoading ||
                                    item.quantity >= (item.product.stock || 999)
                                  }
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                ${item.product.price} each
                              </p>
                              <p className="text-xl font-bold">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Enhanced Order Summary */}
            <div className="space-y-6 lg:col-span-1">
              {/* Discount Code Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center text-lg">
                    <Tag className="w-5 h-5" />
                    Discount Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyDiscount}
                      disabled={isApplyingDiscount || !discountCode.trim()}
                      variant="outline"
                    >
                      {isApplyingDiscount ? (
                        <div className="w-4 h-4 rounded-full border-2 animate-spin border-primary border-t-transparent"></div>
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>

                  {appliedDiscount && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800">
                          {appliedDiscount.description} applied!
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAppliedDiscount(null);
                            setDiscountCode("");
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Sample Codes */}
                  <div className="text-xs text-muted-foreground">
                    <p>Try: SAVE10, WELCOME, STUDENT</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Items ({totalItems})
                      </span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedDiscount.description})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="flex gap-1 items-center text-muted-foreground">
                        <Truck className="w-4 h-4" />
                        Shipping
                      </span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-muted-foreground">
                        Calculated at checkout
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-4 space-y-3">
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex gap-2 items-center text-sm text-muted-foreground">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Free shipping on all orders</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="pt-4 space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link to="/shop/checkout" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Proceed to Checkout
                      </Link>
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By proceeding, you agree to our Terms of Service
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="gap-2 justify-start w-full"
                      asChild
                    >
                      <Link to="/wishlist">
                        <Heart className="w-4 h-4" />
                        View Wishlist
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 justify-start w-full"
                      asChild
                    >
                      <Link to="/shop">
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CartPage;

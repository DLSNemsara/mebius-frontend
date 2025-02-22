import Navbar from "@/Navbar";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { updateQuantity, removeFromCart } from "@/lib/features/cartSlice";

function CartPage() {
  const cart = useSelector((state) => state.cart?.value || []);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + Number.parseFloat(item.product.price) * item.quantity;
    }, 0);
  };

  return (
    <main>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">My Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <Link to="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <Card key={item.product._id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-shrink-0 w-24 h-24 overflow-hidden rounded-lg">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-semibold">
                            {item.product.name}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleRemoveItem(item.product._id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="font-semibold">
                            $
                            {(
                              Number.parseFloat(item.product.price) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">
                        ${calculateSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" size="lg">
                      <Link to="/shop/checkout" className="block">
                        Proceed to Checkout
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

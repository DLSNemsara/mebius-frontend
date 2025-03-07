import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/lib/features/cartSlice";
import { toast } from "sonner";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, ArrowLeft, ShoppingCart } from "lucide-react";
import { useCreateOrderMutation } from "@/lib/api";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();

  if (cart.length === 0) {
    return <Navigate to="/shop" />;
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    try {
      const shippingAddress = JSON.parse(
        localStorage.getItem("shippingAddress")
      );

      const orderData = {
        items: cart.map((item) => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            price: Number(item.product.price),
            image: item.product.image || "",
            description: item.product.description || "",
          },
          quantity: item.quantity,
        })),
        shippingAddress: {
          line_1: shippingAddress.line_1,
          line_2: shippingAddress.line_2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip_code: shippingAddress.zip_code,
          phone: shippingAddress.phone,
        },
      };

      console.log("Attempting to create order with data:", orderData);

      const response = await createOrder(orderData).unwrap();
      console.log("Order created successfully:", response);

      dispatch(clearCart());
      localStorage.removeItem("shippingAddress");
      toast.success("Order Placed Successfully");

      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        navigate(`/shop/complete?orderId=${response._id}`);
      }, 100);
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(
        `Failed to place order: ${error.data?.message || "Please try again"}`
      );
    }
  };
  return (
    <main className="py-12 min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Review Order</h1>
          <Link
            to="/shop/cart"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to cart
          </Link>
        </div>

        <div className="grid gap-6">
          {/* Order Items Card */}
          <Card>
            <CardHeader className="flex flex-row gap-2 items-center">
              <Package className="w-5 h-5 text-primary" />
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index}>
                    <div className="flex gap-4 items-center">
                      <div className="overflow-hidden w-20 h-20 bg-gray-100 rounded-lg">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <div className="flex gap-2 items-center mt-1 text-sm text-muted-foreground">
                          <span>${item.product.price.toFixed(2)} each</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {index < cart.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
                onClick={handlePlaceOrder}
              >
                <ShoppingCart className="mr-2 w-4 h-4" />
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default PaymentPage;

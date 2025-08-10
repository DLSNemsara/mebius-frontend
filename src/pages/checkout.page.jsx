import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Truck,
  ArrowLeft,
  CreditCard,
  DollarSign,
} from "lucide-react";
import ShippingAddressForm from "@/components/ShippingAddressForm";
import { useState, useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const formRef = useRef(null);

  if (cart.length === 0) {
    return <Navigate to="/shop" />;
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const handleContinueToPayment = () => {
    // Trigger the form submission to save shipping details first
    if (formRef.current) {
      formRef.current.submit();
    } else {
      toast.error("Please fill in shipping details first");
    }
  };

  return (
    <main className="py-12 min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link
            to="/shop/cart"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to cart
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipping Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-2 items-center mb-6">
                  <Truck className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Shipping Details</h2>
                </div>
                <ShippingAddressForm
                  cart={cart}
                  paymentMethod={paymentMethod}
                  ref={formRef}
                />
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-2 items-center mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                <RadioGroup
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label
                      htmlFor="cod"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      Cash on Delivery (COD)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CARD" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "CARD" && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Your payment will be processed securely through Stripe.
                      You&apos;ll be redirected to complete your payment after
                      confirming your order.
                    </p>
                  </div>
                )}

                {paymentMethod === "COD" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Pay with cash when your order is delivered. No additional
                      fees.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="flex gap-2 items-center mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>

                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <div className="overflow-hidden w-16 h-16 bg-gray-100 rounded-lg">
                        <img
                          src={
                            item.product.images?.[0] ||
                            item.product.image ||
                            "/placeholder.svg"
                          }
                          alt={item.product.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleContinueToPayment}
                      className="w-full inline-flex justify-center items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;

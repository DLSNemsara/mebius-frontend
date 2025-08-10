import { Button } from "@/components/ui/button";
import { useGetOrderQuery } from "@/lib/api";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Package,
  MapPin,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Clock,
} from "lucide-react";

function CompletePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex gap-2 items-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading order details...</p>
        </div>
      </main>
    );
  }

  const totalPrice = data.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <main className="py-12 min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto max-w-3xl">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Thank You for Your Order!</h1>
          <p className="text-muted-foreground">
            Order #{data._id} has been successfully placed
          </p>
        </div>

        <div className="space-y-6">
          {/* Order Status Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 items-center text-sm">
                <div className="flex flex-1 gap-2 items-center">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Order Status</p>
                    <p className="capitalize text-muted-foreground">
                      {data.paymentStatus}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 gap-2 items-center">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-muted-foreground">Cash on Delivery</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2 items-center mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Order Details</h2>
              </div>

              <div className="space-y-4">
                {data.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <div className="overflow-hidden w-20 h-20 bg-gray-100 rounded-lg">
                      <img
                        src={
                          item.product.images?.[0] ||
                          item.product.image ||
                          "/placeholder.svg"
                        }
                        alt={item.product.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Dynamic fallback system for image loading issues
                          const currentSrc = e.target.src;

                          // Extract filename and extension
                          const urlParts = currentSrc.split("/");
                          const filename = urlParts[urlParts.length - 1];
                          const [name, ext] = filename.split(".");
                          const basePath = currentSrc.replace(filename, "");

                          // Try multiple fallback strategies in order
                          const fallbackStrategies = [
                            `${name}-1.${ext}`, // product-name-1.ext
                            `${name}_1.${ext}`, // product-name_1.ext
                            `${name}_2.${ext}`, // product-name_2.ext
                            filename.replace(/-/g, "_"), // Replace dashes with underscores
                            filename.toLowerCase(), // Try lowercase
                          ];

                          // Try each fallback strategy
                          let attemptCount = e.target.dataset.attemptCount || 0;
                          attemptCount = parseInt(attemptCount);

                          if (attemptCount < fallbackStrategies.length) {
                            const nextFallback =
                              fallbackStrategies[attemptCount];
                            e.target.dataset.attemptCount = attemptCount + 1;
                            e.target.src = basePath + nextFallback;
                            return;
                          }

                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <div className="flex gap-2 items-center text-sm text-muted-foreground">
                        <span>${item.product.price.toFixed(2)} each</span>
                        <span>•</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card */}
          {data.addressId && (
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-2 items-center mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Delivery Address</h2>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <p>{data.addressId.line_1}</p>
                  <p>{data.addressId.line_2}</p>
                  <p>
                    {data.addressId.city}, {data.addressId.state}{" "}
                    {data.addressId.zip_code}
                  </p>
                  <p className="mt-2">Phone: {data.addressId.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 justify-center pt-4 sm:flex-row">
            <Button asChild size="lg" variant="outline">
              <Link to="/account/orders" className="flex items-center">
                View Order History
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link to="/shop" className="flex items-center">
                Continue Shopping
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Email Notice */}
          <p className="text-sm text-center text-muted-foreground">
            A confirmation email will be sent to your registered email address.
          </p>
        </div>
      </div>
    </main>
  );
}

export default CompletePage;

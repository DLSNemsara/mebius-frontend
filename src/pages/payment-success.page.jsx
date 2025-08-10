import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import { useGetOrderQuery } from "@/lib/api";

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: orderData, error } = useGetOrderQuery(orderId, {
    skip: !orderId,
  });

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      setIsLoading(false);
    }
  }, [orderData]);

  if (isLoading) {
    return (
      <main className="py-12 min-h-screen bg-gray-50">
        <div className="container px-4 mx-auto max-w-2xl">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="py-12 min-h-screen bg-gray-50">
        <div className="container px-4 mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                Order Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                We couldn&apos;t find your order. Please contact support if you
                believe this is an error.
              </p>
              <Link to="/shop">
                <Button>
                  <Home className="mr-2 w-4 h-4" />
                  Return to Shop
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We&apos;ll start processing it right away.
          </p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono text-sm">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Status:</span>
              <span className="capitalize">
                {order.orderStatus.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className="capitalize">
                {order.paymentStatus.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="capitalize">
                {order.paymentMethod.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Items:</span>
              <span>{order.items.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-medium">Order Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve received your order and will begin processing it
                    immediately.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-medium">Processing & Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Your order will be prepared and shipped within 1-2 business
                    days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-medium">Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll receive tracking information once your order
                    ships.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link to="/shop">
            <Button variant="outline">
              <Home className="mr-2 w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link to={`/orders/${order._id}`}>
            <Button>
              View Order Details
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PaymentSuccessPage;

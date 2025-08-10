import { useGetUserOrdersQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  Calendar,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

function OrdersPage() {
  const { data: orders, isLoading, error } = useGetUserOrdersQuery();

  if (isLoading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex gap-2 items-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-12 min-h-screen bg-gray-50">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center">
            <XCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold">Error Loading Orders</h1>
            <p className="mb-4 text-muted-foreground">
              We couldn&apos;t load your orders. Please try again later.
            </p>
            <Button asChild>
              <Link to="/account">Back to Account</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CONFIRMED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "SHIPPED":
        return <Truck className="w-4 h-4" />;
      case "DELIVERED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <main className="py-12 min-h-screen bg-gray-50">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your order history
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/account" className="flex items-center">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Account
            </Link>
          </Button>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">No Orders Yet</h2>
            <p className="max-w-md text-center text-muted-foreground">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const totalPrice = order.items.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              );
              const orderDate = order.createdAt
                ? new Date(order.createdAt)
                : new Date();

              return (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50/50">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <CardTitle className="flex gap-2 items-center text-lg">
                          <Package className="w-5 h-5" />
                          Order #{order._id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <div className="flex gap-4 items-center mt-2 text-sm text-muted-foreground">
                          <div className="flex gap-1 items-center">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {order.createdAt && !isNaN(orderDate)
                                ? format(orderDate, "MMM dd, yyyy 'at' hh:mm a")
                                : "Date not available"}
                            </span>
                          </div>
                          <div className="flex gap-1 items-center">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {order.addressId?.city}, {order.addressId?.state}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Badge
                          variant="outline"
                          className={getStatusColor(order.orderStatus)}
                        >
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1">{order.orderStatus}</span>
                        </Badge>
                        {order.paymentStatus !== order.orderStatus && (
                          <Badge
                            variant="outline"
                            className={getPaymentStatusColor(
                              order.paymentStatus
                            )}
                          >
                            <span>Payment: {order.paymentStatus}</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <div className="overflow-hidden w-16 h-16 bg-gray-100 rounded-lg">
                            <img
                              src={
                                item.product.image ||
                                item.product.images?.[0] ||
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
                                const basePath = currentSrc.replace(
                                  filename,
                                  ""
                                );

                                // Try multiple fallback strategies in order
                                const fallbackStrategies = [
                                  `${name}-1.${ext}`, // product-name-1.ext
                                  `${name}_1.${ext}`, // product-name_1.ext
                                  `${name}_2.${ext}`, // product-name_2.ext
                                  filename.replace(/-/g, "_"), // Replace dashes with underscores
                                  filename.toLowerCase(), // Try lowercase
                                ];

                                // Try each fallback strategy
                                let attemptCount =
                                  e.target.dataset.attemptCount || 0;
                                attemptCount = parseInt(attemptCount);

                                if (attemptCount < fallbackStrategies.length) {
                                  const nextFallback =
                                    fallbackStrategies[attemptCount];
                                  e.target.dataset.attemptCount =
                                    attemptCount + 1;
                                  e.target.src = basePath + nextFallback;
                                  return;
                                }

                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <div className="flex gap-2 items-center text-sm text-muted-foreground">
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
                      ))}

                      <Separator />

                      {/* Order Summary */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/shop/complete?orderId=${order._id}`}>
                              View Details
                            </Link>
                          </Button>
                          {order.orderStatus === "SHIPPED" && (
                            <Button variant="outline" size="sm">
                              Track Package
                            </Button>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold">
                            ${totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default OrdersPage;

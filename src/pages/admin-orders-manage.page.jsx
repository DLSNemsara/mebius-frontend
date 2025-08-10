import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShoppingCart,
  ArrowLeft,
  Eye,
  Edit,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertCircle,
  Loader2,
  User,
  MapPin,
} from "lucide-react";

const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: Package,
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const PAYMENT_STATUS_CONFIG = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
};

function AdminOrdersManagePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");

  const { data: ordersData, isLoading } = useGetAllOrdersQuery({
    status: statusFilter,
    page: 1,
    limit: 50,
  });
  const { data: stats } = useGetOrderStatsQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || {};

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStatusUpdate = async () => {
    if (!editingOrder) return;

    try {
      const updateData = {};
      if (newOrderStatus) updateData.orderStatus = newOrderStatus;
      if (newPaymentStatus) updateData.paymentStatus = newPaymentStatus;

      await updateOrderStatus({
        orderId: editingOrder._id,
        ...updateData,
      }).unwrap();

      toast.success("Order status updated successfully!");
      setEditingOrder(null);
      setNewOrderStatus("");
      setNewPaymentStatus("");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrderStatus(order.orderStatus);
    setNewPaymentStatus(order.paymentStatus);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex gap-4 items-center mb-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Order Management
        </h1>
        <p className="text-gray-600">
          Track and manage customer orders and their status
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Delivered Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.deliveredOrders}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <ShoppingCart className="w-5 h-5" />
              Orders Overview
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium">Filter by Status:</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">
            Showing {orders.length} of {pagination.totalOrders} orders
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="w-full h-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No orders found
            </h3>
            <p className="text-gray-600">
              {statusFilter === "all"
                ? "No orders have been placed yet"
                : `No ${statusFilter.toLowerCase()} orders found`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderTotal = calculateOrderTotal(order.items);
            const StatusIcon = ORDER_STATUS_CONFIG[order.orderStatus].icon;

            return (
              <Card key={order._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <Badge
                          className={
                            ORDER_STATUS_CONFIG[order.orderStatus].color
                          }
                        >
                          <StatusIcon className="mr-1 w-3 h-3" />
                          {ORDER_STATUS_CONFIG[order.orderStatus].label}
                        </Badge>
                        <Badge
                          className={
                            PAYMENT_STATUS_CONFIG[order.paymentStatus].color
                          }
                        >
                          {PAYMENT_STATUS_CONFIG[order.paymentStatus].label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-gray-600">Customer ID</p>
                          <p className="font-medium">{order.userId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-medium">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-lg font-bold text-green-600">
                            ${orderTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-600">
                          Items ({order.items.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <Badge key={index} variant="outline">
                              {item.product.name} x{item.quantity}
                            </Badge>
                          ))}
                          {order.items.length > 3 && (
                            <Badge variant="outline">
                              +{order.items.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Dialog
                      open={selectedOrder?._id === order._id}
                      onOpenChange={(open) => {
                        if (!open) setSelectedOrder(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="mr-2 w-4 h-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Order Details #{order._id.slice(-8)}
                          </DialogTitle>
                          <DialogDescription>
                            Complete order information and customer details
                          </DialogDescription>
                        </DialogHeader>

                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Order Status */}
                            <div className="flex gap-4 items-center">
                              <Badge
                                className={
                                  ORDER_STATUS_CONFIG[selectedOrder.orderStatus]
                                    .color
                                }
                              >
                                <StatusIcon className="mr-1 w-3 h-3" />
                                {
                                  ORDER_STATUS_CONFIG[selectedOrder.orderStatus]
                                    .label
                                }
                              </Badge>
                              <Badge
                                className={
                                  PAYMENT_STATUS_CONFIG[
                                    selectedOrder.paymentStatus
                                  ].color
                                }
                              >
                                {
                                  PAYMENT_STATUS_CONFIG[
                                    selectedOrder.paymentStatus
                                  ].label
                                }
                              </Badge>
                            </div>

                            {/* Customer & Order Info */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              <div>
                                <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                                  <User className="w-5 h-5" />
                                  Customer Information
                                </h4>
                                <div className="space-y-2">
                                  <p>
                                    <span className="font-medium">
                                      Customer ID:
                                    </span>{" "}
                                    {selectedOrder.userId}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Order Date:
                                    </span>{" "}
                                    {formatDate(selectedOrder.createdAt)}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Last Updated:
                                    </span>{" "}
                                    {formatDate(selectedOrder.updatedAt)}
                                  </p>
                                </div>
                              </div>

                              {selectedOrder.addressId && (
                                <div>
                                  <h4 className="flex gap-2 items-center mb-3 text-lg font-semibold">
                                    <MapPin className="w-5 h-5" />
                                    Shipping Address
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <p>{selectedOrder.addressId.fullName}</p>
                                    <p>
                                      {selectedOrder.addressId.streetAddress}
                                    </p>
                                    <p>
                                      {selectedOrder.addressId.city},{" "}
                                      {selectedOrder.addressId.state}{" "}
                                      {selectedOrder.addressId.zipCode}
                                    </p>
                                    <p>{selectedOrder.addressId.country}</p>
                                    {selectedOrder.addressId.phoneNumber && (
                                      <p>
                                        Phone:{" "}
                                        {selectedOrder.addressId.phoneNumber}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="flex gap-2 items-center mb-4 text-lg font-semibold">
                                <Package className="w-5 h-5" />
                                Order Items
                              </h4>
                              <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-4 rounded-lg border"
                                  >
                                    <div className="flex gap-4 items-center">
                                      <div className="flex overflow-hidden justify-center items-center w-16 h-16 bg-gray-100 rounded-lg">
                                        {item.product.image ? (
                                          <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="object-cover w-full h-full"
                                          />
                                        ) : (
                                          <Package className="w-8 h-8 text-gray-400" />
                                        )}
                                      </div>
                                      <div>
                                        <h5 className="font-semibold">
                                          {item.product.name}
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                          {item.product.description}
                                        </p>
                                        <p className="text-sm font-medium">
                                          ${item.product.price} x{" "}
                                          {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold">
                                        $
                                        {(
                                          item.product.price * item.quantity
                                        ).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Total */}
                            <div className="pt-4 border-t">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                  Order Total:
                                </span>
                                <span className="text-2xl font-bold text-green-600">
                                  $
                                  {calculateOrderTotal(
                                    selectedOrder.items
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={editingOrder?._id === order._id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingOrder(null);
                          setNewOrderStatus("");
                          setNewPaymentStatus("");
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="mr-2 w-4 h-4" />
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Order Status</DialogTitle>
                          <DialogDescription>
                            Change the order and payment status for order #
                            {order._id.slice(-8)}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-4 space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Order Status
                            </label>
                            <Select
                              value={newOrderStatus}
                              onValueChange={setNewOrderStatus}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                <SelectItem value="DELIVERED">
                                  Delivered
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Payment Status
                            </label>
                            <Select
                              value={newPaymentStatus}
                              onValueChange={setNewPaymentStatus}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingOrder(null);
                              setNewOrderStatus("");
                              setNewPaymentStatus("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleStatusUpdate}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Status"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default AdminOrdersManagePage;

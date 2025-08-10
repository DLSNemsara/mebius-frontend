import { Navigate } from "react-router";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useGetUserOrdersQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  Settings,
  LogOut,
  Loader2,
  ShoppingBag,
  Clock,
  Star,
  CheckCircle,
  TrendingUp,
  Calendar,
  Shield,
  Award,
  Activity,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { data: orders = [] } = useGetUserOrdersQuery();

  if (!isLoaded) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex gap-3 items-center text-gray-600">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-lg font-medium">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  // Calculate account statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (order) => order.orderStatus === "DELIVERED"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "PENDING"
  ).length;
  const recentOrders = orders.slice(0, 3);

  // Account stats for dashboard
  const accountStats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Lifetime orders",
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Successfully delivered",
    },
    {
      title: "Member Since",
      value: user?.createdAt ? new Date(user.createdAt).getFullYear() : "2024",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Year joined",
    },
    {
      title: "Account Status",
      value: "Active",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Verified member",
    },
  ];

  const quickActions = [
    {
      title: "Order History",
      description: `View all ${totalOrders} orders and track deliveries`,
      icon: Package,
      href: "/account/orders",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "Continue Shopping",
      description: "Discover new products in our catalog",
      icon: ShoppingBag,
      href: "/shop",
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
    },
  ];

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      CONFIRMED: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
      SHIPPED: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      DELIVERED: { color: "bg-green-100 text-green-800", label: "Delivered" },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <main className="py-8 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Welcome back, {user?.firstName || user?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-xl text-gray-600">
            Manage your account and track your orders
          </p>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {accountStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="overflow-hidden relative transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="mb-1 text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {stat.description}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full ${stat.bgColor} shadow-sm`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Information */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex gap-3 items-center text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="flex gap-2 items-center">
                      <p className="text-lg font-medium text-gray-900">
                        {user?.fullName}
                      </p>
                      {user?.publicMetadata?.role === "admin" && (
                        <Badge className="text-white bg-gradient-to-r from-purple-500 to-pink-500">
                          <Award className="mr-1 w-3 h-3" />
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Member Since
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Account Status
                    </label>
                    <div className="flex gap-2">
                      <Badge className="text-green-800 bg-green-100">
                        <CheckCircle className="mr-1 w-3 h-3" />
                        Active
                      </Badge>
                      <Badge className="text-blue-800 bg-blue-100">
                        <Shield className="mr-1 w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex gap-3 items-center text-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    Recent Orders
                  </CardTitle>
                  {totalOrders > 0 && (
                    <Link to="/account/orders">
                      <Button variant="outline" size="sm">
                        View All ({totalOrders})
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      No orders yet
                    </h3>
                    <p className="mb-6 text-gray-600">
                      Start shopping to see your order history here.
                    </p>
                    <Link to="/shop">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <ShoppingBag className="mr-2 w-4 h-4" />
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex gap-4 items-center">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Package className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Order #{order._id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""} •
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-center">
                          {getOrderStatusBadge(order.orderStatus)}
                          <Link to="/account/orders">
                            <Button variant="outline" size="sm">
                              <Activity className="mr-2 w-4 h-4" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex gap-3 items-center text-lg">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.href}>
                      <div
                        className={`p-4 rounded-lg border-2 border-gray-200 transition-all duration-200 ${action.hoverColor} hover:border-gray-300 hover:shadow-md cursor-pointer`}
                      >
                        <div className="flex gap-3 items-start">
                          <div className={`p-2 rounded-lg ${action.bgColor}`}>
                            <Icon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-gray-900">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex gap-3 items-center text-lg">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Settings className="w-5 h-5 text-red-600" />
                  </div>
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user?.publicMetadata?.role === "admin" && (
                  <Link to="/admin">
                    <Button className="w-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Settings className="mr-2 w-4 h-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center items-center mx-auto mb-3 w-12 h-12 bg-blue-100 rounded-full">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Account Summary
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">{totalOrders}</span> total
                      orders
                    </p>
                    <p>
                      <span className="font-medium">{completedOrders}</span>{" "}
                      completed orders
                    </p>
                    {pendingOrders > 0 && (
                      <p>
                        <span className="font-medium text-orange-600">
                          {pendingOrders}
                        </span>{" "}
                        pending orders
                      </p>
                    )}
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

export default AccountPage;

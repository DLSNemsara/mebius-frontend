import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetOrderStatsQuery,
} from "@/lib/api";
import {
  Package,
  Plus,
  BarChart3,
  Users,
  ShoppingCart,
  FolderOpen,
} from "lucide-react";

function AdminDashboardPage() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: orderStats } = useGetOrderStatsQuery();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Orders",
      value: orderStats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Users",
      value: "-", // You can implement user count if needed
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <main className="container px-4 py-8 mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage your e-commerce platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {isLoading ? "..." : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Package className="w-5 h-5" />
              Product Management
            </CardTitle>
            <CardDescription>
              Add new products and manage existing inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/admin/products/create">
              <Button className="w-full">
                <Plus className="mr-2 w-4 h-4" />
                Create New Product
              </Button>
            </Link>
            <Link to="/admin/products/manage">
              <Button variant="outline" className="w-full">
                Manage Products
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <FolderOpen className="w-5 h-5" />
              Category Management
            </CardTitle>
            <CardDescription>Organize products with categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/admin/categories/manage">
              <Button className="w-full">
                <FolderOpen className="mr-2 w-4 h-4" />
                Manage Categories
              </Button>
            </Link>
            <div className="text-sm text-center text-gray-600">
              {categories.length} categories created
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <ShoppingCart className="w-5 h-5" />
              Order Management
            </CardTitle>
            <CardDescription>Track and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/admin/orders/manage">
              <Button className="w-full">
                <ShoppingCart className="mr-2 w-4 h-4" />
                Manage Orders
              </Button>
            </Link>
            <div className="space-y-2 text-sm text-center text-gray-600">
              <div>{orderStats?.totalOrders || 0} total orders</div>
              <div>{orderStats?.pendingOrders || 0} pending orders</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Latest products in your catalog</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length > 0 ? (
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex gap-4 items-center p-4 rounded-lg border"
                >
                  <div className="flex overflow-hidden justify-center items-center w-16 h-16 bg-gray-100 rounded-lg">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">${product.price}</p>
                    <p className="text-xs text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
              ))}
              {products.length > 5 && (
                <p className="pt-4 text-sm text-center text-gray-500">
                  And {products.length - 5} more products...
                </p>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No products yet
              </h3>
              <p className="mb-4 text-gray-600">
                Start by creating your first product
              </p>
              <Link to="/admin/products/create">
                <Button>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Your First Product
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default AdminDashboardPage;

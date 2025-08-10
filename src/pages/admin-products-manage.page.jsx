import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useGetCategoriesQuery,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  Eye,
} from "lucide-react";

function AdminProductsManagePage() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Scroll to top when component mounts (useful after navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "stock":
          return a.stock - b.stock;
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const handleDeleteProduct = async (productId, productName) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success(`Product "${productName}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || "Unknown";
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
          Manage Products
        </h1>
        <p className="text-gray-600">
          View, edit, and delete products in your catalog
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price">Price (Low-High)</SelectItem>
                  <SelectItem value="stock">Stock (Low-High)</SelectItem>
                  <SelectItem value="created">Recently Added</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Link to="/admin/products/create" className="w-full">
                <Button className="w-full">
                  <Plus className="mr-2 w-4 h-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-4 w-full h-48 bg-gray-200 rounded-lg"></div>
                <div className="mb-2 h-4 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No products found
            </h3>
            <p className="mb-4 text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Start by creating your first product"}
            </p>
            <Link to="/admin/products/create">
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                Create Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="overflow-hidden">
                <div className="overflow-hidden relative w-full bg-gray-100 aspect-video">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant={product.stock > 0 ? "default" : "destructive"}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mb-2 text-2xl font-bold text-primary">
                      ${product.price}
                    </p>
                    <Badge variant="outline" className="mb-2">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/shop/product/${product._id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-2 w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{product.name}
                            &quot;? This action cannot be undone and will
                            permanently remove the product from your catalog.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteProduct(product._id, product.name)
                            }
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Product
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default AdminProductsManagePage;

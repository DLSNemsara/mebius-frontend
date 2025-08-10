import { useState, useMemo, useEffect } from "react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ProductCards from "@/pages/home/components/ProductCards";
import Tab from "@/pages/home/components/Tab";

// Import Dropdown Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ArrowUpDown,
  Check,
  Search,
  ShoppingBag,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";

function ShopPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [sortOrder, setSortOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch products and categories using Redux Toolkit Query
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useGetCategoriesQuery();

  // Process categories: Exclude "ALL" if it exists, then prepend a manual "All" category
  const sortedCategories = useMemo(() => {
    if (!categories) return [];
    const filteredCategories = categories.filter((cat) => cat._id !== "ALL");
    return [{ _id: "ALL", name: "All" }, ...filteredCategories];
  }, [categories]);

  // Process products: Filter by category, search, and sort
  const processedProducts = useMemo(() => {
    if (!products) return [];

    let filteredProducts = products;

    // Filter by category
    if (selectedCategoryId !== "ALL") {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === selectedCategoryId
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.shortDescription
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    return sortOrder
      ? [...filteredProducts].sort((a, b) =>
          sortOrder === "asc" ? a.price - b.price : b.price - a.price
        )
      : filteredProducts;
  }, [products, selectedCategoryId, sortOrder, searchQuery]);

  const handleCategoryChange = (categoryId) =>
    setSelectedCategoryId(categoryId);
  const handleSort = (order) =>
    setSortOrder(order === sortOrder ? null : order);

  // Sort Options for Dropdown
  const sortOptions = [
    { label: "Featured", value: null, icon: ArrowUpDown },
    { label: "Price: Low to High", value: "asc", icon: ArrowUpNarrowWide },
    { label: "Price: High to Low", value: "desc", icon: ArrowDownWideNarrow },
  ];

  // Find the currently selected sort option
  const currentSort =
    sortOptions.find((option) => option.value === sortOrder) || sortOptions[0];

  // Loading state
  if (isProductsLoading || isCategoriesLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold">Shop</h1>
        <div className="animate-pulse">
          <div className="mb-4 w-48 h-8 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isProductsError || isCategoriesError) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <h1 className="mb-6 text-4xl font-bold text-gray-800">Shop</h1>
        <Separator className="mb-4" />

        <div className="p-6 mx-auto max-w-md bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-700">
            We couldn’t load the shop data. Please check back later.
          </p>

          {isProductsError && (
            <p className="mt-2 text-sm text-gray-500">
              Products error:{" "}
              {productsError?.message || "Unable to load products."}
            </p>
          )}

          {isCategoriesError && (
            <p className="mt-1 text-sm text-gray-500">
              Categories error:{" "}
              {categoriesError?.message || "Unable to load categories."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Shop Hero Section */}
      <section className="overflow-hidden relative py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] opacity-20"></div>

        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex gap-3 justify-center items-center mb-4">
              <ShoppingBag className="w-12 h-12 text-white" />
              <h1 className="text-5xl font-bold text-white md:text-6xl">
                Shop
              </h1>
            </div>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-blue-100">
              Discover our premium collection of {products?.length || 0}+
              cutting-edge tech products
            </p>

            {/* Search Bar */}
            <div className="relative mx-auto max-w-md">
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 pr-4 pl-10 w-full placeholder-gray-500 text-gray-900 rounded-full backdrop-blur-sm transition-all duration-300 bg-white/90 border-white/20 focus:bg-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        {/* Filter & Sort Section */}
        <motion.div
          className="p-6 mb-8 bg-white rounded-2xl border border-gray-100 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Categories */}
            <div className="flex-1">
              <div className="flex gap-3 items-center mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Categories
                </h3>
                {searchQuery && (
                  <span className="text-sm text-gray-500">
                    ({processedProducts.length} results for &ldquo;{searchQuery}
                    &rdquo;)
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {isCategoriesLoading
                  ? [...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="w-20 h-9 bg-gray-200 rounded-full animate-pulse"
                      />
                    ))
                  : sortedCategories.map((category) => (
                      <motion.div
                        key={category._id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tab
                          _id={category._id}
                          selectedCategoryId={selectedCategoryId}
                          name={category.name}
                          onTabClick={handleCategoryChange}
                        />
                      </motion.div>
                    ))}
              </div>
            </div>

            {/* Sort Controls */}
            <div className="lg:w-64">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Sort By
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-between w-full h-11 rounded-full border-2 transition-colors hover:border-blue-500"
                  >
                    <div className="flex gap-2 items-center">
                      <currentSort.icon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">{currentSort.label}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value || "featured"}
                      onClick={() => handleSort(option.value)}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex gap-3 items-center">
                        <option.icon className="w-4 h-4 text-gray-600" />
                        <span>{option.label}</span>
                      </div>
                      {sortOrder === option.value && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* Products Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {processedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag className="mx-auto mb-4 w-16 h-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchQuery ? "No products found" : "No products available"}
              </h3>
              <p className="mb-6 text-gray-500">
                {searchQuery
                  ? `Try adjusting your search "${searchQuery}" or browse different categories.`
                  : "Check back later for new products."}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="rounded-full"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategoryId === "ALL"
                    ? "All Products"
                    : sortedCategories.find(
                        (cat) => cat._id === selectedCategoryId
                      )?.name || "Products"}
                </h2>
                <span className="text-gray-500">
                  {processedProducts.length} product
                  {processedProducts.length !== 1 ? "s" : ""}
                </span>
              </div>
              <ProductCards products={processedProducts} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ShopPage;

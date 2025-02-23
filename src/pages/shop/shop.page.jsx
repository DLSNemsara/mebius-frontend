import { useState, useMemo } from "react";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

function ShopPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [sortOrder, setSortOrder] = useState(null);

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

  // Process products: Filter by category & sort by price
  const processedProducts = useMemo(() => {
    if (!products) return [];

    let filteredProducts =
      selectedCategoryId === "ALL"
        ? products
        : products.filter(
            (product) => product.categoryId === selectedCategoryId
          );

    return sortOrder
      ? [...filteredProducts].sort((a, b) =>
          sortOrder === "asc" ? a.price - b.price : b.price - a.price
        )
      : filteredProducts;
  }, [products, selectedCategoryId, sortOrder]);

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
          <div className="w-48 h-8 mb-4 bg-gray-200 rounded"></div>
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

        <div className="max-w-md p-6 mx-auto bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
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
    <>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-4xl font-bold">Shop</h1>
        <Separator className="my-6" />

        {/* Categories & Sorting Section */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {isCategoriesLoading
              ? // Loading Skeleton for Categories
                [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-8 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))
              : sortedCategories.map((category) => (
                  <Tab
                    key={category._id}
                    _id={category._id}
                    selectedCategoryId={selectedCategoryId}
                    name={category.name}
                    onTabClick={handleCategoryChange}
                  />
                ))}
          </div>

          {/* Sorting Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between">
                <div className="flex items-center gap-2">
                  <currentSort.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{currentSort.label}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "featured"}
                  onClick={() => handleSort(option.value)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4 text-muted-foreground" />
                    <span>{option.label}</span>
                  </div>
                  {sortOrder === option.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Products Display */}
        {processedProducts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <ProductCards products={processedProducts} />
        )}
      </div>
    </>
  );
}

export default ShopPage;

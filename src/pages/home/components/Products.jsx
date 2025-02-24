import ProductCards from "./ProductCards";
import Tab from "./Tab";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Skeleton } from "../../../components/ui/skeleton";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/lib/api";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ArrowUp, ArrowDown, Filter } from "lucide-react";

function Products() {
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

  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [sortOrder, setSortOrder] = useState(null);

  const filteredProducts =
    selectedCategoryId === "ALL"
      ? (products ?? [])
      : (products?.filter(
          (product) => product.categoryId === selectedCategoryId
        ) ?? []);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "asc") return parseFloat(a.price) - parseFloat(b.price);
    if (sortOrder === "desc") return parseFloat(b.price) - parseFloat(a.price);
    return 0;
  });

  const handleTabClick = (_id) => {
    setSelectedCategoryId(_id);
  };

  const sortOptions = [
    { label: "Default", value: "", icon: Filter },
    { label: "Price: Low to High", value: "asc", icon: ArrowUp },
    { label: "Price: High to Low", value: "desc", icon: ArrowDown },
  ];

  const handleSort = (value) => {
    setSortOrder(value);
  };

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="flex items-center gap-4 mt-4">
          {isCategoriesLoading && (
            <>
              <Skeleton className="w-24 h-8 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
            </>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </section>
    );
  }

  if (isProductsError || isCategoriesError) {
    return (
      <section className="px-8 py-8 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">
          Something went wrong
        </h2>
        <Separator className="mt-2" />

        <div className="max-w-md p-4 mx-auto mt-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-gray-700">
            We couldn’t load the data. Please try again later.
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

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-md hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />

      <div className="flex flex-col items-center justify-between gap-4 mt-4 sm:flex-row">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center w-full gap-2 sm:gap-4 sm:justify-start sm:w-auto">
          {[{ _id: "ALL", name: "All" }, ...(categories ?? [])].map(
            (category) => (
              <Tab
                key={category._id}
                _id={category._id}
                selectedCategoryId={selectedCategoryId}
                name={category.name}
                onTabClick={handleTabClick}
              />
            )
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex justify-center w-full sm:w-auto sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between">
                <div className="flex items-center gap-2">
                  {sortOptions.find((opt) => opt.value === sortOrder)?.icon &&
                    React.createElement(
                      sortOptions.find((opt) => opt.value === sortOrder).icon,
                      { className: "w-4 h-4 text-muted-foreground" }
                    )}
                  <span>
                    {sortOptions.find((opt) => opt.value === sortOrder)
                      ?.label || "Sort by: Default"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value || "default"}
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
      </div>

      <ProductCards products={sortedProducts} />
    </section>
  );
}

export default Products;

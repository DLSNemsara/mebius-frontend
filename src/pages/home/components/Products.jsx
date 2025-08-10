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
import { motion } from "framer-motion";

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
        <div className="flex gap-4 items-center mt-4">
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

        <div className="p-4 mx-auto mt-6 max-w-md bg-gray-100 rounded-lg border border-gray-200 shadow-sm">
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
            className="px-4 py-2 mt-4 text-sm font-medium text-white bg-gray-900 rounded-md transition-all hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 xl:px-14">
      <div className="container mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Our Top Products
          </motion.h2>
          <motion.div
            className="mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          />
          <motion.p
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Discover our carefully curated selection of premium tech products
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6 justify-between items-center mb-8 lg:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center w-full sm:gap-3 lg:justify-start lg:w-auto">
            {[{ _id: "ALL", name: "All" }, ...(categories ?? [])].map(
              (category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Tab
                    _id={category._id}
                    selectedCategoryId={selectedCategoryId}
                    name={category.name}
                    onTabClick={handleTabClick}
                  />
                </motion.div>
              )
            )}
          </div>

          {/* Sorting Dropdown */}
          <motion.div
            className="flex justify-center w-full lg:w-auto lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  <div className="flex gap-2 items-center">
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
                    className="flex justify-between items-center"
                  >
                    <div className="flex gap-2 items-center">
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
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <ProductCards products={sortedProducts} />
        </motion.div>
      </div>
    </section>
  );
}

export default Products;

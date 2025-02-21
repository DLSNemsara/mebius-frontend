import ProductCards from "./ProductCards";
import Tab from "./Tab";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Skeleton } from "./components/ui/skeleton";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/lib/api";

function Products(props) {
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
  const [sortOrder, setSortOrder] = useState(null); // New state for sorting order

  const filteredProducts =
    selectedCategoryId === "ALL"
      ? (products ?? [])
      : (products.filter(
          (product) => product.categoryId === selectedCategoryId
        ) ?? []);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "asc") return parseFloat(a.price) - parseFloat(b.price);
    if (sortOrder === "desc") return parseFloat(b.price) - parseFloat(a.price);
    return 0; // No sorting by default
  });

  const handleTabClick = (_id) => {
    setSelectedCategoryId(_id);
  };

  const handleSortAscending = () => {
    setSortOrder("asc");
  };

  const handleSortDescending = () => {
    setSortOrder("desc");
  };

  // Display loading spinner while fetching data
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

        <div className="flex gap-4 mt-4">
          {/* Sorting buttons */}
          <button
            onClick={handleSortAscending}
            className="px-3 py-1 text-white bg-[#505258] rounded-md hover:bg-[#3e4042]"
          >
            Sort by Price: Ascending
          </button>
          <button
            onClick={handleSortDescending}
            className="px-3 py-1 text-white bg-[#505258] rounded-md hover:bg-[#3e4042] transition-transform"
          >
            Sort by Price: Descending
          </button>
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
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="flex items-center gap-4 mt-4"></div>
        <div className="flex gap-4 mt-4">
          {/* Sorting buttons */}
          <button
            onClick={handleSortAscending}
            className="px-3 py-1 text-white bg-[#505258] rounded-md hover:bg-[#3e4042]"
          >
            Sort by Price: Ascending
          </button>
          <button
            onClick={handleSortDescending}
            className="px-3 py-1 text-white bg-[#505258] rounded-md hover:bg-[#3e4042] transition-transform"
          >
            Sort by Price: Descending
          </button>
        </div>
        <div className="mt-4 text-center text-red-500">
          <p className="text-lg font-semibold">
            Oops! Something went wrong while loading the data.
          </p>
          <p>
            {`${productsError?.message || "Something went wrong while loading products."}`}
            <br />
            {`${categoriesError?.message || "Something went wrong while loading categories."}`}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />

      {/* Category Tabs and Sorting Dropdown */}
      <div className="flex flex-col items-center justify-between gap-4 mt-4 sm:flex-row">
        {/* Category Tabs (Left-aligned) */}
        <div className="flex flex-wrap justify-center w-full gap-2 sm:gap-4 sm:justify-start sm:w-auto">
          {[...(categories ?? []), { _id: "ALL", name: "All" }].map(
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

        {/* Sorting Dropdown (Right-aligned) */}
        <div className="flex justify-center w-full sm:w-auto sm:justify-end">
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder || ""}
            className="w-full px-3 py-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 sm:w-auto"
          >
            <option value="">Sort by: Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <ProductCards products={sortedProducts} />
    </section>
  );
}

export default Products;

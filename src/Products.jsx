import ProductCards from "./ProductCards";
import Tab from "./Tab";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "./lib/api";
import { Skeleton } from "./components/ui/skeleton";

function Products(props) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [sortOrder, setSortOrder] = useState(null); // New state for sorting order
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [productsError, setProductsError] = useState({
    isError: false,
    message: "",
  });
  const [categoriesError, setCategoriesError] = useState({
    isError: false,
    message: "",
  });

  const filteredProducts =
    selectedCategoryId === "ALL"
      ? products
      : products.filter((product) => product.categoryId === selectedCategoryId);

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

  // useEffect(() => {
  //   getProducts()
  //     .then((productData) => {
  //       setProducts(productData);
  //       return getCategories();
  //     })
  //     .then((categoryData) => {
  //       setCategories([{ _id: "ALL", name: "All" }, ...categoryData]);
  //     })
  //     .catch((error) => {
  //       if (error.message.includes("products")) {
  //         setProductsError({ isError: true, message: error.message });
  //       } else if (error.message.includes("categories")) {
  //         setCategoriesError({ isError: true, message: error.message });
  //       }
  //     })
  //     .finally(() => {
  //       setIsProductsLoading(false);
  //       setIsCategoriesLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    // Set loading states before fetching data
    setIsProductsLoading(true);
    setIsCategoriesLoading(true);

    getProducts()
      .then((productData) => {
        setProducts(productData);
      })
      .catch((error) => {
        setProductsError({ isError: true, message: error.message });
      })
      .finally(() => {
        setIsProductsLoading(false);
      });

    getCategories()
      .then((categoryData) => {
        setCategories([{ _id: "ALL", name: "All" }, ...categoryData]);
      })
      .catch((error) => {
        setCategoriesError({ isError: true, message: error.message });
      })
      .finally(() => {
        setIsCategoriesLoading(false);
      });
  }, []);

  // Display loading spinner while fetching data
  if (isProductsLoading || isCategoriesLoading) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="flex items-center gap-4 mt-4">
          {isCategoriesLoading ? (
            <>
              <Skeleton className="w-24 h-8 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
            </>
          ) : (
            categories.map((category) => (
              <Tab
                key={category._id}
                _id={category._id}
                selectedCategoryId={selectedCategoryId}
                name={category.name}
                onTabClick={handleTabClick}
              />
            ))
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

  // if (productsError.isError || categoriesError.isError) {
  //   return (
  //     <section className="px-8 py-8">
  //       <h2 className="text-4xl font-bold">Our Top Products</h2>
  //       <Separator className="mt-2" />
  //       <div className="flex items-center gap-4 mt-4">
  //         {categories.map((category) => (
  //           <Tab
  //             key={category._id}
  //             _id={category._id}
  //             selectedCategoryId={selectedCategoryId}
  //             name={category.name}
  //             onTabClick={handleTabClick}
  //           />
  //         ))}
  //       </div>
  //       <div className="flex gap-4 mt-4">
  //         {/* Sorting buttons */}
  //         <button
  //           onClick={handleSortAscending}
  //           className="px-3 py-1 text-white bg-[#505258] rounded-md hover:bg-[#3e4042]"
  //         >
  //           Sort by Price: Ascending
  //         </button>
  //         <button
  //           onClick={handleSortDescending}
  //           className="px-3 py-1 text-white bg-[#505258] rounded-md hover:bg-[#3e4042] transition-transform"
  //         >
  //           Sort by Price: Descending
  //         </button>
  //       </div>
  //       <div className="mt-4">
  //         <p className="text-red-500">
  //           {productsError.message || categoriesError.message}
  //         </p>
  //       </div>{" "}
  //     </section>
  //   );
  // }
  if (productsError.isError || categoriesError.isError) {
    return (
      <section className="px-8 py-8">
        <h2 className="text-4xl font-bold">Our Top Products</h2>
        <Separator className="mt-2" />
        <div className="flex items-center gap-4 mt-4">
          {categories.map((category) => (
            <Tab
              key={category._id}
              _id={category._id}
              selectedCategoryId={selectedCategoryId}
              name={category.name}
              onTabClick={handleTabClick}
            />
          ))}
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
        <div className="mt-4 text-center text-red-500">
          <p className="text-lg font-semibold">
            Oops! Something went wrong while loading the data.
          </p>
          <p>{productsError.message || categoriesError.message}</p>
          {/* Retry button */}
          <button
            onClick={() => {
              setIsProductsLoading(true);
              setIsCategoriesLoading(true);
              setProductsError({ isError: false, message: "" });
              setCategoriesError({ isError: false, message: "" });
              getProducts()
                .then((productData) => {
                  setProducts(productData);
                })
                .catch((error) => {
                  setProductsError({ isError: true, message: error.message });
                })
                .finally(() => {
                  setIsProductsLoading(false);
                });

              getCategories()
                .then((categoryData) => {
                  setCategories([{ _id: "ALL", name: "All" }, ...categoryData]);
                })
                .catch((error) => {
                  setCategoriesError({ isError: true, message: error.message });
                })
                .finally(() => {
                  setIsCategoriesLoading(false);
                });
            }}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-500"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-8">
      <h2 className="text-4xl font-bold">Our Top Products</h2>
      <Separator className="mt-2" />
      <div className="flex items-center gap-4 mt-4">
        {categories.map((category) => (
          <Tab
            key={category._id}
            _id={category._id}
            selectedCategoryId={selectedCategoryId}
            name={category.name}
            onTabClick={handleTabClick}
          />
        ))}
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
      <ProductCards
        handleAddToCart={props.handleAddToCart}
        products={sortedProducts}
      />
    </section>
  );
}

export default Products;

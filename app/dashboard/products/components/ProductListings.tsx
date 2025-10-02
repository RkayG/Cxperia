// src/components/ProductDashboard/ProductListings.tsx
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FilterBar from "./FilterBar";
import ProductCard from "./ProductCard";
import type { Product, ProductListingsProps } from "./productTypes";

interface ProductListingsPropsWithEdit extends ProductListingsProps {
  onEditExperience?: (exp: any) => void;
  isLoading?: boolean;
}

// Skeleton count for loading state
const LOADING_SKELETON_COUNT = 6;

const ProductListings: React.FC<ProductListingsPropsWithEdit> = ({
  products: initialProducts,
  isLoading = false,
}) => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [products, _setProducts] = useState<Product[]>(initialProducts); // Internal state for products
  const router = useRouter();

  const handleAddNewProduct = () => {
    // Navigate to the product creation page or open a modal
    router.push("/dashboard/experience/create?step=product-details&new=true");
  };

  // Get unique categories for the horizontal bar
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = [...products];

    // Apply filter
    if (filter === "Active QR Codes") {
      currentProducts = currentProducts.filter(
        (product) => product.qrCodeStatus === "Generated"
      );
    } else if (filter === "Pending QR Codes") {
      currentProducts = currentProducts.filter(
        (product) => product.qrCodeStatus === "Pending"
      );
    } else if (
      filter &&
      filter !== "All" &&
      filter !== "Name" &&
      filter !== "Added Date"
    ) {
      // filter by category
      currentProducts = currentProducts.filter(
        (product) => product.category === filter
      );
    }

    // Apply sort
    if (sort === "Name") {
      currentProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "Added Date") {
      currentProducts.sort(
        (a, b) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      );
    }

    return currentProducts;
  }, [products, filter, sort]);

  return (
    <div className="max-w-sm -mt-12 mx-auto flex flex-col md:block sm:max-w-full ">
      <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-900 mb-6">
        Your Product Experiences
      </h2>
      
      {/* Show skeleton for category bar when loading */}
      {isLoading ? (
        <div className="w-full mb-6 flex items-center bg-gray-200 justify-start overflow-x-auto hide-scrollbar" style={{ padding: "0.5rem 1rem", minHeight: "3.5rem" }}>
          <Skeleton className="h-8 w-16 mr-2" />
          <Skeleton className="h-8 w-20 mr-2" />
          <Skeleton className="h-8 w-18 mr-2" />
          <Skeleton className="h-8 w-24 mr-2" />
        </div>
      ) : (
        /* Horizontal category bar */
        categories.length > 0 && (
          <div
            className="w-full mb-6 flex items-center  justify-start overflow-x-auto hide-scrollbar"
            style={{
              padding: "0.5rem 1rem",
              minHeight: "3.5rem",
            }}
          >
            <button
              className={`px-5 py-2 rounded-sm text-sm font-semibold whitespace-nowrap transition-colors duration-150 mr-2 ${
                filter === ""
                  ? "border-b-2 border-purple-700 text-purple-700 font-bold"
                  : "bg-transparent text-blue-800 hover:bg-white/0 border-b-2 border-transparent "
              }`}
              onClick={() => setFilter("")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-sm text-sm font-semibold whitespace-nowrap transition-colors duration-150 mr-2 ${
                  filter === cat
                    ? "border-b-2 border-purple-700 text-purple-700  font-bold"
                    : "bg-transparent text-blue-800  hover:bg-white/60 border-b-2 border-transparent"
                }`}
                
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )
      )}
      
      <div className=" sm:max-w-full mx-auto">
        <FilterBar
          onFilterChange={setFilter}
          onSortChange={setSort}
          onAddNewProduct={handleAddNewProduct}
          isLoading={isLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: LOADING_SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
                  {/* Image skeleton */}
                  <Skeleton className="w-full h-40 mb-4 rounded-lg" />
                  
                  {/* Title skeleton */}
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  
                  {/* Category skeleton */}
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  
                  {/* Status badge skeleton */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <Skeleton className="h-6 w-32 rounded-full" />
                  </div>
                  
                  {/* Date skeleton */}
                  <Skeleton className="h-3 w-24 mb-4" />
                  
                  {/* Action buttons skeleton */}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))
            : filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
      {!isLoading && filteredAndSortedProducts.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No products found.
        </p>
      )}
    </div>
  );
};

export default ProductListings;

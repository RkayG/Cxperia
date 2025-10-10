// src/components/ProductDashboard/ProductListings.tsx
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FilterBar from "./FilterBar";
import type { Product, ProductListingsProps } from "./productTypes";
import ProductCard from "../../dashboard/products/components/ProductCard";

interface ProductListingsPropsWithEdit extends ProductListingsProps {
  onEditExperience?: (exp: any) => void;
}


// Simulate loading state for demonstration. Replace with real loading logic if using data fetching.
const LOADING_SKELETON_COUNT = 6;

const ProductListings: React.FC<ProductListingsPropsWithEdit> = ({
  products: initialProducts,
}) => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [products, _setProducts] = useState<Product[]>(initialProducts); // Internal state for products
  const [loading, _setLoading] = useState(false); // Replace with real loading state if using data fetching
  const router = useRouter();



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
    <div className="max-w-sm -mt-12 mx-auto sm:max-w-full ">
      <h2 className="text-xl sm:text-2xl text-center font-semibold text-gray-900 mb-6">
        Your Product Listings
      </h2>
      {/* Horizontal category bar */}
      {categories.length > 0 && (
        <div
          className="w-full mb-6 flex items-center bg-gray-200 justify-start overflow-x-auto hide-scrollbar"
          style={{
            padding: "0.5rem 1rem",
            minHeight: "3.5rem",
          }}
        >
          <button
            className={`px-5 py-2 rounded-sm text-sm font-semibold whitespace-nowrap transition-colors duration-150 mr-2 ${
              filter === ""
                ? "bg-white/70 text-purple-700 shadow font-bold"
                : "bg-transparent text-blue-800 hover:bg-white/0"
            }`}
            style={{ border: "none" }}
            onClick={() => setFilter("")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-sm text-sm font-semibold whitespace-nowrap transition-colors duration-150 mr-2 ${
                filter === cat
                  ? "bg-white/70 text-purple-700 shadow font-bold"
                  : "bg-transparent text-blue-800  hover:bg-white/60"
              }`}
              style={{ border: "none" }}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
      <div className=" sm:max-w-full mx-auto">
        <FilterBar
          onFilterChange={setFilter}
          onSortChange={setSort}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: LOADING_SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="relative">
                  <Skeleton className="h-72 w-full mb-2" />
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))
            : filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
      {!loading && filteredAndSortedProducts.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No products found.
        </p>
      )}
    </div>
  );
};

export default ProductListings;

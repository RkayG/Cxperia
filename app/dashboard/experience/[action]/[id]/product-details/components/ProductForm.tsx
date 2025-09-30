import React from "react";
import DropdownSelect from "./CategoryDropdown";
import type { ProductFormProps } from "@/types/productExperience";

const ProductForm: React.FC<ProductFormProps> = ({
  data,
  onUpdate,
  errors = {},
}) => {

  const categories = [
    "Serum",
    "Cleanser",
    "Toner",
    "Moisturizer",
    "Sunscreen",
    "Deodorant",
    "Face Mask",
    "Eye Cream",
    "Exfoliator",
    "Essence",
    "Ampoule",
    "Spot Treatment",
    "Lip Care",
    "Body Lotion",
    "Body Wash",
    "Shampoo",
    "Conditioner",
    "Hair Oil",
    "Other",
  ];

  const skinTypes = [
    "All Skin Types",
    "Normal",
    "Dry",
    "Oily",
    "Combination",
    "Sensitive",
    "Acne-Prone",
    "Mature",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Product Name, Category, Skin Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {/* Product Name */}
        <div className="md:col-span-2 lg:col-span-1">
          <label
            htmlFor="productName"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={data.productName}
            onChange={(e) => onUpdate({ productName: e.target.value })}
            placeholder="e.g., HydraGlow Night Serum"
            className={`w-full px-4 py-3.5 lg:py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
              errors.productName
                ? "border-red-600 bg-red-50"
                : "border-purple-800"
            } ${data.productName ? "bg-[#ede8f3]" : "bg-white"}`}
          />
          {errors.productName && (
            <p className="text-sm font-medium text-red-600 mt-2">
              {errors.productName}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Category *
          </label>
          <DropdownSelect
            value={data.category || ""}
            onChange={(category) => onUpdate({ category })}
            options={categories}
            placeholder="Select category"
            className={data.category ? "" : ""}
            searchPlaceholder="Search categories..."
          />
          {errors.category && (
            <p className="text-sm font-medium text-red-600 mt-2">
              {errors.category}
            </p>
          )}
        </div>

        {/* Skin Type */}
        <div>
          <label
            htmlFor="skinType"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Skin Type 
          </label>
          <DropdownSelect
            value={data.skinType || ""}
            onChange={(skinType) => onUpdate({ skinType })}
            options={skinTypes}
            placeholder="Select skin type"
            className={data.skinType ? "" : ""}
            searchPlaceholder="Search skin types..."
          />
         
        </div>
      </div>

      {/* Tagline (short field) */}
      <div>
        <label
          htmlFor="tagline"
          className="block text-left text-purple-800 text-base font-semibold mb-2"
        >
          Tagline
        </label>
        <input
          type="text"
          id="tagline"
          name="tagline"
          value={data.tagline}
          onChange={(e) => {
            const value = e.target.value.slice(0, 80);
            onUpdate({ tagline: value });
          }}
          placeholder="e.g., Glow all night!"
          maxLength={80}
          className={`w-full px-4 py-3.5 lg:py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
            errors.tagline ? "border-red-600 bg-red-50" : "border-purple-800"
          } ${data.tagline ? "bg-[#ede8f3]" : "bg-white"}`}
        />
        <div className="flex justify-between items-center mt-2">
          {errors.tagline && (
            <p className="text-sm font-medium text-red-600">{errors.tagline}</p>
          )}
          <span className="text-sm font-medium text-gray-500 ml-auto">
            {data.tagline?.length}/80
          </span>
        </div>
      </div>

      {/* Description (large textarea) */}
      <div>
        <label
          htmlFor="description"
          className="block text-left text-purple-800 text-base font-semibold mb-2"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="e.g., A hydrating night serum that rejuvenates and restores your skin while you sleep."
          rows={4}
          className={`w-full px-4 py-3.5 lg:py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${
            errors.description
              ? "border-red-600 bg-red-50"
              : "border-purple-800"
          } ${data.description ? "bg-[#ede8f3]" : "bg-white"}`}
        />
        {errors.description && (
          <p className="text-sm font-medium text-red-600 mt-2">
            {errors.description}
          </p>
        )}
      </div>

      {/* Store Link */}
      <div>
        <label
          htmlFor="storeLink"
          className="block text-left text-purple-800 text-base font-semibold mb-2"
        >
          Store Link
        </label>
        <input
          type="url"
          id="storeLink"
          name="storeLink"
          value={data.storeLink}
          onChange={(e) => onUpdate({ storeLink: e.target.value })}
          placeholder="https://yourstore.com/product"
          className={`w-full px-4 py-3.5 lg:py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
            errors.storeLink ? "border-red-600 bg-red-50" : "border-purple-800"
          } ${data.storeLink ? "bg-[#ede8f3]" : "bg-white"}`}
        />
        {errors.storeLink && (
          <p className="text-sm font-medium text-red-600 mt-2">
            {errors.storeLink}
          </p>
        )}
      </div>

      {/* Net quantity, pricing, and estimated duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <div>
          <label
            htmlFor="netQuantityMl"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Net quantity (ml)
          </label>
          <input
            type="number"
            id="netQuantityMl"
            min={0}
            value={data.netContent ?? ""}
            onChange={(e) =>
              onUpdate({
                netContent: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g., 50"
            className="w-full px-4 py-3.5 lg:py-3 text-base border-2  border-purple-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="originalPrice"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Original Price (€)
          </label>
          <input
            type="number"
            id="originalPrice"
            min={0}
            value={data.originalPrice ?? ""}
            onChange={(e) =>
              onUpdate({
                originalPrice: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            placeholder="e.g., 100"
            className="w-full px-4 py-3.5 lg:py-3 text-base border-2  border-purple-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="discountedPrice"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Discounted Price (€)
          </label>
          <input
            type="number"
            id="discountedPrice"
            min={0}
            value={data.discountedPrice ?? ""}
            onChange={(e) =>
              onUpdate({
                discountedPrice: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            placeholder="e.g., 80"
            className="w-full px-4 py-3.5 lg:py-3 text-base border-2  border-purple-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        {/*<div>
          <label
            htmlFor="estimatedDuration"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Estimated duration *
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                id="estimatedDurationValue"
                min={1}
                value={data.estimatedDurationDays ?? ""}
                onChange={(e) => {
                  const v = Number(e.target.value || 0);
                  onUpdate({
                    estimatedDurationDays: Number.isFinite(v)
                      ? Math.max(0, Math.round(v))
                      : 0,
                    estimatedDurationDisplay: `${v} days`,
                  });
                }}
                placeholder="e.g., 14"
                className={`flex-1 px-4 py-3 text-base rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                  errors.estimatedDurationDays
                    ? "border-red-600 bg-red-50"
                    : "border-purple-800"
                } bg-white`}
              />
              <span className="text-base font-medium text-gray-700 whitespace-nowrap">
                days
              </span>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                type="button"
                className="px-3 py-2.5 text-sm font-medium hover:bg-purple-800 hover:text-white cursor-pointer rounded-lg bg-gray-100 border border-gray-300"
                onClick={() =>
                  onUpdate({
                    estimatedDurationDays: 7,
                    estimatedDurationDisplay: "7 days",
                  })
                }
              >
                7d
              </button>
              <button
                type="button"
                className="px-3 py-2.5 text-sm font-medium hover:bg-purple-800 hover:text-white cursor-pointer rounded-lg bg-gray-100 border border-gray-300"
                onClick={() =>
                  onUpdate({
                    estimatedDurationDays: 14,
                    estimatedDurationDisplay: "14 days",
                  })
                }
              >
                14d
              </button>
              <button
                type="button"
                className="px-3 py-2.5 text-sm font-medium hover:bg-purple-800 hover:text-white cursor-pointer rounded-lg bg-gray-100 border border-gray-300"
                onClick={() =>
                  onUpdate({
                    estimatedDurationDays: 21,
                    estimatedDurationDisplay: "21 days",
                  })
                }
              >
                21d
              </button>
              <button
                type="button"
                className="px-3 py-2.5 text-sm font-medium hover:bg-purple-800 hover:text-white cursor-pointer rounded-lg bg-gray-100 border border-gray-300"
                onClick={() =>
                  onUpdate({
                    estimatedDurationDays: 30,
                    estimatedDurationDisplay: "30 days",
                  })
                }
              >
                30d
              </button>
            </div>
          </div>
          {errors.estimatedDurationDays && (
            <p className="text-sm font-medium text-red-600 mt-2">
              {errors.estimatedDurationDays}
            </p>
          )}
          <p className="text-sm font-medium text-purple-700 mt-2">
            This value (in days) will be used to remind your customers when to
            repurchase this product.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ProductForm;

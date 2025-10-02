'use client'
import { ArrowRight, Sparkles, Star } from "lucide-react";
import React, { useState } from "react";
import Modal from "@/components/Modal";
import CurvedBottomNav from "@/components/public/CurvedBottomNav";
import SectionHeader from "@/components/public/ThemeAwareSectionHeader";
import { useExperienceProducts } from "@/hooks/public/useProducts";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";

// Types
interface Product {
  id: number | string;
  name: string;
  type?: string;
  image?: string;
  price?: string;
  rating?: number;
  isRecommended?: boolean;
  description?: string;
  benefits?: string[];
  color?: string;
  product_image_url?: string | string[];
  store_link?: string;
  skin_type?: string | string[];
}

interface SkinType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Skin type data
// Dynamically build skinTypes from backend response
const skinTypeMeta: Record<string, SkinType> = {
  Oily: {
    id: "Oily",
    name: "Oily Skin",
    description: "Shiny appearance, enlarged pores, prone to breakouts",
    icon: "💧",
    color: "from-blue-500 to-blue-600",
  },
  Dry: {
    id: "Dry",
    name: "Dry Skin",
    description: "Flaky texture, tight feeling, needs hydration",
    icon: "🌵",
    color: "from-amber-500 to-amber-600",
  },
  Combination: {
    id: "Combination",
    name: "Combination",
    description: "Oily T-zone, dry cheeks, needs balanced care",
    icon: "⚖️",
    color: "from-purple-500 to-purple-600",
  },
  Sensitive: {
    id: "Sensitive",
    name: "Sensitive",
    description: "Easily irritated, reactive, needs gentle formulas",
    icon: "🌿",
    color: "from-green-500 to-green-600",
  },
  Normal: {
    id: "Normal",
    name: "Normal",
    description: "Well-balanced, few concerns, maintains easily",
    icon: "✨",
    color: "from-pink-500 to-pink-600",
  },
  "All Skin Types": {
    id: "All Skin Types",
    name: "All Skin Types",
    description: "Suitable for all skin types",
    icon: "🧴",
    color: "from-gray-400 to-gray-500",
  },
};

// ...removed hardcoded product recommendations...

const ProductCard: React.FC<{ product: Product; color: string }> = ({
  product,
  color,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  // Use first image from product_image_url array if available
  let imageUrl = "";
  if (
    Array.isArray(product.product_image_url) &&
    product.product_image_url.length > 0
  ) {
    imageUrl = product.product_image_url[0];
  } else if (
    typeof product.product_image_url === "string" &&
    product.product_image_url
  ) {
    imageUrl = product.product_image_url;
  } else {
    imageUrl = "https://placehold.co/80x80/E0E0E0/000000?text=Prod";
  }

  const handleBuyClick = () => {
    if (!product.store_link) return;
    setModalOpen(true);
  };

  const handleConfirm = () => {
    setModalOpen(false);
    window.open(product.store_link, "_blank");
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div
        className={`bg-white rounded-xl p-4 border-2 transition-all duration-200 hover:shadow-lg ${
          product.isRecommended
            ? `border-[${color}] bg-purple-50`
            : "border-gray-200"
        }`}
        style={{ borderColor: color }}
      >
        {product.isRecommended && (
          <div className="flex items-center gap-1 mb-3">
            <Sparkles size={14} style={{ color }} />
            <span className={`text-xs font-semibold`} style={{ color }}>
              RECOMMENDED
            </span>
          </div>
        )}

        <div className="flex gap-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-20 h-20 object-contain rounded-lg bg-gray-100"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/80x80/E0E0E0/000000?text=Prod";
            }}
          />

          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-1">{product.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{product.type}</p>
            <p className="text-sm text-gray-700 mb-3 ">{product.description}</p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold " style={{ color }}>
                {product.price}
              </span>
              <div className="flex items-center">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {product.rating}
                </span>
              </div>
            </div>

            <button
              className="w-full text-white py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ backgroundColor: color }}
              onClick={handleBuyClick}
              disabled={!product.store_link}
            >
              Buy From Store
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        title="Purchase Product"
        description="Do you want to purchase this product? You will be redirected to the store."
        confirmText="Go to Store"
        color={color}
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

const SkinTypeSelectionPage: React.FC = () => {
  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const { color, slug } = usePublicExpStore();
  const { data, isLoading, isError } = useExperienceProducts(slug);
  const products = data?.products || [];
  //  const categories = data?.categories || [];
  const skin_types = data?.skin_types || [];

  // Dynamically build skinTypes array from skin_types returned by backend
  const skinTypes: SkinType[] = skin_types.map(
    (type: string) =>
      skinTypeMeta[type] || {
        id: type,
        name: type,
        description: "Products for " + type,
        icon: "🧴",
        color: "from-gray-400 to-gray-500",
      }
  );

  // Filter products by selected skin type
  const filteredProducts = selectedSkinType
    ? products.filter((product: Product) => {
        if (!product || !product["skin_type"]) return false;
        if (Array.isArray(product["skin_type"])) {
          return product["skin_type"].includes(selectedSkinType);
        }
        return product["skin_type"] === selectedSkinType;
      })
    : [];

  const handleSkinTypeSelect = (skinTypeId: string) => {
    setSelectedSkinType(skinTypeId);
  };

  const handleResetSelection = () => {
    setSelectedSkinType(null);
  };

  return (
    <div className="min-h-screen " style={{ backgroundColor: color }}>
      <div className="max-w-xl  mx-auto bg-gray-50 min-h-screen">
        {/* Header */}
        <SectionHeader
          title="Skin Recommendations"
          subtitle="The products below are grouped by skin types"
        />
        <div className="text-center mb-8">
          <h1 className="text-lg md:text-3xl font-bold text-gray-800 mb-2">
            Find Your Perfect Skincare
          </h1>
          <p className="text-gray-600 text-md md:text-lg">
            Select your skin type to discover personalized product
            recommendations
          </p>
        </div>

        {!selectedSkinType ? (
          /* Skin Type Selection */
          <div className="space-y-6 px-2 md:px-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {skinTypes.map((skinType) => (
                <button
                  key={skinType.id}
                  onClick={() => handleSkinTypeSelect(skinType.id)}
                  className="bg-white rounded-xl p-6 text-left border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="text-3xl mb-3">{skinType.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    {skinType.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {skinType.description}
                  </p>
                  <div
                    className="flex items-center font-semibold text-sm"
                    style={{ color: color }}
                  >
                    <span>Select</span>
                    <ArrowRight
                      size={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                Not sure about your skin type?
              </h3>
              <p className="text-gray-600 mb-4">
                Take a quick quiz to determine your perfect match.
              </p>
              <button
                className="font-semibold text-sm hover:underline"
                style={{ color }}
              >
                Take Skin Type Quiz →
              </button>
            </div>
          </div>
        ) : (
          /* Product Recommendations */
          <div className="space-y-6 px-2 md:px-4">
            {/* Selected Skin Type Header */}
            <div className="bg-gray-200  rounded-2xl mx-2 mx-auto p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="md:text-3xl text-xl">
                    {skinTypes.find((st) => st.id === selectedSkinType)?.icon}
                  </div>
                  <div>
                    <h2 className="md:text-xl text-lg text-left font-bold text-gray-800">
                      {skinTypes.find((st) => st.id === selectedSkinType)?.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleResetSelection}
                  className="text-purple-600 font-semibold text-sm hover:underline"
                  style={{ color }}
                >
                  Change Skin Type
                </button>
              </div>
            </div>

            {/* Recommended Products */}
            <div className="space-y-4 px-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Recommended Products
              </h3>
              {isLoading ? (
                <div className="text-center text-gray-500">
                  Loading products...
                </div>
              ) : isError ? (
                <div className="text-center text-red-500">
                  Failed to load products.
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center text-gray-500">
                  No products found for this skin type.
                </div>
              ) : (
                filteredProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    color={color}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
      <CurvedBottomNav />
    </div>
  );
};

export default SkinTypeSelectionPage;

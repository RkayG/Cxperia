import React from "react";
import type { ProductFormProps } from "@/types/productExperience";
import DropdownSelect from "./CategoryDropdown";

const ProductForm: React.FC<ProductFormProps> = ({
  data,
  onUpdate,
  errors = {},
}) => {

  const categories = [
    "Sérum",
    "Nettoyant",
    "Tonique",
    "Hydratant",
    "Écran solaire",
    "Déodorant",
    "Masque visage",
    "Crème pour les yeux",
    "Exfoliant",
    "Essence",
    "Ampoule",
    "Traitement localisé",
    "Soins des lèvres",
    "Lotion corporelle",
    "Gel douche",
    "Shampoing",
    "Après-shampoing",
    "Huile capillaire",
    "Autre",
  ];

  const skinTypes = [
    "Tous types de peau",
    "Normale",
    "Sèche",
    "Grasse",
    "Mixte",
    "Sensible",
    "À tendance acnéique",
    "Mature",
    "Autre",
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
            Nom du produit *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="ex: Sérum Nuit HydraGlow"
            className={`w-full px-4 py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
              errors.name
                ? "border-red-600 bg-red-50"
                : "border-purple-800"
            } ${data.name ? "bg-[#ede8f3]" : "bg-white"}`}
          />
          {errors.name && (
            <p className="text-sm font-medium text-red-600 mt-2">
              {errors.name}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Catégorie *
          </label>
          <DropdownSelect
            id="category"
            value={data.category || ""}
            onChange={(category) => onUpdate({ category })}
            options={categories}
            placeholder="Sélectionner une catégorie"
            className={data.category ? "" : ""}
            searchPlaceholder="Rechercher des catégories..."
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
            Type de peau *
          </label>
          <DropdownSelect
            value={data.skinType || ""}
            onChange={(skinType) => onUpdate({ skinType })}
            options={skinTypes}
            placeholder="Sélectionner un type de peau"
            className={data.skinType ? "" : ""}
            searchPlaceholder="Rechercher des types de peau..."
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
          placeholder="ex: Laisse briller tout la nuit !"
          maxLength={80}
          className={`w-full px-4 py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
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
          placeholder="ex: Un sérum nuit hydratant qui rejuvené et restaure votre peau pendant votre sommeil."
          rows={4}
          className={`w-full px-4 py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${
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
          Lien du store
        </label>
        <input
          type="url"
          id="storeLink"
          name="storeLink"
          value={data.storeLink}
          onChange={(e) => onUpdate({ storeLink: e.target.value })}
          placeholder="ex: https://yourstore.com/product"
          className={`w-full px-4 py-3 text-base border-2  rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
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
            Quantité nette (ml)
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
            placeholder="ex: 50"
            className="w-full px-4 py-3 text-base border-2  border-purple-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="originalPrice"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Prix original (€)
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
            placeholder="ex: 100"
            className="w-full px-4 py-3 text-base border-2  border-purple-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        <div>
          <label
            htmlFor="discountedPrice"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Prix remisé (€)
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
            placeholder="ex: 80"
            className="w-full px-4 py-3 text-base border-2  border-purple-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        {/*<div>
          <label
            htmlFor="estimatedDuration"
            className="block text-left text-purple-800 text-base font-semibold mb-2"
          >
            Durée estimée *
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
                placeholder="ex: 14"
                className={`flex-1 px-4 py-3 text-base rounded-xl border-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                  errors.estimatedDurationDays
                    ? "border-red-600 bg-red-50"
                    : "border-purple-800"
                } bg-white`}
              />
              <span className="text-base font-medium text-gray-700 whitespace-nowrap">
                  jours
              </span>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                type="button"
                className="px-3 py-2.5 text-sm font-medium hover:bg-purple-800 hover:text-white cursor-pointer rounded-lg bg-gray-100 border border-gray-300"
                onClick={() =>
                  onUpdate({
                    estimatedDurationDays: 7,
                    estimatedDurationDisplay: "7 jours",
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
                    estimatedDurationDisplay: "14 jours",
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
                    estimatedDurationDisplay: "21 jours",
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
                    estimatedDurationDisplay: "30 jours",
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
            Cette valeur (en jours) sera utilisée pour rappeler à vos clients quand 
              repayer ce produit.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ProductForm;

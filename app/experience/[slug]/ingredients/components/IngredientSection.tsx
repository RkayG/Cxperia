// src/components/IngredientsSection.tsx

import { AlertCircle, Info } from "lucide-react";
import React, { use, useState } from "react";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";

interface Ingredient {
  id?: string | number;
  inci_name: string;
  common_name?: string;
  is_allergen?: boolean;
  function?: string;
  concentration?: string;
  category?: string;
}

const IngredientsSection: React.FC = () => {
  const [isOpen, _setIsOpen] = useState(true);
  const { experience, color } = usePublicExpStore();
  const ingredients: Ingredient[] = experience?.data?.ingredients || [];

  // Group ingredients by category for better organization
  const ingredientsByCategory = ingredients.reduce<Record<string, Ingredient[]>>((acc, ingredient) => {
    const category = ingredient.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(ingredient);
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header with improved styling */}
     
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Info size={20} style={{ color }} />
          </div>
          <div>
            <h3
              className="text-xl font-bold text-left text-gray-900 group-hover:opacity-80 transition-opacity"
            >
              Ingredients
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {ingredients.length} ingredients • {Object.keys(ingredientsByCategory).length} categories
            </p>
          </div>
        </div>
    

      {/* Ingredient list */}
      {isOpen && (
        <div className="mt-6 space-y-6">
          {Object.entries(ingredientsByCategory).map(([category, categoryIngredients]) => (
            <div key={category} className="border-l-4 pl-4" style={{ borderLeftColor: `${color}40` }}>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="px-2 py-1 text-xs rounded-full  text-gray-700"
                style={{ backgroundColor: `${color}15` , color: color }}>
                  {category}
                </span>
                <span className="text-sm text-gray-500">
                  ({(categoryIngredients as Ingredient[]).length} ingredients)
                </span>
              </h4>
              <div className="space-y-3">
                {(categoryIngredients as Ingredient[]).map((ing, index) => (
                  <div
                    key={ing.id || index}
                    className="border rounded-xl p-4 hover:shadow-md transition-all duration-200 bg-white group hover:border-gray-200"
                    style={{ borderColor: `${color}` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">
                            {ing.inci_name}
                          </span>
                          {ing.is_allergen && (
                            <span 
                              className="px-2 py-1 text-xs rounded-full flex items-center gap-1 font-medium"
                              style={{ 
                                backgroundColor: `${color}15`,
                                color: color 
                              }}
                            >
                              <AlertCircle size={12} />
                              Allergen
                            </span>
                          )}
                        </div>
                        {ing.common_name && ing.common_name !== ing.inci_name && (
                          <p className="text-sm text-gray-600 mb-2">
                            Also known as: {ing.common_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {ing.function && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Function</p>
                          <p className="text-gray-600 leading-relaxed">
                            {ing.function}
                          </p>
                        </div>
                      )}
                      {ing.concentration && (
                        <div>
                          <p className="font-medium text-gray-700 mb-1">Concentration</p>
                          <p className="text-gray-600">
                            {ing.concentration}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Hover effect enhancement */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      style={{ 
                        boxShadow: `0 0 0 1px ${color}20`,
                        backgroundColor: `${color}05`
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {isOpen && ingredients.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Info size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500">No ingredient information available</p>
        </div>
      )}
    </div>
  );
};

export default IngredientsSection;
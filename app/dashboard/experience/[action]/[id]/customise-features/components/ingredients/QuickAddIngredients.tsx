import { Loader2, Search } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useInciIngredientSearch } from '@/hooks/brands/useFeatureApi';
import type { QuickAddIngredientsProps } from '@/types/ingredientTypes';

const QuickAddIngredients: React.FC<QuickAddIngredientsProps> = ({ onAddIngredient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: ingredients = [], isLoading: loading, error } = useInciIngredientSearch(searchTerm);

  // Memoize filtered ingredients for better performance
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) return [];
    return ingredients.slice(0, 50); // Limit to first 50 results for better performance
  }, [ingredients, searchTerm]);

  const handleAddIngredient = useCallback((ingredient: any) => {
    onAddIngredient(ingredient);
    setSearchTerm('');
  }, [onAddIngredient]);

  return (
    // 1. Outer Container: Keep sticky for search header effect.
    // Use smaller horizontal padding on mobile (px-4) and increase on larger screens (lg:px-0).
    <div className="mb-6 sticky top-0 z-40 bg-gray-50 w-full border-b border-gray-200 p-4 sm:p-6 lg:p-0">
      
      {/* Content Wrapper (to handle lg:px-0 if needed) */}
      <div className="max-w-7xl mx-auto py-3">

        {/* Header Row */}
        <div className="flex flex-wrap items-start gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-800 shrink-0">Add Ingredients By Searching</h3>
          
          {/* Base Dataset Badge (flex-shrink) */}
          <span
            className="text-xs text-gray-500 cursor-help border-b border-dotted border-gray-400"
            title="Ingredient data adopted from EUCOSMETICS dataset by von der Ohe & Aalizadeh via Zenodo (CC BY 4.0)."
          >
            Base dataset
          </span>
          
          {/* Search Count Badge (flex-shrink) */}
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-300 shrink-0">
            Search from 7,000+ cosmetic ingredients
          </span>
        </div>

        {/* Search Input Container */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search ingredients... (e.g., Aqua, Glycerin)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 text-gray-900 border border-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            autoComplete="off"
            spellCheck="false"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
            {loading ? (
              <Loader2 size={20} className="text-purple-500 animate-spin" />
            ) : (
              <Search size={20} className="text-gray-400" />
            )}
          </div>
        </div>
        
        {/* Loading/Error Messages */}
        {loading && searchTerm && (
          <div className="text-purple-600 mb-2 text-sm flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Searching ingredients...
          </div>
        )}
        {error && (
          <div className="text-red-500 mb-2 text-sm">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}
        
        {/* Ingredient Results Container */}
        {searchTerm && filteredIngredients.length > 0 && (
          <div className="absolute left-0 right-0 w-full bg-white shadow-lg rounded-b-lg border-x border-b border-gray-300 max-h-80 overflow-y-auto z-50">
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-3">
                Showing {filteredIngredients.length} of {ingredients.length} results
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredIngredients.map((ingredient: any) => (
                  <button
                    key={`${ingredient.id || ingredient.inci_name}-${ingredient.common_name}`}
                    onClick={() => handleAddIngredient(ingredient)}
                    className="px-3 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-200 whitespace-nowrap border border-purple-200 hover:border-purple-300"
                    title={`${ingredient.inci_name}${ingredient.common_name ? ` (${ingredient.common_name})` : ''}`}
                  >
                    {ingredient.inci_name || ingredient.common_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* No results message */}
        {searchTerm && !loading && filteredIngredients.length === 0 && (
          <div className="text-gray-500 mb-2 text-sm">
            No ingredients found for "{searchTerm}". Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAddIngredients;
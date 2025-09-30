import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { QuickAddIngredientsProps } from '@/types/ingredientTypes';
import { useInciIngredientSearch } from '@/hooks/brands/useFeatureApi';


const QuickAddIngredients: React.FC<QuickAddIngredientsProps> = ({ onAddIngredient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: ingredients = [], isLoading: loading, error } = useInciIngredientSearch(searchTerm);

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
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // 2. Search Input: Change width to w-full on mobile.
            className="w-full px-4 py-2 pl-10 text-gray-900 border border-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        {/* Loading/Error Messages */}
        {loading && <div className="text-gray-500 mb-2">Searching...</div>}
        {error && <div className="text-red-500 mb-2">{error instanceof Error ? error.message : String(error)}</div>}
        
        {/* Ingredient Results Container */}
        {/* 3. Results Container:
             - Remove 'absolute' if you want it to flow with the document.
             - If keeping 'absolute' (for an overlay effect), ensure w-full.
             - We'll keep it absolute here to visually overlay the search results.
             - Added 'max-h-60 overflow-y-auto' for scrollable results on mobile.
        */}
        {searchTerm && ingredients.length > 0 && (
          <div className="absolute left-0 right-0 w-full bg-white flex flex-wrap gap-2 p-4 shadow-lg rounded-b-lg border-x border-b border-gray-300 max-h-60 overflow-y-auto">
            {ingredients.map((ingredient: any) => (
              <button
                key={ingredient.inci_name || ingredient.common_name}
                onClick={() => {
                  onAddIngredient(ingredient);
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-200 whitespace-nowrap"
              >
                {ingredient.inci_name || ingredient.common_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAddIngredients;
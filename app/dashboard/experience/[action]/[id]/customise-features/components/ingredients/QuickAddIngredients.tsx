import React, { useState } from 'react';
import { Search} from 'lucide-react';
import type { QuickAddIngredientsProps } from '../../../../../../types/ingredientTypes';
import { useInciIngredientSearch } from '@/hooks/brands/useFeatureApi';


const QuickAddIngredients: React.FC<QuickAddIngredientsProps> = ({ onAddIngredient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: ingredients = [], isLoading: loading, error } = useInciIngredientSearch(searchTerm);

  return (
    <div className="mb-6 sticky px-4 lg:px-0 top-0 z-40 bg-gray-50 w-full border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Add Ingredients By Searching</h3>
        <span
          className="ml-2 text-xs text-gray-500 cursor-help border-b border-dotted border-gray-400"
          title="Ingredient data adopted from EUCOSMETICS dataset by von der Ohe & Aalizadeh via Zenodo (CC BY 4.0)."
        >
          Base dataset
        </span>
        <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold border border-yellow-300">Search from 7,000+ cosmetic ingredients</span>
      </div>
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-2/3 flex justify-left px-4 py-2 pl-10 text-gray-900 border border-purple-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      {loading && <div className="text-gray-500 mb-2">Searching...</div>}
      {error && <div className="text-red-500 mb-2">{error instanceof Error ? error.message : String(error)}</div>}
      <div className="flex absolute bg-white flex-wrap gap-2">
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
    </div>
  );
};

export default QuickAddIngredients;

import React from 'react';
import type { IngredientSummaryProps } from '@/types/ingredientTypes';
import { AlertTriangle } from 'lucide-react'; 

const IngredientSummary: React.FC<IngredientSummaryProps> = ({
  totalIngredients,
  allergens,
  withConcentration,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm sm:text-base">
        <div className="flex items-center">
          <span className="text-gray-600 mr-2 text-sm">Total Ingredients:</span>
          <span className="font-semibold text-gray-900">{totalIngredients}</span>
        </div>
        <div className="flex items-center">
          <AlertTriangle size={16} className="text-red-500 mr-2" />
          <span className="text-gray-600 mr-2 text-sm">Allergens:</span>
          <span className="font-semibold text-gray-900">{allergens}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2 text-sm">With Concentration:</span>
          <span className="font-semibold text-gray-900">{withConcentration}</span>
        </div>
        {/* <div className="flex items-center">
          <Clock size={16} className="text-gray-500 mr-2" />
          <span className="text-gray-600 mr-2">Status:</span>
          <span className="font-semibold text-gray-900">{status}</span>
        </div> */}
      </div>
    </div>
  );
};

export default IngredientSummary;

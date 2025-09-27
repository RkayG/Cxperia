import {AlertTriangle, Save, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import DropdownSelect from '@/components/DropdownSelect';
import type { Ingredient, IngredientFormProps } from '@/types/ingredientTypes';

interface IngredientFormPropsWithExit extends IngredientFormProps {
  onExitEdit?: () => void;
}

const IngredientForm: React.FC<IngredientFormPropsWithExit> = ({ ingredient, onAdd, onUpdate, onDelete, onExitEdit }) => {
  const [inciName, setInciName] = useState(ingredient?.inciName || '');
  const [commonName, setCommonName] = useState(ingredient?.commonName || '');
  const [concentration, setConcentration] = useState(ingredient?.concentration || '');
  const [isAllergen, setIsAllergen] = useState(ingredient?.isAllergen || false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  // State for selected function
  const [selectedFunction, setSelectedFunction] = useState('');

  useEffect(() => {
    if (ingredient) {
      setInciName(ingredient.inciName);
      setCommonName(ingredient.commonName);
      setConcentration(ingredient.concentration);
      setIsAllergen(ingredient.isAllergen);
      // Set selected function to empty or first available
      const options = Array.isArray(ingredient.all_functions)
        ? ingredient.all_functions
        : (ingredient.all_functions ? ingredient.all_functions.split(';').map(f => f.trim()).filter(Boolean) : []);
      setSelectedFunction(options[0] || '');
    } else {
      // Reset form when adding a new ingredient if no ingredient prop is provided
      setInciName('');
      setCommonName('');
      setConcentration('');
      setIsAllergen(false);
      setSelectedFunction('');
    }
    setErrors({});
  }, [ingredient]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!inciName.trim()) {
      newErrors.inciName = 'INCI Name is required';
    }
    
    if (concentration && !concentration.match(/^(<?\d+(?:\.\d+)?%?|<\s*\d+(?:\.\d+)?%?)$/)) {
      newErrors.concentration = 'Please enter a valid concentration (e.g., 5.0, <1%, 2.5%)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newOrUpdatedIngredient: Omit<Ingredient, 'id'> = {
      inciName: inciName.trim(),
      commonName: commonName.trim(),
      concentration: concentration.trim(),
      isAllergen: isAllergen,
      selectedFunction: selectedFunction,
    };

    if (ingredient) {
      // Preserve backend fields like category, all_functions, etc. on update
      onUpdate({
        ...ingredient,
        ...newOrUpdatedIngredient,
        id: ingredient.id,
        category: ingredient.category,
        all_functions: ingredient.all_functions,
      });
    } else {
      onAdd(newOrUpdatedIngredient);
      setInciName('');
      setCommonName('');
      setConcentration('');
      setIsAllergen(false);
      setErrors({});
      if (onExitEdit) onExitEdit();
    }
  };

  const handleDelete = () => {
    if (ingredient && onDelete) {
      onDelete(ingredient.id);
    }
  };

    const isPreset = inciName.trim() && commonName.trim();
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto">
      {/* Header & Instruction */}
      <div className="bg-purple-900 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg  text-left font-semibold text-white">
              Edit Ingredient
            </h4>
            <p className="text-sm text-left text-white mt-1">
              Select an ingredient to edit its details
            </p>
        
          </div>
          {ingredient && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-red-300 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* INCI Name */}
          <div>
            <label htmlFor={`inciName-${ingredient?.id || 'new'}`} className="block text-sm font-medium text-gray-700 mb-2">
              INCI Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id={`inciName-${ingredient?.id || 'new'}`}
              value={inciName}
              onChange={(e) => {
                setInciName(e.target.value);
                if (errors.inciName) {
                  setErrors(prev => ({ ...prev, inciName: '' }));
                }
              }}
              className={`w-full text-gray-600 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                errors.inciName ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-purple-500'
              }`}
              placeholder="e.g., Aqua, Glycerin, Sodium Hyaluronate"
            
            />
            {errors.inciName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle size={14} />
                {errors.inciName}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">List ingredients in order of highest to lowest concentration</p>
          </div>

          {/* Common Name */}
          <div>
            <label htmlFor={`commonName-${ingredient?.id || 'new'}`} className="block text-sm font-medium text-gray-700 mb-2">
              Common Name
            </label>
            <input
              type="text"
              id={`commonName-${ingredient?.id || 'new'}`}
              value={commonName}
              onChange={(e) => setCommonName(e.target.value)}
              className="w-full text-gray-600 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              placeholder="e.g., Water, Vitamin E, Hyaluronic Acid"
              
            />
            <p className="mt-1 text-xs text-gray-500">Consumer-friendly name for this ingredient</p>
          </div>


          {/* Purpose / Function Dropdown */}
          {(() => {
            // Parse functions from ingredient.all_functions (handle both string and array)
            const functionOptions = Array.isArray(ingredient?.all_functions)
              ? ingredient.all_functions
              : (ingredient?.all_functions ? ingredient.all_functions.split(';').map(f => f.trim()).filter(Boolean) : []);
            return functionOptions.length > 0 ? (
              <div>
                <label htmlFor="function-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose / Function
                </label>
                {functionOptions.length > 0 ? (
                  <DropdownSelect
                    value={selectedFunction}
                    onChange={setSelectedFunction}
                    options={functionOptions}
                    placeholder="Select function"
                    className="w-full"
                  />
                ) : (
                  <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                    Select function
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">Select the main purpose of this ingredient</p>
              </div>
            ) : null;
          })()}
        </div>

         {/* Concentration */}
          <div>
            <label htmlFor={`concentration-${ingredient?.id || 'new'}`} className="block text-sm font-medium text-gray-700 mb-2">
              Concentration
            </label>
            <div className="relative">
              <input
                type="text"
                id={`concentration-${ingredient?.id || 'new'}`}
                value={concentration}
                onChange={(e) => {
                  setConcentration(e.target.value);
                  if (errors.concentration) {
                    setErrors(prev => ({ ...prev, concentration: '' }));
                  }
                }}
                className={`w-full text-gray-600 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 ${
                  errors.concentration ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-purple-500'
                }`}
                placeholder="e.g., 5.0%, <1%, 2.5%"
              />
            </div>
            {errors.concentration && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle size={14} />
                {errors.concentration}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">Optional: Enter percentage or concentration range</p>
          </div>


        {/* Form Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-purple-800 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
            disabled={!isPreset}
          >
            <Save size={20} />
            Update Ingredient
          </button>
        </div>
      </div>
    </div>
  );
};

export default IngredientForm;
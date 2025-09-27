 import React from 'react';
import type { FeatureToggleProps } from '@/types/productExperience';

// Extended interface to include onEdit for modal opening

interface EnhancedFeatureToggleProps extends FeatureToggleProps {
  onEdit?: (featureId: string) => void;
  text?: string; // Custom message to display
  error?: boolean;
  id?: string;
}

const FeatureToggle: React.FC<EnhancedFeatureToggleProps> = ({ 
  feature, 
  isEnabled, 
  onToggle,
  onEdit,
  text,
  error,
  id
}) => {
  // Features that require setup before enabling
  const setupRequiredFeatures = [
    'ingredientList',
    'productUsage',
    'customerService'
  ];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (feature.id === 'feedbackForm') {
      // Feedback form cannot be toggled
      return;
    }
    if (!isEnabled) {
      // If toggling ON and setup is required, open modal instead
      if (setupRequiredFeatures.includes(feature.id) && onEdit) {
        onEdit(feature.id);
        return;
      }
    }
    // Otherwise, toggle as usual
    onToggle(feature.id, !isEnabled);
  };

  const handleMainClick = () => {
    if (onEdit) {
      onEdit(feature.id);
    }
  };


  const isComingSoon = !!feature.comingSoon;

  return (
    <div
      id={id}
      className={`
        flex flex-col items-center shadow-lg shadow-purple-200 justify-center w-full py-12 border transition-colors duration-200
        ${isComingSoon
          ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
          : isEnabled
            ? 'bg-purple-50 border-purple-800 hover:bg-purple-100 cursor-pointer'
            : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
        }
        ${error ? 'ring-4 ring-red-400' : ''}
      `}
      onClick={!isComingSoon ? handleMainClick : undefined}
      aria-disabled={isComingSoon}
    >
      {/* Custom message text */}
      {text && (
        <div className="mb-6 text-center text-base font-medium text-purple-700">
          {text}
        </div>
      )}
      {/* Icon and details centered */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className={`
          flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-200
          ${isComingSoon
            ? 'bg-gray-200 text-gray-400'
            : isEnabled
              ? 'bg-purple-200 text-purple-700'
              : 'bg-gray-100 text-gray-500'
          }
        `}>
          {feature.icon}
        </div>
        <h5 className={`
          font-semibold text-lg mb-2 transition-colors duration-200 text-center
          ${isComingSoon
            ? 'text-gray-500'
            : isEnabled ? 'text-purple-900' : 'text-gray-900'}
        `}>
          {feature.title}
        </h5>
        <p className={`
          text-sm text-ellipsis overflow-hidden whitespace-nowrap transition-colors duration-200 text-center
          ${isComingSoon
            ? 'text-gray-400'
            : isEnabled ? 'text-purple-600' : 'text-gray-500'}
        `}>
          {feature.description}
        </p>
        {/* Badge Section */}
        <div className="mt-2 flex gap-2 justify-center">
          {feature.required && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-1 text-base font-bold text-red-700 ring-2 ring-inset ring-red-600/30 shadow-md ">
              Required
            </span>
          )}
          {!feature.required && isComingSoon && (
            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Coming Soon
            </span>
          )}
          {!feature.required && !isComingSoon && feature.recommended && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-base font-bold text-blue-700 ring-2 ring-inset ring-blue-700/20 shadow-md ">
              Recommended
            </span>
          )}
        </div>
      </div>
      {/* Large Centered Button */}
      <button
        className={`
          w-64 py-5 text-lg font-bold rounded-2xl shadow-lg transition-all duration-200 focus:outline-none
          ${
            feature.id === 'feedbackForm'
              ? 'bg-blue-800 text-white cursor-not-allowed opacity-80'
              : isComingSoon
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isEnabled
                  ? 'bg-blue-800 text-white hover:bg-purple-800'
                  : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }
        `}
        onClick={feature.id === 'feedbackForm' || isComingSoon ? undefined : handleToggle}
        aria-label={`Toggle ${feature.title}`}
        disabled={feature.id === 'feedbackForm' || isComingSoon}
        tabIndex={isComingSoon ? -1 : 0}
      >
        {feature.id === 'feedbackForm' ? `Always On` : isEnabled ? `Turned On` : `Turn On`}
      </button>
    </div>
  );
};

export default FeatureToggle;
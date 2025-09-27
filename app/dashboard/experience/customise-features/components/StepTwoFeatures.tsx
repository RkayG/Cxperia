import React from 'react';
import FeatureToggle from './FeatureToggle';
import type { Feature, FeatureSettings } from '@/types/productExperience';

interface StepTwoFeaturesProps {
  features?: Feature[];
  data: any;
  onToggle: (featureId: keyof FeatureSettings, enabled: boolean) => void;
  onEdit: (featureId: keyof FeatureSettings) => void;
  selectedFeatures: number;
  featureErrors?: { missingRequired: string[]; notEnoughSelected: boolean };
  // Add modal open handler props (all optional for backward compatibility)
  onOpenIngredientModal?: () => void;
  onOpenDigitalInstructionsModal?: () => void;
  onOpenRecommendedProductsModal?: () => void;
  onOpenCustomerSupportModal?: () => void;
  onOpenVideoTutorialManager?: () => void;
  onOpenTutorialContentManager?: () => void;
}

const StepTwoFeatures: React.FC<StepTwoFeaturesProps> = ({
  features,
  data,
  onToggle,
  onEdit,
  selectedFeatures,
  featureErrors,
}) => {
  const defaultFeatures: Feature[] = [
    {
        id: 'productUsage',
        title: 'Usage Instructions',
        description: 'How to use the product',
        icon: '📊',
        required: true
      },
      
      {
        id: 'ingredientList',
        title: 'Ingredient List',
        description: 'See all product ingredients',
        icon: '🧪',
        required: true
      },
      {
        id: 'skinRecommendations',
        title: 'Skin Recommendations',
        description: 'Suggest your products by skin type',
        icon: '�',
        recommended: true
      },
      
      {
        id: 'tutorialsRoutines',
        title: 'Tutorials / Routines',
        description: 'Step-by-step beauty guides',
        icon: '�',
        recommended: true
      },
      
      {
        id: 'feedbackForm',
        title: 'Feedback Form',
        description: 'Collect customer feedback',
        icon: '📝',
        required: true
      },
      {
        id: 'customerService',
        title: 'Customer Support ',
        description: 'Contact support channels',
        icon: '🎧',
        recommended: true
      },
      {
        id: 'chatbot',
        title: 'Chatbot',
        description: 'Instant AI customer support',
        icon: '💬',
        recommended: true,
        comingSoon: true
      },
      {
        id: 'loyaltyPoints',
        title: 'Loyalty Points',
        description: 'Reward points for purchases',
        icon: '⭐',
        recommended: true,
        comingSoon: true
      },
      
   
  ];
  const featuresToUse = features || defaultFeatures;
  return (
    <div className="shadow-md border rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          We recommend selecting up to 6 features
        </h3>
        <div className="text-sm text-gray-600">
          Selected: <span className="font-medium text-purple-600">{selectedFeatures}</span> / {defaultFeatures.length}
        </div>
      </div>
      <div>
        <h4 className=" font-bold text-3xl text-gray-900 mb-4">
          Customize User Experience Features
        </h4>
        <p className="text-sm text-gray-600 mb-6">
          Select interactive elements to provide a rich post-purchase experience for your customers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuresToUse.map((feature) => {
            const hasError = featureErrors?.missingRequired?.includes(feature.id);
            return (
              <FeatureToggle
                key={feature.id}
                feature={feature}
                isEnabled={data.features && data.features[feature.id as keyof FeatureSettings]}
                onToggle={onToggle}
                onEdit={(featureId: string) => onEdit(featureId as keyof FeatureSettings)}
                error={hasError}
                id={`feature-toggle-${feature.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default StepTwoFeatures;

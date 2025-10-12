import React from 'react';
import type { Feature, FeatureSettings } from '@/types/productExperience';
import FeatureToggle from './FeatureToggle';

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
        title: 'Instructions d\'utilisation',
        description: 'Comment utiliser le produit',
        icon: '📊',
        required: true
      },
      
      {
        id: 'ingredientList',
        title: 'Liste des ingrédients',
        description: 'Voir tous les ingrédients du produit',
        icon: '🧪',
        required: true
      },
    
      {
        id: 'tutorialsRoutines',
        title: 'Tutoriels / Routines',
        description: 'Guides beauté étape par étape',
        icon: '�',
        recommended: true
      },
      
      {
        id: 'feedbackForm',
        title: 'Formulaire de commentaires',
        description: 'Collecter les commentaires des clients',
        icon: '📝',
        required: true
      },
      {
        id: 'customerService',
        title: 'Support client',
        description: 'Canaux de contact support',
        icon: '🎧',
        recommended: true
      },
      {
        id: 'chatbot',
        title: 'Chatbot',
        description: 'Support client IA instantané',
        icon: '💬',
        recommended: true,
        comingSoon: true
      },
      {
        id: 'loyaltyPoints',
        title: 'Points de fidélité',
        description: 'Points de récompense pour les achats',
        icon: '⭐',
        recommended: true,
        comingSoon: true
      },
        {
        id: 'skinRecommendations',
        title: 'Recommandations de peau',
        description: 'Suggérer vos produits par type de peau',
        icon: '�',
        recommended: true,
        comingSoon: true
      }   
   
  ];
  const featuresToUse = features || defaultFeatures;
  return (
    <div className="shadow-md border rounded-2xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Nous recommandons de sélectionner jusqu'à 4 fonctionnalités
        </h3>
        <div className="text-sm text-gray-600">
          Sélectionné : <span className="font-medium text-purple-600">{selectedFeatures}</span> / {defaultFeatures.length}
        </div>
      </div>
      <div>
        <h4 className=" font-bold text-3xl text-center text-gray-900 mb-4">
          Personnaliser les fonctionnalités de l'expérience utilisateur
        </h4>
        <p className="text-sm text-gray-600 text-center mb-6">
          Sélectionnez des éléments interactifs pour offrir une expérience post-achat riche à vos clients.
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

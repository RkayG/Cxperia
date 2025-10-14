import React, {useMemo } from 'react';
import type { CustomerSupportLinksData } from '@/types/customerServiceTypes';
import type { Ingredient } from '@/types/ingredientTypes';
import type { Instruction } from '@/types/instructionTypes'
import CustomerSupportLinksModal from './customerSupport/CustomerSupportLinkModal';
import IngredientModal from './ingredients/IngredientModal';
import DigitalInstructionsModal from './usageInstructions/DigitalInstructionsModal';


interface StepTwoModalsProps {
  experienceId?: string | null;
  isIngredientModalOpen: boolean;
  onCloseIngredient: () => void;
  currentProductName: string;
  ingredients: Ingredient[];
  onSaveIngredients: (productName: string, updatedIngredients: Ingredient[]) => void;
  isDigitalInstructionsModalOpen: boolean;
  onCloseDigitalInstructions: () => void;
  digitalInstructions: Instruction[];
  onSaveDigitalInstructions: (instructions: Instruction[], onFeatureEnable?: () => void) => void;
  isCustomerSupportModalOpen: boolean;
  onCloseCustomerSupport: () => void;
  customerSupportLinks: CustomerSupportLinksData | undefined;
  onSaveCustomerSupport: (data: CustomerSupportLinksData) => void;
  onAutoEnableCustomerService?: () => void;
  onFeatureEnable?: () => void;
  onIngredientFeatureEnable?: () => void;
}


const StepTwoModals: React.FC<StepTwoModalsProps> = ({
  experienceId,
  isIngredientModalOpen,
  onCloseIngredient,
  currentProductName,
  ingredients,
  onSaveIngredients,
  isDigitalInstructionsModalOpen,
  onCloseDigitalInstructions,
  digitalInstructions,
  onSaveDigitalInstructions,
  isCustomerSupportModalOpen,
  onCloseCustomerSupport,
  customerSupportLinks,
  onSaveCustomerSupport,
  onAutoEnableCustomerService,
  onFeatureEnable,
  onIngredientFeatureEnable,
}) => {
  // Debug logging
  console.log('StepTwoModals - Experience ID:', experienceId);
  console.log('StepTwoModals - Ingredients received:', ingredients);
  console.log('StepTwoModals - Product Name:', currentProductName);
    // Memoize customerSupportLinks to prevent unnecessary remounts
    const memoizedCustomerSupportLinks = useMemo(() => customerSupportLinks, [customerSupportLinks]);
    return (
    <>
   
      <IngredientModal
        isOpen={isIngredientModalOpen}
        onClose={onCloseIngredient}
        initialProductName={currentProductName}
        initialIngredients={ingredients}
        onSave={onSaveIngredients}
        experienceId={experienceId || ''}
        onFeatureEnable={onIngredientFeatureEnable}
      />
      <DigitalInstructionsModal
        isOpen={isDigitalInstructionsModalOpen}
        onClose={onCloseDigitalInstructions}
        experienceId={experienceId || ''}
        initialInstructions={digitalInstructions}
        productName={currentProductName}
        onSave={(instructions) => {
          if (onSaveDigitalInstructions) {
            onSaveDigitalInstructions(instructions, onFeatureEnable);
          }
        }}
        onFeatureEnable={onFeatureEnable}
      />

    
      <CustomerSupportLinksModal
        isOpen={isCustomerSupportModalOpen}
        onClose={onCloseCustomerSupport}
        initialData={memoizedCustomerSupportLinks}
        onSave={onSaveCustomerSupport}
        onAutoEnableFeature={onAutoEnableCustomerService}
      />
    </>
  );
}

export default StepTwoModals;

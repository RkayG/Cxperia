import React, {useMemo } from 'react';
import IngredientModal from './ingredients/IngredientModal';
import DigitalInstructionsModal from './usageInstructions/DigitalInstructionsModal';
import CustomerSupportLinksModal from './customerSupport/CustomerSupportLinkModal';
import type { CustomerSupportLinksData } from '../../../../../types/customerServiceTypes';
import type { Ingredient } from '../../../../../types/ingredientTypes';
import type { Instruction } from '@/types/instructionTypes'


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
}) => {
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

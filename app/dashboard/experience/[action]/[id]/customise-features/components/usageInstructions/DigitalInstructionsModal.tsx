// src/components/DigitalInstructions/DigitalInstructionsModal.tsx
import React, { useEffect, useState } from 'react';
import { useInstructions } from '@/hooks/brands/useFeatureApi';
// import { useInstructions } from '../../../hooks/useFeatureApi';
// import { useExperienceContext } from '../../../context/ExperienceContext';

import CosmeticProductModal from './ApplicationTips'
import ProductUsageModal from './usageModal';


interface DigitalInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  experienceId: string;
  initialInstructions?: any;
  onSave?: (instructions: any) => void;
  onFeatureEnable?: () => void;
  productName?: string;
}



interface DigitalInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DigitalInstructionsModal: React.FC<DigitalInstructionsModalProps> = ({
  isOpen,
  experienceId,
  initialInstructions,
  onClose,
  onFeatureEnable,
  productName,
}) => {
  console.log('DigitalInstructionsModal rendered with experienceId:', experienceId);
  const { data: fetchedInstructions } = useInstructions(experienceId);
  const [instructions, setInstructions] = useState<any>(initialInstructions);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    if (fetchedInstructions) {
      setInstructions(fetchedInstructions);
    }
  }, [fetchedInstructions, experienceId]);
  console.log('Fetched instructions:', fetchedInstructions);

  if (!isOpen) return null;

  return (
    <ProductUsageModal
      experienceId={experienceId}
      initialInstructions={instructions}
      productName={productName}
      onClose={onClose}
      onFeatureEnable={onFeatureEnable}
    />
  );
};

export default DigitalInstructionsModal;
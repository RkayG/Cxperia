'use client';

import React from 'react';

// INTERNAL IMPORTS 
import SectionHeader from '@/app/experience/[slug]/components/ThemeAwareSectionHeader';
import InstructionsSection from './InstructionsSection';
import ProductDisplay from './ProductDisplay';

interface ClientUsageInstructionsWrapperProps {
  slug: string;
  color: string;
  product: any;
}

const ClientUsageInstructionsWrapper: React.FC<ClientUsageInstructionsWrapperProps> = ({
  slug,
  color,
  product,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center" style={{ backgroundColor: color }}>
      <div className="max-w-xl mx-auto w-full bg-white shadow-lg overflow-hidden">
        <SectionHeader title="Instructions" subtitle="Découvrez comment utiliser notre produit efficacement." />
        <main className="p-4 space-y-6 rounded-tl-3xl">
          <ProductDisplay color={color} product={product} />
          <InstructionsSection color={color} />
        </main>
      </div>
    </div>
  );
};

export default ClientUsageInstructionsWrapper;

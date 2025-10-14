'use client';

import React from 'react';
import SectionHeader from '@/app/experience/[slug]/components/ThemeAwareSectionHeader';
import IngredientsSection from './IngredientSection';
import ProductDisplay from '../../usage-instructions/components/ProductDisplay';

interface ClientIngredientsWrapperProps {
  slug: string;
  color: string;
  product: any;
}

const ClientIngredientsWrapper: React.FC<ClientIngredientsWrapperProps> = ({
  slug,
  color,
  product,
}) => {
  return (
    <div className="min-h-screen bg-neutral-100 font-sans flex justify-center" style={{ backgroundColor: color }}>
      <div className="max-w-xl mx-auto w-full bg-white shadow-lg overflow-hidden">
        <SectionHeader title="Ingrédients" subtitle="Découvrez les ingrédients qui rendent notre produit unique et efficace." />
        <main className="p-4 space-y-6 rounded-tl-3xl">
          <ProductDisplay color={color} product={product} />
          <IngredientsSection />
        </main>
      </div>
    </div>
  );
};

export default ClientIngredientsWrapper;

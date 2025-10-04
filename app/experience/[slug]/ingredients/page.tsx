// src/App.tsx
'use client'
import React from 'react';

// INTERNAL IMPORTS
import CurvedBottomNav from '@/app/experience/[slug]/components/CurvedBottomNav';
import SectionHeader from '@/app/experience/[slug]/components/ThemeAwareSectionHeader';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import IngredientsSection from './components/IngredientSection';
import PublicLoading from '../components/PublicLoading';
import ProductDisplay from '../usage-instructions/components/ProductDisplay';

const IngredientsPage: React.FC = () => {
  const { color, product, isLoading } = usePublicExpStore();
  

  if (isLoading) {
    return <PublicLoading />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 font-sans flex justify-center"  style={{ backgroundColor: color }}>
      <div className="max-w-xl  mx-auto w-full bg-white shadow-lg overflow-hidden">
        <SectionHeader title="Ingredients" subtitle='Discover the key ingredients that make our product unique and effective.'/>
        <main className=" p-4 space-y-6 rounded-tl-3xl">
          <ProductDisplay  color={color} product={product} />
          <IngredientsSection />
        </main>
      </div>
      <CurvedBottomNav />
    </div>
  );
};

export default IngredientsPage;

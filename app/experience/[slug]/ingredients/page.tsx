// src/App.tsx
'use client'
import React from 'react';

// INTERNAL IMPORTS
import SectionHeader from '@/components/public/ThemeAwareSectionHeader';
import ProductDisplay from '../usage-instructions/components/ProductDisplay';
import IngredientsSection from './components/IngredientSection';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import CurvedBottomNav from '@/components/public/CurvedBottomNav';

const IngredientsPage: React.FC = () => {
  const { color, product } = usePublicExpStore();
  

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

// src/App.tsx
'use client'
import React from 'react';

// INTERNAL IMPORTS
import CurvedBottomNav from '@/components/public/CurvedBottomNav';
import SectionHeader from '@/components/public/ThemeAwareSectionHeader';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import InstructionsSection from './components/InstructionsSection';
import ProductDisplay from './components/ProductDisplay';

const DigitalInstructionsPage: React.FC = () => {
  const color = usePublicExpStore((state) => state.color);
  const { experience } = usePublicExpStore();
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center"
     style={{ backgroundColor: color }}>
      <div className="max-w-xl  mx-auto w-full bg-white shadow-lg overflow-hidden">
        <SectionHeader title="Instructions" subtitle="Discover how to use our product effectively." />
        <main className="p-4 space-y-6 rounded-tl-3xl">
          <ProductDisplay color={color} product={experience?.data?.product} />
          <InstructionsSection color={color} />

        </main>
      </div>
      <CurvedBottomNav />
    </div>
  );
};

export default DigitalInstructionsPage;

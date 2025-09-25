'use client';

import { useState, useEffect } from 'react';
import { SignupData } from '../page';

interface BrandInfoStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// app/auth/signup/steps/BrandInfoStep.tsx
export default function BrandInfoStep({ data, updateData, nextStep, prevStep }: BrandInfoStepProps) {
  // Remove subdomain logic, use brandSlug for public URLs
  const handleBrandNameChange = (name: string) => {
    const brandSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    updateData({ brandName: name, brandSlug });
  };
  const canProceed = data.brandName && data.brandSlug && data.brandSlug.length >= 3;
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/cxperia.png" alt="Cxperia Logo" className="h-16 mb-4" />
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Tell us about your brand
          </h1>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              value={data.brandName}
              onChange={(e) => handleBrandNameChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Nivea Skincare"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand URL Identifier
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-gray-600">
                myplatform.com/
              </span>
              <input
                type="text"
                value={data.brandSlug}
                onChange={(e) => updateData({ brandSlug: e.target.value })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="nivea-skincare"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              This will be used for your public experience URLs
            </p>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={prevStep}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
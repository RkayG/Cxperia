'use client';

import { useState, useEffect } from 'react';
import { SignupData } from '../page';

interface BrandInfoStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function BrandInfoStep({ data, updateData, nextStep, prevStep }: BrandInfoStepProps) {
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Generate subdomain from brand name
  useEffect(() => {
    if (data.brandName) {
      const generatedSubdomain = data.brandName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 30);
      
      updateData({ subdomain: generatedSubdomain });
      checkSubdomainAvailability(generatedSubdomain);
    }
  }, [data.brandName]);

  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain) return;
    
    setIsChecking(true);
    try {
      // Check against your API
      const response = await fetch(`/api/check-subdomain?subdomain=${subdomain}`);
      const { available } = await response.json();
      setIsSubdomainAvailable(available);
    } catch (error) {
      console.error('Error checking subdomain:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubdomainChange = (value: string) => {
    const cleaned = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .substring(0, 30);
    
    updateData({ subdomain: cleaned });
    checkSubdomainAvailability(cleaned);
  };

  const canProceed = data.brandName && data.subdomain && isSubdomainAvailable;

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your brand</h2>
      <p className="text-gray-600 mb-6">This will create your unique subdomain</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={data.brandName}
            onChange={(e) => updateData({ brandName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Glow Beauty Cosmetics"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Subdomain *
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={data.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your-brand"
            />
            <div className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-xl text-gray-600">
              .beautyplatform.com
            </div>
          </div>
          
          {data.subdomain && (
            <div className="mt-2 text-sm">
              {isChecking ? (
                <span className="text-blue-600">Checking availability...</span>
              ) : isSubdomainAvailable === true ? (
                <span className="text-green-600">✓ This subdomain is available!</span>
              ) : isSubdomainAvailable === false ? (
                <span className="text-red-600">✗ This subdomain is taken</span>
              ) : null}
            </div>
          )}
        </div>
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
  );
}
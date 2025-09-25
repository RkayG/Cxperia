'use client';

import { SignupData } from '../page';
import InputField from '@/components/input-field';

interface BrandInfoStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// app/auth/signup/steps/BrandInfoStep.tsx
export default function BrandInfoStep({ data, updateData, nextStep, prevStep }: BrandInfoStepProps) {
  // Only collect brand name and website URL
  return (
    <div className="  flex items-center justify-center  ">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-center bricolage-grotesque-light text-2xl font-bold text-gray-900">
            Tell us about your brand
          </h1>
        </div>
        <div className="space-y-6">
          <InputField
            id="brandName"
            type="text"
            label="Brand Name *"
            placeholder="e.g., Nivea Skincare"
            value={data.brandName}
            onChange={(value) => updateData({ brandName: value })}
          />
          <InputField
            id="brandWebsite"
            type="text"
            label="Brand Website URL *"
            placeholder="https://yourbrand.com"
            value={data.brandSlug}
            onChange={(value) => updateData({ brandSlug: value })}
          />
        </div>
      </div>
    </div>
  );
}
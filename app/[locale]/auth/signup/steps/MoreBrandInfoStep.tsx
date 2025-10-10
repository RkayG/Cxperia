'use client';

import InputField from '@/components/input-field';
import { SignupData } from '../page';

interface MoreBrandInfoStepProps {
  data: SignupData & {
    businessAddress?: string;
    zipCode?: string;
    city?: string;
    country?: string;
    contactInfo?: string;
  };
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function MoreBrandInfoStep({ data, updateData, nextStep, prevStep }: MoreBrandInfoStepProps) {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-center bricolage-grotesque-light text-2xl font-bold text-gray-900">
            Tell us a bit more about your brand
          </h1>
        </div>
        <div className="space-y-6">
          <InputField
            id="businessAddress"
            type="text"
            label="Business Address *"
            placeholder="123 Avenue des Champs-Élysées"
            value={data.businessAddress || ''}
            onChange={(value) => updateData({ businessAddress: value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="zipCode"
              type="text"
              label="Zip Code *"
              placeholder="75008"
              value={data.zipCode || ''}
              onChange={(value) => updateData({ zipCode: value })}
            />
            <InputField
              id="city"
              type="text"
              label="City *"
              placeholder="Paris"
              value={data.city || ''}
              onChange={(value) => updateData({ city: value })}
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              id="country"
              value={data.country || 'France'}
              onChange={(e) => updateData({ country: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
            >
              <option value="France">France</option>
            </select>
          </div>
          <InputField
            id="contactInfo"
            type="text"
            label="Contact Info *"
            placeholder="+33 1 23 45 67 89"
            value={data.contactInfo || ''}
            onChange={(value) => updateData({ contactInfo: value })}
          />
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { SignupData } from '../page';
import InputField from '@/components/input-field';

interface AccountInfoStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

// app/auth/signup/steps/AccountInfoStep.tsx
export default function AccountInfoStep({ data, updateData, nextStep, prevStep }: AccountInfoStepProps) {
   const [showPassword, setShowPassword] = useState(false);

  const canProceed = data.firstName && data.lastName && data.email;

  
  // Now we collect first/last name separately
  return (
    <div className="flex items-center max-h-[500px] overflow-y-auto  justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-5">
          <h1 className="text-center text-2xl bricolage-grotesque-light font-bold text-gray-900">
            Create your account
          </h1>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              type="text"
              label="First Name *"
              placeholder="John"
              value={data.firstName}
              onChange={(value) => updateData({ firstName: value })}
            />
            <InputField
              id="lastName"
              type="text"
              label="Last Name *"
              placeholder="Doe"
              value={data.lastName}
              onChange={(value) => updateData({ lastName: value })}
            />
          </div>
          <InputField
            id="email"
            type="email"
            label="Business Email *"
            placeholder="you@company.com"
            value={data.email}
            onChange={(value) => updateData({ email: value })}
          />
          {/* Password fields moved to ConfirmPasswordStep */}
  
        </div>
      </div>
    </div>
  );
}
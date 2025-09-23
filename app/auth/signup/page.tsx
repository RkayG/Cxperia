'use client';

import { useState } from 'react';
import WelcomeStep from './steps/WelcomeStep';
import BrandInfoStep from './steps/BrandInfoStep';
import AccountInfoStep from './steps/AccountInfoStep';
import ProcessingStep from './steps/ProcessingStep';
import SuccessStep from './steps/SuccessStep';

export interface SignupData {
  brandName: string;
  brandType: 'beauty' | 'fashion' | 'wellness' | 'other';
  subdomain: string;
  fullName: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState<SignupData>({
    brandName: '',
    brandType: 'beauty',
    subdomain: '',
    fullName: '',
    email: '',
    password: ''
  });

  const updateSignupData = (updates: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const steps = [
    { component: WelcomeStep, title: "Welcome" },
    { component: BrandInfoStep, title: "Brand Info" },
    { component: AccountInfoStep, title: "Account" },
    { component: ProcessingStep, title: "Processing" },
    { component: SuccessStep, title: "Success" }
  ];

  const CurrentStepComponent = steps[step - 1]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.slice(0, 3).map((_, index) => (
              <span 
                key={index}
                className={`text-sm font-medium ${
                  step > index + 1 ? 'text-green-600' : 
                  step === index + 1 ? 'text-purple-600' : 'text-gray-400'
                }`}
              >
                Step {index + 1}
              </span>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (steps.length - 2)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={signupData}
              updateData={updateSignupData}
              nextStep={nextStep}
              prevStep={prevStep}
              currentStep={step}
              totalSteps={steps.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}
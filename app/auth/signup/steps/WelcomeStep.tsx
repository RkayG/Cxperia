'use client';

import { SignupData } from '../page';


interface WelcomeStepProps {
  data: SignupData;
  updateData: (updates: Partial<SignupData>) => void;
  nextStep: () => void;
}

export default function WelcomeStep({ nextStep }: WelcomeStepProps) {
  return (
    <div className=" flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl bricolage-grotesque font-bold text-gray-900 mb-4 text-center">
            Welcome
          </h1>
        </div>
      </div>
    </div>
  );
}
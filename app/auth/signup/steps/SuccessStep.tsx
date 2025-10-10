// app/auth/signup/steps/SuccessStep.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SignupData } from '../page';

interface SuccessStepProps {
  data: SignupData;
}

// app/auth/signup/steps/SuccessStep.tsx
export default function SuccessStep({ data }: SuccessStepProps) {
  
  const router = useRouter();
useEffect(() => {
  const timer = setTimeout(() => {
    router.push('/get-demo');
  }, 3000);
  return () => clearTimeout(timer);
}, [router]);

  return (
    <div className="flex items-center bricolage-grotesque-light justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-center bricolage-grotesque-light text-3xl font-bold text-gray-900">
            Welcome {data.brandName} to Cxperia!
          </h1>
        </div>
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
        </div>
        <p className="text-gray-600 mb-6">
          Your brand has been created successfully. Redirecting to schedule your demo...
        </p>
      
        <div className="animate-pulse text-sm text-gray-500">
          <a 
            href="/get-demo"
            className="text-blue-600 hover:text-blue-700"
          >
            Click here if you're not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
}
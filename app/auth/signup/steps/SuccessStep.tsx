// app/auth/signup/steps/SuccessStep.tsx
'use client';

import { useEffect } from 'react';
import { SignupData } from '../page';

interface SuccessStepProps {
  data: SignupData;
}

// app/auth/signup/steps/SuccessStep.tsx
export default function SuccessStep({ data }: SuccessStepProps) {
  useEffect(() => {
    // Redirect to dashboard (not subdomain)
    const timer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/cxperia.png" alt="Cxperia Logo" className="h-16 mb-4" />
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Welcome to {data.brandName}!
          </h1>
        </div>
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
          <span className="text-3xl text-white">🎉</span>
        </div>
        <p className="text-gray-600 mb-6">
          Your brand has been created successfully. Redirecting to your dashboard...
        </p>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700">
            Your public URL: 
            <span className="font-mono text-green-600 ml-2">
              myplatform.com/{data.brandSlug}/exp/[experience-id]
            </span>
          </p>
        </div>
        <div className="animate-pulse text-sm text-gray-500">
          <a 
            href="/dashboard"
            className="text-blue-600 hover:text-blue-700"
          >
            Click here if you're not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
}
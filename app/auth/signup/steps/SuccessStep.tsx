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
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
        <span className="text-3xl text-white">🎉</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to {data.brandName}!
      </h2>
      
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
  );
}
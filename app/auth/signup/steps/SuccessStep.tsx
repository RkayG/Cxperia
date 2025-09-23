'use client';

import { useEffect } from 'react';
import { SignupData } from '../page';

interface SuccessStepProps {
  data: SignupData;
}

export default function SuccessStep({ data }: SuccessStepProps) {
  useEffect(() => {
    // Redirect to their subdomain after a delay
    const timer = setTimeout(() => {
      window.location.href = `https://${data.subdomain}.beautyplatform.com/dashboard`;
    }, 3000);

    return () => clearTimeout(timer);
  }, [data.subdomain]);

  return (
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
        <span className="text-3xl text-white">🎉</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to {data.brandName}!
      </h2>
      
      <p className="text-gray-600 mb-6">
        Your brand space is ready. You'll be redirected to your dashboard shortly.
      </p>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-700">
          Your brand URL: 
          <a 
            href={`https://${data.subdomain}.beautyplatform.com`}
            className="font-mono text-green-600 hover:text-green-700 ml-2"
          >
            {data.subdomain}.beautyplatform.com
          </a>
        </p>
      </div>

      <div className="animate-pulse text-sm text-gray-500">
        Redirecting to your dashboard...
      </div>
    </div>
  );
}
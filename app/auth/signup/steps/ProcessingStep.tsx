// app/auth/signup/steps/ProcessingStep.tsx
'use client';

import { useEffect, useState } from 'react';
import { SignupData } from '../page';
import { completeSignup } from '@/lib/auth-signup';
import EmailVerificationStep from './EmailVerificationStep';

interface ProcessingStepProps {
  data: SignupData;
  nextStep: () => void;
}

export default function ProcessingStep({ data, nextStep }: ProcessingStepProps) {
  const [status, setStatus] = useState<'processing' | 'email_sent' | 'error'>('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const processSignup = async () => {
      try {
        setStatus('processing');
        
        const result = await completeSignup(data);
        
        if (result) {
          setStatus('email_sent');
          // Don't auto-redirect - wait for email confirmation
        }
      } catch (error: any) {
        setStatus('error');
        setError(error.message);
      }
    };

    processSignup();
  }, [data]);

  if (status === 'error') {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Signup Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === 'email_sent') {
    return <EmailVerificationStep email={data.email} />;
  }

  return (
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Creating your account...
      </h2>
      
      <p className="text-gray-600">Setting up your brand space</p>
    </div>
  );
}
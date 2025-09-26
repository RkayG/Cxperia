// app/auth/signup/steps/ProcessingStep.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { SignupData } from '../page';
import { completeSignup } from '@/lib/auth-signup';
import CodeVerificationStep from './CodeVerificationStep';

interface ProcessingStepProps {
  data: SignupData;
  nextStep: () => void;
}

export default function ProcessingStep({ data, nextStep }: ProcessingStepProps) {
  const [status, setStatus] = useState<'processing' | 'email_sent' | 'error'>('processing');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) {
      return;
    }

    const processSignup = async () => {
      try {
        setStatus('processing');
        
        const { userId } = await completeSignup(data);
        
        if (userId) {
          setUserId(userId);
          setStatus('email_sent');
        } else {
          throw new Error("Signup completed but user ID was not returned.");
        }
      } catch (error: any) {
        console.error("Signup process failed:", error); // Keep for debugging
        setStatus('error');
        if (error.message?.includes('duplicate key value violates unique constraint')) {
            setError('An account with this email or brand name already exists.');
        } else if (error.message?.includes('is invalid')) {
            setError('The email address you entered is invalid. Please check it and try again.');
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
      }
    };

    processSignup();

    return () => {
      effectRan.current = true;
    };
  }, [data]);

  if (status === 'error') {
    return (
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mt-10 mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">❌</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Signup Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
       {/*  <button
          onClick={() => window.location.reload()}
          className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600"
        >
          Try Again
        </button> */}
      </div>
    );
  }

  if (status === 'email_sent' && userId) {
    return <CodeVerificationStep email={data.email} userId={userId} onSuccess={nextStep} />;
  }

  return (
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mt-10 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Creating your account...
      </h2>
      
      <p className="text-gray-600">Setting up your brand space</p>
    </div>
  );
}
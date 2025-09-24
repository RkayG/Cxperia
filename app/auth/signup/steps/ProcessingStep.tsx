'use client';

import { useEffect, useRef} from 'react';
import { SignupData } from '../page';
import { completeSignup } from '@/lib/auth-signup';

interface ProcessingStepProps {
  data: SignupData;
  nextStep: () => void;
}

export default function ProcessingStep({ data, nextStep }: ProcessingStepProps) {
   const hasStarted = useRef(false); // Prevent multiple executions

  useEffect(() => {
    // Only run once
    if (hasStarted.current) return;
    hasStarted.current = true;

    console.log('🚀 Starting signup process...');

    const processSignup = async () => {
      try {
        const success = await completeSignup(data);
        
        if (success) {
          console.log('✅ Signup successful, proceeding to next step');
          setTimeout(nextStep, 1500);
        }
      } catch (error) {
        console.error('❌ Signup failed:', error);
        // Handle error state (show error message to user)
      }
    };

    processSignup();
  }, [data, nextStep]); 


  return (
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Creating your brand space...
      </h2>

      <div className="mt-8 space-y-2">
      
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2 animate-pulse" style={{animationDelay: '0.6s'}}></span>
          <span>Preparing your dashboard</span>
        </div>
      </div>
    </div>
  );
}
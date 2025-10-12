// app/auth/signup/steps/EmailVerificationStep.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EmailVerificationStepProps {
  email: string;
}

export default function EmailVerificationStep({ email }: EmailVerificationStepProps) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Countdown timer for resend email
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setCountdown(60);
      setCanResend(false);
    } catch (error) {
      //console.error('Error resending email:', error);
    }
  };

  return (
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
        <span className="text-3xl text-white">✉️</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Check your email!
      </h2>
      
      <p className="text-gray-600 mb-2">
        We've sent a confirmation link to:
      </p>
      <p className="font-mono text-blue-600 mb-6">{email}</p>

      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What's next?</h3>
        <ul className="text-sm text-blue-800 text-left space-y-1">
          <li>• Check your inbox for an email from us</li>
          <li>• Click the confirmation link in the email</li>
          <li>• You'll be redirected to your dashboard</li>
        </ul>
      </div>

      <div className="text-sm text-gray-600">
        {canResend ? (
          <button
            onClick={handleResendEmail}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Resend confirmation email
          </button>
        ) : (
          <p>Resend email in {countdown} seconds</p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-500">
          Already confirmed your email?{' '}
          <a href="/auth/login" className="text-blue-600 hover:text-blue-700">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
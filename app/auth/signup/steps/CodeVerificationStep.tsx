// app/auth/signup/steps/CodeVerificationStep.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CodeVerificationStepProps {
  email: string;
  userId: string;
  onSuccess: () => void;
}

export default function CodeVerificationStep({ email, userId, onSuccess }: CodeVerificationStepProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('email_confirmations')
        .select('*')
        .eq('confirmation_code', fullCode)
        .eq('user_id', userId)
        .eq('used', false)
        .gt('expires_at', new Date())
        .single();

      if (error || !data) {
        setError('Invalid or expired code');
        return;
      }

      // Mark code as used
      await supabase
        .from('email_confirmations')
        .update({ used: true })
        .eq('id', data.id);

      // Update user as confirmed
      await supabase.auth.updateUser({
        data: { email_confirmed: true }
      });

      onSuccess();
    } catch (error) {
      setError('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center animate-fade-in">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
        <span className="text-3xl text-white">🔒</span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Enter Confirmation Code
      </h2>
      
      <p className="text-gray-600 mb-2">
        We sent a 6-digit code to:
      </p>
      <p className="font-mono text-purple-600 mb-6">{email}</p>

      <div className="flex justify-center space-x-2 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(e.target.value, index)}
            className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
          />
        ))}
      </div>

      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}

      <button
        onClick={handleVerify}
        disabled={isLoading || code.join('').length !== 6}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-50"
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <button 
          onClick={() => {/* Resend code logic */}}
          className="text-purple-600 hover:text-purple-700"
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
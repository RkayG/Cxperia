// app/auth/activate/page.tsx
'use client';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import InputField from '@/components/input-field';
import logo from '@/assets/logo.png';
import Image from 'next/image';

export default function ActivateAccount() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Check if we have a valid token on page load
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError('Invalid or missing activation link');
        return;
      }

      try {
        // Verify the token and get user email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (error) {
          setError('Invalid or expired activation link');
        } else if (data.user) {
          setUserEmail(data.user.email || 'your account');
        }
      } catch (error) {
        setError('Error validating activation link');
      }
    };

    checkToken();
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error('No activation token found');
      }

      // First verify the token again to ensure it's valid
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      });

      if (verifyError) throw verifyError;
      if (!verifyData.user) throw new Error('No user associated with this token');

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // Sign in the user automatically
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: verifyData.user.email!,
        password: password
      });

      if (signInError) throw signInError;

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Failed to activate account');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleActivate(e);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Activation Link</h1>
          <p className="text-gray-600 mb-6">
            This activation link is invalid or has expired. Please contact support for assistance.
          </p>
          <a href="/contact" className="text-purple-600 hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Activated!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been successfully activated. Redirecting you to your dashboard...
          </p>
          <div className="animate-pulse text-purple-600">Taking you to your dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Left: Welcome Text */}
      <div className="relative hidden lg:flex items-center justify-center">
        <div className="text-center w-full max-w-xl">
          <h1 className="font-black text-4xl bricolage-grotesque-light text-[#502274] leading-tight mb-6">
            Activate Your BeautyConnect Account
          </h1>
          <p className="text-lg text-gray-600">
            Set your password to start creating amazing digital experiences for your customers.
          </p>
        </div>
      </div>

      {/* Right: Activation Form */}
      <div className="flex flex-col bg-white gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center mb-8">
              <Image 
                src={logo} 
                alt="BeautyConnect Logo" 
                className="h-16 w-36 mb-4"
                priority
              />
              <h1 className="text-center text-3xl font-bold text-gray-900">
                Set Your Password
              </h1>
              {userEmail && (
                <p className="text-gray-600 mt-2 text-center">
                  Welcome! Set a password for <strong>{userEmail}</strong>
                </p>
              )}
            </div>

            <form onSubmit={handleActivate} className="space-y-6">
              <InputField
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                placeholder="Enter at least 6 characters"
                value={password}
                onChange={setPassword}
                onKeyPress={handleKeyPress}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
                autoComplete="new-password"
                required
              />
              
              <InputField
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                onKeyPress={handleKeyPress}
                autoComplete="new-password"
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Password requirements:</strong> At least 6 characters long
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-700 text-sm text-center font-medium">
                    {error}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Activating Account...
                  </span>
                ) : (
                  'Activate Account'
                )}
              </button>
            </form>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <a href="/contact" className="text-purple-600 font-semibold hover:underline">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import InputField from '@/components/input-field';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  // Clear error when user starts typing
  useEffect(() => {
    setError(null);
  }, [email, password]);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        router.push(redirectTo);
      }
    } catch (error: any) {
      setError('An unexpected error occurred');
      //console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Left: Engaging Text */}
      <div className="relative hidden lg:flex items-center justify-center">
        <div className="text-center w-full  max-w-xl">
          <h1 className="font-black text-4xl bricolage-grotesque-light md:text-4xl lg:text-4xl text-[#502274] leading-tight mb-6">
            Sign in to your beauty dashboard to unlock new digital experiences.
          </h1>
         
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-col bg-white gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center mb-8">
              <Image 
                src={logo} 
                alt="Cxperia Logo" 
                className="h-16 w-36 mb-4"
                priority
              />
              <h1 className="text-center text-3xl font-bold text-gray-900">
                Welcome back
              </h1>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <InputField
                id="email"
                type="email"
                label="Email"
                placeholder="team@cxperia.com"
                value={email}
                onChange={setEmail}
                onKeyPress={handleKeyPress}
                autoComplete="email"
                required
              />
              
              <InputField
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                onKeyPress={handleKeyPress}
                showPasswordToggle={true}
                onTogglePassword={() => setShowPassword(!showPassword)}
                showPassword={showPassword}
                autoComplete="current-password"
                required
              />
              
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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

          
          </div>
        </div>
      </div>
    </div>
  );
}
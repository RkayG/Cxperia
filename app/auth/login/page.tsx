'use client';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import InputField from '@/components/input-field';
import SocialButton from '@/components/SocialButton';
import logo from '@/assets/logo.png';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center mb-8">
          <Image src={logo} alt="Cxperia Logo" className="h-16 w-36 " />
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Welcome back
          </h1>
        </div>
        <div className="space-y-6">
          <InputField
            id="email"
            type="email"
            label="Email"
            placeholder="example.email@gmail.com"
            value={email}
            onChange={setEmail}
          />
          <InputField
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter at least 8+ characters"
            value={password}
            onChange={setPassword}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            onClick={handleSignIn}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">Or sign in with</p>
          <div className="flex justify-center space-x-4">
            <SocialButton 
              provider="google" 
              onClick={() => handleSocialLogin('google')} 
            />
            <SocialButton 
              provider="facebook" 
              onClick={() => handleSocialLogin('facebook')} 
            />
            <SocialButton 
              provider="apple" 
              onClick={() => handleSocialLogin('apple')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

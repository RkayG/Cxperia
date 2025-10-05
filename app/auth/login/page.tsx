'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import InputField from '@/components/input-field';
import { createClient } from '@/lib/supabase/client'; 
import { showToast } from '@/lib/toast';

function AuthPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isActivationMode, setIsActivationMode] = useState(false);
  const [hasHandledHash, setHasHandledHash] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Create Supabase client
  const supabase = createClient();
  
  // Check URL parameters to determine mode
  const token = searchParams.get('token');
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  console.log('URL Search Params:', {
    token: searchParams.get('token'),
    access_token: searchParams.get('access_token'), // This will be null
    redirect: searchParams.get('redirect')
  });
  console.log('Window location hash:', window.location.hash);

  // Determine if we're in activation mode
  useEffect(() => {
    // Check for hash fragment first (Supabase magic link)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token') && !hasHandledHash) {
      console.log('Found access token in hash fragment');
      handleMagicLinkAuth();
      return;
    }

    // Check for OTP token in query parameters (traditional activation)
    if (token) {
      console.log('Found OTP token in query parameters');
      setIsActivationMode(true);
      checkActivationToken(token);
    }
  }, [token, hasHandledHash]);

  // Handle magic link authentication (URL with access_token in hash)
  const handleMagicLinkAuth = async () => {
    setLoading(true);
    setHasHandledHash(true);
    
    try {
      const hash = window.location.hash;
      console.log('Processing hash:', hash);
      
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1)); // Remove the #
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        const token_type = params.get('token_type');
        const type = params.get('type'); // Check if it's signup
        
        console.log('Extracted tokens:', { access_token, refresh_token, token_type, type });

        if (access_token && refresh_token && token_type) {
          // If it's a signup (activation), show activation form
          if (type === 'signup') {
            console.log('Signup flow detected - switching to activation mode');
            setIsActivationMode(true);
            
            // Get user info from the token to display email
            const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
            if (!userError && user) {
              setUserEmail(user.email || 'your account');
            }
            
            // Store tokens for later use in activation
            sessionStorage.setItem('activation_tokens', JSON.stringify({
              access_token,
              refresh_token
            }));
          } else {
            // Regular magic link login - set session and redirect
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              console.error('Session set error:', error);
              setError('Authentication failed: ' + error.message);
            } else {
              console.log('Session set successfully');
              // Clean URL by removing hash fragment
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              
              // Force a page reload to ensure middleware picks up the new session
              window.location.href = redirectTo;
              return;
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Magic link auth error:', error);
      setError('Authentication error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check activation token validity (for OTP tokens)
  const checkActivationToken = async (tokenHash: string) => {
    try {
      console.log('Verifying OTP token:', tokenHash);
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'signup'
      });

      if (error) {
        console.error('OTP verification error:', error);
        setError('Invalid or expired activation link');
      } else if (data.user) {
        console.log('OTP token valid for user:', data.user.email);
        setUserEmail(data.user.email || 'your account');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setError('Error validating activation link');
    }
  };

  // Activation form submission
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
      // Check if we have stored tokens from hash fragment
      const storedTokens = sessionStorage.getItem('activation_tokens');
      let userEmailForLogin = userEmail;

      if (storedTokens) {
        // Using magic link flow
        const { access_token, refresh_token } = JSON.parse(storedTokens) as { access_token: string; refresh_token: string };
        console.log('Using stored tokens for activation');

        // Set session first
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (sessionError) throw sessionError;

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });

        if (updateError) throw updateError;

        // Get user email for login
        const { data: { user } } = await supabase.auth.getUser();
        userEmailForLogin = user?.email || userEmail;

        // Clean up stored tokens
        sessionStorage.removeItem('activation_tokens');
        
      } else if (token) {
        // Using OTP token flow
        console.log('Using OTP token for activation');
        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (verifyError) throw verifyError;
        if (!verifyData.user) throw new Error('No user associated with this token');

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });

        if (updateError) throw updateError;

        userEmailForLogin = verifyData.user.email!;
      } else {
        throw new Error('No activation method found');
      }

      // Sign in the user automatically to establish proper session
      if (userEmailForLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmailForLogin,
          password: password
        });

        if (signInError) throw signInError;
      }

      setSuccess(true);
      console.log('Account activated successfully');
      
      setTimeout(() => {
        // Force a page reload to ensure middleware picks up the new session
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error: any) {
      console.error('Activation error:', error);
      setError(error.message || 'Failed to activate account');
    } finally {
      setLoading(false);
    }
  };

  // Regular login submission
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
      
      console.log('Sign-in response:', { data, error });
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Check user role for redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role === 'super_admin' || profile?.role === 'sales_admin') {
          showToast.error('Please use the admin login page to access the admin dashboard.');
          await supabase.auth.signOut();
        } else {
          console.log('Sign in successful, redirecting to:', redirectTo);
          // Force a page reload to ensure middleware picks up the new session
          window.location.href = redirectTo;
        }
      }
    } catch (error: any) {
      console.log('Error signing in:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isActivationMode) {
        handleActivate(e);
      } else {
        handleSignIn();
      }
    }
  };

  // Show loading during initial hash processing
  if (loading && !isActivationMode && window.location.hash.includes('access_token')) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
          <svg className="animate-spin h-8 w-8 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div className="text-purple-700 font-medium">Processing your request...</div>
        </div>
      </div>
    );
  }

  // Activation mode UI
  if (isActivationMode) {
    if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg  p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Activated!</h1>
            <p className="text-gray-600 mb-6">Redirecting to your dashboard...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: Welcome Text */}
        <div className="relative hidden lg:flex items-center justify-center">
          <div className="text-center w-full max-w-xl">
            <h1 className="font-black text-4xl text-[#502274] leading-tight mb-6">
              Activate Your Account
            </h1>
            <p className="text-lg text-gray-600">
              Set your password to start using your account.
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
                  alt="Logo" 
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
                  {loading ? 'Activating...' : 'Activate Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular login mode UI
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="flex flex-col bg-white gap-4 p-6 md:p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src={logo} 
            alt="Logo" 
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
            placeholder=""
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
            placeholder=""
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
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
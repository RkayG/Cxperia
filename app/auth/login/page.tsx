'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import InputField from '@/components/input-field';
import { createClient } from '@/lib/supabase/client'; 
import { showToast } from '@/lib/toast';
// Removed subdomain imports - no longer needed

function AuthPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [brandName, setBrandName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isActivationMode, setIsActivationMode] = useState(false);
  const [hasHandledHash, setHasHandledHash] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Create Supabase client
  const supabase = createClient();
  
  // Check URL parameters to determine mode
  const token = searchParams.get('token');
  const redirectTo = searchParams.get('redirect') || '/dashboard';

/*   console.log('URL Search Params:', {
    token: searchParams.get('token'),
    access_token: searchParams.get('access_token'), // This will be null
    redirect: searchParams.get('redirect')
  }); */
  //console.log('Window location hash:', window.location.hash);

  // Determine if we're in activation mode
  useEffect(() => {
    // Check for hash fragment first (Supabase magic link)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token') && !hasHandledHash) {
      //console.log('Found access token in hash fragment');
      handleMagicLinkAuth();
      return;
    }

    // Check for OTP token in query parameters (traditional activation)
    if (token) {
     // console.log('Found OTP token in query parameters');
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
      //console.log('Processing hash:', hash);
      
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1)); // Remove the #
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        const token_type = params.get('token_type');
        const type = params.get('type'); // Check if it's signup
        
        //console.log('Extracted tokens:', { access_token, refresh_token, token_type, type });

        if (access_token && refresh_token && token_type) {
          // If it's a signup (activation), show activation form
          if (type === 'signup') {
            //console.log('Signup flow detected - switching to activation mode');
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
              //console.error('Session set error:', error);
              setError('Échec de l\'authentification : ' + error.message);
            } else {
              //console.log('Session set successfully');
              // Clean URL by removing hash fragment
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
              
              // Simple redirect to dashboard
              window.location.href = redirectTo;
              return;
            }
          }
        }
      }
    } catch (error: any) {
      // console.error('Magic link auth error:', error);
      setError('Erreur d\'authentification : ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check activation token validity (for OTP tokens)
  const checkActivationToken = async (tokenHash: string) => {
    try {
      //console.log('Verifying OTP token:', tokenHash);
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'signup'
      });

      if (error) {
        //console.error('OTP verification error:', error);
        setError('Lien d\'activation invalide ou expiré');
      } else if (data.user) {
        //console.log('OTP token valid for user:', data.user.email);
        setUserEmail(data.user.email || 'votre compte');
      }
    } catch (error) {
      //console.error('Token validation error:', error);
      setError('Erreur lors de la validation du lien d\'activation');
    }
  };

  // Activation form submission
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
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
        //console.log('Using stored tokens for activation');

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
        //console.log('Using OTP token for activation');
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
      //console.log('Account activated successfully');
      
      setTimeout(() => {
        // Simple redirect to dashboard
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error: any) {
      //console.error('Activation error:', error);
      setError(error.message || 'Échec de l\'activation du compte');
    } finally {
      setLoading(false);
    }
  };

  // Signup submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          brandName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError((data as { error?: string }).error || 'Erreur lors de la création du compte');
        return;
      }

      if ((data as { success?: boolean }).success) {
        setSuccess(true);
        setUserEmail(email);
        showToast.success('Compte créé avec succès!');
        
        // Auto-login after successful signup
        setTimeout(async () => {
          try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (!loginError) {
              router.push('/dashboard');
            } else {
              setError('Compte créé mais connexion échouée. Veuillez vous connecter manuellement.');
            }
          } catch (loginErr) {
            setError('Compte créé mais connexion échouée. Veuillez vous connecter manuellement.');
          }
        }, 1500);
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  // Regular login submission
  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      //console.log('Sign-in response:', { data, error });
      
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
          //  console.log('Admin user detected, redirecting to admin dashboard');
          // Force a page reload to ensure middleware picks up the new session
          window.location.href = '/admin/dashboard';
        } else {
          //console.log('Sign in successful, redirecting to dashboard');
          // Simple redirect to dashboard
          window.location.href = redirectTo;
        }
      }
    } catch (error: any) {
      //console.log('Error signing in:', error);
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isActivationMode) {
        handleActivate(e);
      } else if (isSignupMode) {
        handleSignUp(e);
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
          <div className="text-purple-700 font-medium">Traitement de votre demande...</div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Compte activé !</h1>
            <p className="text-gray-600 mb-6">Redirection vers votre tableau de bord...</p>
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
              Activez votre compte
            </h1>
            <p className="text-lg text-gray-600">
              Définissez votre mot de passe pour commencer à utiliser votre compte.
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
                  Définissez votre mot de passe
                </h1>
                {userEmail && (
                  <p className="text-gray-600 mt-2 text-center">
                    Bienvenue ! Définissez un mot de passe pour <strong>{userEmail}</strong>
                  </p>
                )}
              </div>

              <form onSubmit={handleActivate} className="space-y-6">
                <InputField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Nouveau mot de passe"
                  placeholder="Entrez au moins 6 caractères"
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
                  label="Confirmer le mot de passe"
                  placeholder="Répétez votre mot de passe"
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
                  {loading ? 'Activation...' : 'Activer le compte'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular login/signup mode UI
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
            {isSignupMode ? 'Créer un compte' : 'Bon retour'}
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            {isSignupMode ? 'Rejoignez Cxperia et commencez à créer des expériences' : 'Connectez-vous à votre compte'}
          </p>
        </div>

        <form onSubmit={isSignupMode ? handleSignUp : handleSignIn} className="space-y-6">
          {isSignupMode && (
            <InputField
              id="brandName"
              type="text"
              label="Nom de votre marque"
              placeholder="Ex: Ma Belle Marque"
              value={brandName}
              onChange={setBrandName}
              onKeyPress={handleKeyPress}
              autoComplete="organization"
              required
            />
          )}
          
          <InputField
            id="email"
            type="email"
            label="Email"
            placeholder="votre@entreprise.com"
            value={email}
            onChange={setEmail}
            onKeyPress={handleKeyPress}
            autoComplete="email"
            required
          />
          
          <InputField
            id="password"
            type={showPassword ? 'text' : 'password'}
            label={isSignupMode ? 'Mot de passe' : 'Mot de passe'}
            placeholder={isSignupMode ? 'Au moins 6 caractères' : 'Entrez votre mot de passe'}
            value={password}
            onChange={setPassword}
            onKeyPress={handleKeyPress}
            showPasswordToggle={true}
            onTogglePassword={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
            autoComplete={isSignupMode ? 'new-password' : 'current-password'}
            required
          />
          
          {isSignupMode && (
            <InputField
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              label="Confirmer le mot de passe"
              placeholder="Répétez votre mot de passe"
              value={confirmPassword}
              onChange={setConfirmPassword}
              onKeyPress={handleKeyPress}
              autoComplete="new-password"
              required
            />
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-700 text-sm text-center font-medium">
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-700 text-sm text-center font-medium">
                {isSignupMode ? 'Compte créé avec succès! Redirection...' : 'Connexion réussie! Redirection...'}
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? (isSignupMode ? 'Création...' : 'Connexion...') 
              : (isSignupMode ? 'Créer le compte' : 'Se connecter')
            }
          </button>
        </form>

        {/* Toggle between login and signup */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isSignupMode ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
            <button
              type="button"
              onClick={() => {
                setIsSignupMode(!isSignupMode);
                setError(null);
                setSuccess(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setBrandName('');
              }}
              className="ml-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              {isSignupMode ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>
        </div>
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
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
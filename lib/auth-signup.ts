// lib/auth-signup.ts
import { supabase } from './supabase';
import { SignupData } from '../app/auth/signup/page';

export async function completeSignup(data: SignupData) {
  try {
    // 1. Create brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .insert({
        name: data.brandName,
        brand_slug: data.brandSlug,
      })
      .select()
      .single();

    if (brandError) throw brandError;

    // 2. Create user WITHOUT email confirmation (we'll handle it)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'brand_admin',
          brand_id: brand.id,
          email_confirmed: false // Custom flag
        }
      }
    });

    if (signUpError) throw signUpError;

    // 3. Generate and store confirmation code
    const confirmationCode = Math.random().toString().slice(2, 8); // 6-digit code
    
    const { error: codeError } = await supabase
      .from('email_confirmations')
      .insert({
        user_id: authData.user?.id,
        email: data.email,
        confirmation_code: confirmationCode,
        expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      });

    if (codeError) throw codeError;

    // 4. Send email with code (you'll need an email service)
    await sendConfirmationCodeEmail(data.email, confirmationCode);

    return {
      success: true,
      userId: authData.user?.id,
      email: data.email,
      requiresConfirmation: true
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
}

// Email service function (you'll need to implement this)
async function sendConfirmationCodeEmail(email: string, code: string) {
  // Use Resend, SendGrid, or any email service
  // Example with Resend:
  const response = await fetch('/api/send-confirmation-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  
  if (!response.ok) throw new Error('Failed to send confirmation email');
}
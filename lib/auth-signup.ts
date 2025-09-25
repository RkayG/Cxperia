// lib/auth-signup.ts
import { supabase } from './supabase';
import { SignupData } from '@/app/auth/signup/page';

export async function completeSignup(data: SignupData) {
  try {
    // 1. Create brand first
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .insert({
        name: data.brandName,
        brand_slug: data.brandSlug,
      })
      .select()
      .single();

    if (brandError) throw brandError;

    // 2. Create user with Supabase Auth (will send confirmation email)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'brand_admin',
          brand_id: brand.id
        },
        // Optional: Customize the email template
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      }
    });

    if (signUpError) throw signUpError;

    return {
      success: true,
      user: authData.user,
      brand: brand,
      // Supabase will have sent the confirmation email automatically
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    throw error;
  }
}
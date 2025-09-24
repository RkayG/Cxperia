// lib/auth-signup.ts
import { supabase } from '@/lib/supabase';
import { type SignupData } from '@/app/auth/signup/page';

export async function completeSignup(data: SignupData): Promise<boolean> {
  try {
    // 1. First create the brand
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .insert({
        name: data.brandName,
        brand_slug: data.brandSlug,
      })
      .select()
      .single();

    if (brandError) throw brandError;

    // 2. Create the user with Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: 'brand_admin',
          brand_id: brand.id // Pass brand context
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('User creation failed');

    // 3. Update the profile with brand_id (trigger should handle this, but we ensure it)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ brand_id: brand.id })
      .eq('id', authData.user.id);

    if (profileError) {
      console.warn('Profile update warning:', profileError);
      // Non-critical error, continue
    }

    return true;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}
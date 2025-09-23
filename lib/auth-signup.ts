import { supabase } from './supabase';

export interface SignupData {
  brandName: string;
  brandType: string;
  subdomain: string;
  fullName: string;
  email: string;
  password: string;
}

export async function completeSignup(data: SignupData): Promise<boolean> {
  try {
    // 1. Create the tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: data.brandName,
        slug: data.subdomain,
        type: data.brandType,
        industry: data.brandType,
        status: 'active'
      })
      .select()
      .single();

    if (tenantError) throw tenantError;

    // 2. Create auth user with tenant context
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.fullName.split(' ')[0],
          last_name: data.fullName.split(' ').slice(1).join(' '),
          role: 'tenant_admin',
          tenant_id: tenant.id
        }
      }
    });

    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('User creation failed');

    return true;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

// Check subdomain availability
export async function checkSubdomainAvailability(subdomain: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('tenants')
    .select('slug')
    .eq('slug', subdomain)
    .single();

  return !data; // Available if no tenant found
}
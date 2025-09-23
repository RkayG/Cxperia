import { supabase } from './supabase';

export interface SignupData {
  brandName: string;
  subdomain: string;
  fullName: string;
  email: string;
  password: string;
}

let signupCallCount = 0; // Track calls

export async function completeSignup(data: SignupData): Promise<boolean> {
  signupCallCount++;
  console.log(`🔍 Signup call #${signupCallCount}`, data);
  
  try {
    // Check if tenant already exists first
    console.log('🔍 Checking if tenant exists...');
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', data.subdomain)
      .single();

    if (existingTenant) {
      console.log('❌ Tenant already exists, aborting');
      throw new Error('Tenant with this subdomain already exists');
    }

    console.log('🔍 Creating tenant...');
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: data.brandName,
        slug: data.subdomain,
        status: 'active'
      })
      .select()
      .single();

    if (tenantError) {
      console.error('❌ Tenant creation error:', tenantError);
      throw tenantError;
    }

    console.log('✅ Tenant created:', tenant.id);

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
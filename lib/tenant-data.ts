// lib/tenant-data.ts
import { supabase } from './supabase';

// Get tenant by ID
export async function getTenantById(tenantId: string) {
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();

  if (error) {
    console.error('Error fetching tenant by ID:', error);
    return null;
  }

  return tenant;
}

// Get tenant by subdomain
export async function getTenantBySubdomain(subdomain: string) {
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', subdomain)
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error fetching tenant by subdomain:', error);
    return null;
  }

  return tenant;
}

// Get products for a tenant
export async function getTenantProducts(tenantId: string) {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenant products:', error);
    return [];
  }

  return products || [];
}

// Get experiences for a tenant
export async function getTenantExperiences(tenantId: string) {
  const { data: experiences, error } = await supabase
    .from('experiences')
    .select(`
      *,
      products (*)
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tenant experiences:', error);
    return [];
  }

  return experiences || [];
}

// Get tenant statistics
export async function getTenantStats(tenantId: string) {
  const [products, experiences, publishedExperiences] = await Promise.all([
    getTenantProducts(tenantId),
    getTenantExperiences(tenantId),
    supabase
      .from('experiences')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('is_published', true)
  ]);

  return {
    totalProducts: products.length,
    totalExperiences: experiences.length,
    publishedExperiences: publishedExperiences.data?.length || 0,
    draftExperiences: experiences.length - (publishedExperiences.data?.length || 0)
  };
}

// Check if user has access to tenant
export async function userHasTenantAccess(userId: string, tenantId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking tenant access:', error);
    return false;
  }

  // User has access if they belong to the tenant or are a super admin
  return profile.tenant_id === tenantId || profile.role === 'super_admin';
}
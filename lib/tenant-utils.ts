// lib/tenant-utils.ts
import { supabase } from './supabase';

// Re-export from tenant-data for backward compatibility
export { getTenantBySubdomain as getTenantFromSubdomain } from './tenant-data';

// Get current user's tenant (for client-side use)
export async function getCurrentUserTenant() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', profile.tenant_id)
    .single();

  return tenant;
}

// Validate subdomain format
export function isValidSubdomain(subdomain: string): boolean {
  const subdomainRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 30;
}

// Generate available subdomain suggestions
export function generateSubdomainSuggestions(brandName: string): string[] {
  const baseSlug = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const suggestions = [baseSlug];
  
  // Add some variations
  if (baseSlug.length > 15) {
    suggestions.push(baseSlug.substring(0, 15));
  }
  
  // Add random suffix if needed
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  suggestions.push(`${baseSlug}-${randomSuffix}`);

  return suggestions.filter(slug => isValidSubdomain(slug));
}
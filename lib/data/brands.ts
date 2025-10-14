
import { supabase } from '@/lib/supabase';

export async function getCurrentUserBrand() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's profile with brand info
  const { data: profile } = await supabase
    .from('profiles')
    .select('brand_id')
    .eq('id', user.id)
    .single();

  if (!profile?.brand_id) return null;

  // Get brand details
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', profile.brand_id)
    .single();

  return brand;
}

export async function getBrandStats(brandId: string) {
  // Get today's date range in UTC to avoid timezone issues
  const today = new Date();
  const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1));

  const [
    products,
    experiences,
    publishedExperiences,
    todayScans
  ] = await Promise.all([
    // Total products
    supabase
      .from('products')
      .select('id', { count: 'exact' })
      .eq('brand_id', brandId),
    
    // Total experiences
    supabase
      .from('experiences')
      .select('id', { count: 'exact' })
      .eq('brand_id', brandId),
    
    // Published experiences
    supabase
      .from('experiences')
      .select('id', { count: 'exact' })
      .eq('brand_id', brandId)
      .eq('is_published', true),
    
    // Today's scans from scan_events table
    supabase
      .from('scan_events')
      .select('id', { count: 'exact' })
      .eq('brand_id', brandId)
      .gte('scanned_at', startOfDay.toISOString())
      .lt('scanned_at', endOfDay.toISOString())
  ]);

  return {
    totalProducts: products.count || 0,
    totalExperiences: experiences.count || 0,
    publishedExperiences: publishedExperiences.count || 0,
    draftExperiences: (experiences.count || 0) - (publishedExperiences.count || 0),
    todayScans: todayScans.count || 0
  };
}
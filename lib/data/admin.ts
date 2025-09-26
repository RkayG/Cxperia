// lib/data/admin.ts
import { supabase } from '@/lib/supabase';

export async function getAdminStats() {
  const [
    brandsCount,
    activeBrands,
    pendingBrands,
    recentBrands
  ] = await Promise.all([
    supabase.from('brands').select('id', { count: 'exact' }),
    supabase.from('brands').select('id', { count: 'exact' }).eq('status', 'active'),
    supabase.from('brands').select('id', { count: 'exact' }).eq('status', 'pending_setup'),
    supabase.from('brands').select('*').order('created_at', { ascending: false }).limit(5)
  ]);

  return {
    totalBrands: brandsCount.count || 0,
    activeBrands: activeBrands.count || 0,
    pendingBrands: pendingBrands.count || 0,
    totalScans: 0, // You'll implement this later
    recentBrands: recentBrands.data || []
  };
}

export async function getBrands() {
  const { data: brands, error } = await supabase
    .from('brands')
    .select(`
      *,
      _count:experiences(count)
    `)
    .order('created_at', { ascending: false });

  return brands || [];
}
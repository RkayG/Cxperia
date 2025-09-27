import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Fetch profile with brand_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('brand_id')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    brand_id: profile?.brand_id || null,
  };
}

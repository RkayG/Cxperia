import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';

// Add one or multiple support links (by brand_id)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.brand_id) {
    return NextResponse.json({ success: false, message: 'No brandId found in user context' }, { status: 400 });
  }
  let links = await req.json();
  if (!Array.isArray(links)) links = [links];
  if (links.length === 0) {
    return NextResponse.json({ success: false, message: 'No links provided' }, { status: 400 });
  }
  for (const link of links) {
    if (!link.type || !link.value) {
      return NextResponse.json({ success: false, message: 'Each link must have type and value' }, { status: 400 });
    }
  }
  const supabase = await createClient();
  // Overwrite: delete any existing links for this brand and type before inserting
  const typesToOverwrite = links.map(l => l.type);
  if (typesToOverwrite.length > 0) {
    await supabase
      .from('customer_support_links')
      .delete()
      .eq('brand_id', user.brand_id)
      .in('type', typesToOverwrite);
  }
  // Bulk insert
  const { data, error } = await supabase
    .from('customer_support_links')
    .insert(links.map(link => ({ brand_id: user.brand_id, type: link.type, value: link.value })))
    .select();
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

// Get all support links for a brand
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.brand_id) {
    return NextResponse.json({ success: false, message: 'No brandId found in user context' }, { status: 400 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('customer_support_links')
    .select('*')
    .eq('brand_id', user.brand_id);
  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

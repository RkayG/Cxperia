import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.brand_id) {
    return NextResponse.json({ success: false, message: 'No brand associated with user' }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: brand, error } = await supabase
    .from('brands')
    .select('id, name, logo_url, website_url')
    .eq('id', user.brand_id)
    .single();
  if (error || !brand) {
    return NextResponse.json({ success: false, message: 'Brand not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: brand });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user?.brand_id) {
    return NextResponse.json({ success: false, message: 'No brand associated with user' }, { status: 403 });
  }
  const body = await req.json() as { logo_url?: string };
  const { logo_url } = body;
  if (!logo_url) {
    return NextResponse.json({ success: false, message: 'logo_url is required' }, { status: 400 });
  }
  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from('brands')
    .update({ logo_url, updated_at: new Date().toISOString() })
    .eq('id', user.brand_id);
  if (updateError) {
    return NextResponse.json({ success: false, message: 'Failed to set brand logo' }, { status: 500 });
  }
  const { data: brand, error } = await supabase
    .from('brands')
    .select('id, name, logo_url, website_url')
    .eq('id', user.brand_id)
    .single();
  return NextResponse.json({ success: true, data: brand });
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

// Add ingredient(s)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const experience_id = params.id;
  const brand_id = user?.brand_id;
  const body = await req.json();

  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'No brand_id found' }, { status: 403 });
  }

  // Determine payload: single item, array, or object with `ingredients`
  let items: any[] = [];
  if (Array.isArray(body)) items = body;
  else if (body && Array.isArray(body.ingredients)) items = body.ingredients;
  else if (body) items = [body];

  if (items.length === 0) {
    return NextResponse.json({ success: false, message: 'No ingredient data provided' }, { status: 400 });
  }

  // Fill experience_id and brand_id for each item
  items = items.map(it => ({
    ...it,
    experience_id: it.experience_id || it.experienceId || experience_id,
    brand_id,
  }));

  // Insert ingredients
  const { data, error } = await supabase
    .from('ingredients')
    .insert(items)
    .select();

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// Get all ingredients for an experience
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const experience_id = params.id;
  const brand_id = user?.brand_id;

  if (!experience_id) {
    return NextResponse.json({ success: false, message: 'experience_id parameter required' }, { status: 400 });
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'No brand_id found' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('experience_id', experience_id)
    .eq('brand_id', brand_id)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// Update ingredient
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const brand_id = user?.brand_id;
  const body = await req.json();
  const { id, ...fields } = body;

  if (!id) {
    return NextResponse.json({ success: false, message: 'Ingredient id required' }, { status: 400 });
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'No brand_id found' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('ingredients')
    .update(fields)
    .eq('id', id)
    .eq('brand_id', brand_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// Delete ingredient
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const brand_id = user?.brand_id;
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ success: false, message: 'Ingredient id required' }, { status: 400 });
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'No brand_id found' }, { status: 403 });
  }

  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id)
    .eq('brand_id', brand_id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Deleted' });
}
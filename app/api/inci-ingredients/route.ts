import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient(); // <-- add await here
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from('eu_cosing_ingredients')
    .select('*')
    .order('inci_name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('inci_name', `%${search}%`);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ingredients: data,
    page,
    limit,
    total: data?.length ?? 0,
  });
}
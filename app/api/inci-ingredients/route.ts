import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';

// Cache for ingredient data (in-memory cache)
const ingredientCache = new Map<string, { data: any[], timestamp: number }>();
const CACHE_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days for static INCI data

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    // Create cache key
    const cacheKey = `${search}-${category}-${page}-${limit}`;
    
    // Check cache first
    const cached = ingredientCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      const response = NextResponse.json({
        ingredients: cached.data,
        page,
        limit,
        total: cached.data?.length ?? 0,
      });
      
      // Add long-term caching headers for static INCI data
      response.headers.set('Cache-Control', 'public, max-age=7776000, immutable'); // 90 days, immutable
      response.headers.set('ETag', `"${cacheKey}-${cached.timestamp}"`);
      return response;
    }

    const supabase = await createClient();

    let query = supabase
      .from('eu_cosing_ingredients')
      .select('id, inci_name, common_name, category, all_functions, is_allergen')
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

    // Cache the results
    ingredientCache.set(cacheKey, {
      data: data || [],
      timestamp: Date.now()
    });

    const response = NextResponse.json({
      ingredients: data,
      page,
      limit,
      total: data?.length ?? 0,
    });

    // Add long-term caching headers for static INCI data
    response.headers.set('Cache-Control', 'public, max-age=7776000, immutable'); // 90 days, immutable
    response.headers.set('ETag', `"${cacheKey}-${Date.now()}"`);
    
    return response;
  } catch (error) {
    //console.error('Get ingredients error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}
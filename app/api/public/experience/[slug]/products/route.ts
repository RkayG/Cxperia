import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PUBLIC_EXPERIENCE_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || 'your-frontend-secret';
const CACHE_TTL_SECONDS = 604800; // 7 days

// --- GET /api/public/experience/[slug]/products ---
// Mapped from: async function getPublicProducts(req, res)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const slug = params.slug;

  // Security Check: Validate Secret Key
  const secret = req.headers.get('x-public-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== PUBLIC_EXPERIENCE_SECRET) {
    return NextResponse.json({ success: false, message: 'Invalid!!!' }, { status: 403 });
  }

  try {
    // 1. Get experience to find brand_id
    const { data: exp, error: expError } = await supabase
      .from('experiences')
      .select('brand_id')
      .eq('public_slug', slug)
      .single();
    
    if (expError || !exp?.brand_id) {
      if (expError?.code === 'PGRST116') {
        return NextResponse.json({ success: false, message: 'Experience not found' }, { status: 404 });
      }
      throw expError;
    }
    
    const brand_id = exp.brand_id;

    // 2. Get all products for the brand
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', brand_id);
    
    if (productsError) throw productsError;

    // 3. Extract unique categories and skin types for frontend filtering
    const productList = products || [];
    
    const categories = Array.from(new Set(productList.map(p => p.category).filter(Boolean)));
    
    // Handle skin_type which might be an array or string
    const skin_types = Array.from(new Set(productList.map(p => {
        if (Array.isArray(p.skin_type)) return p.skin_type;
        if (typeof p.skin_type === 'string') return p.skin_type;
        return null;
    }).flat().filter(Boolean)));

    const response = { success: true, products: productList, categories, skin_types };

    // Return with caching headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=86400`,
        'CDN-Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}`,
      },
    });
  } catch (error: any) {
    console.error('Error getting public products:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

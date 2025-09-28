import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Assumes Supabase server client setup

const PUBLIC_EXPERIENCE_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || 'your-frontend-secret';
const CACHE_TTL_SECONDS = 604800; // 7 days

// --- GET /api/public/experience/[slug] ---
// Mapped from: async function getPublicExperience(req, res)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createClient();
  const slug = params.slug;
  
  if (!slug) {
    return NextResponse.json({ success: false, message: 'Missing slug parameter' }, { status: 400 });
  }

  // Security Check: Validate Secret Key
  const secret = req.headers.get('x-public-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== PUBLIC_EXPERIENCE_SECRET) {
    return NextResponse.json({ success: false, message: 'Invalid or missing secret key' }, { status: 403 });
  }

  // NOTE: Original caching logic (e.g., Redis/KV store) was here.
  // In a production Next.js app, you might use:
  // fetch(..., { next: { revalidate: CACHE_TTL_SECONDS, tags: ['public-experience', slug] } });

  try {
    // 1. Fetch basic experience info
    const { data: exp, error: expError } = await supabase
      .from('experiences')
      .select('*')
      .eq('public_slug', slug)
      .single();

    if (expError) {
      if (expError.code === 'PGRST116') { // No rows found
        return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      }
      throw expError;
    }
    
    // Initialize combined response object
    const combinedExp: Record<string, any> = { ...exp };
    const brand_id = exp.brand_id;

    // --- Data Joins ---
    
    // 2. Join product info
    if (exp.product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', exp.product_id)
        .single();
      combinedExp.product = product || null;
    } else {
      combinedExp.product = null;
    }

    // 3. Join digital_instructions, ingredients, features
    const [{ data: instructions }, { data: ingredients }, { data: features }] = await Promise.all([
      supabase.from('digital_instructions').select('*').eq('experience_id', exp.id),
      supabase.from('ingredients').select('*').eq('experience_id', exp.id),
      supabase.from('experience_features').select('*').eq('experience_id', exp.id),
    ]);

    combinedExp.digital_instructions = instructions || [];
    combinedExp.ingredients = ingredients || [];
    combinedExp.features = features || [];
    
    // Compute enabled features array
    combinedExp.features_enabled = (features || [])
      .filter(f => f.is_enabled)
      .map(f => f.feature_name);

    // 4. Join brand logo and support links (requires brand_id)
    if (brand_id) {
      const [{ data: brand }, { data: supportLinks }] = await Promise.all([
        supabase.from('brands').select('logo_url').eq('id', brand_id).single(),
        supabase.from('customer_support_links').select('*').eq('brand_id', brand_id),
      ]);

      combinedExp.brand_logo_url = brand?.logo_url || null;
      combinedExp.customer_support_links = supportLinks || [];
      
      // Add simplified customer support links
      combinedExp.customer_support_links_simple = (supportLinks || []).map(l => ({ type: l.type, value: l.value }));
    } else {
      combinedExp.brand_logo_url = null;
      combinedExp.customer_support_links = [];
      combinedExp.customer_support_links_simple = [];
    }
    
    const response = { success: true, data: combinedExp };
    // NOTE: Caching implementation would typically be here (e.g., setting the result to Redis).

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error getting public experience:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PUBLIC_EXPERIENCE_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || 'your-frontend-secret';
// const CACHE_TTL_SECONDS = 604800; // 7 days

// --- GET /api/public/experience/[slug]/tutorials ---
// Mapped from: async function getPublicTutorials(req, res)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createClient();
  const slug = params.slug;

  // Security Check: Validate Secret Key
  const secret = req.headers.get('x-public-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== PUBLIC_EXPERIENCE_SECRET) {
    return NextResponse.json({ success: false, message: 'Invalid or missing secret key' }, { status: 403 });
  }

  // NOTE: Original caching logic (e.g., Redis/KV store) was here.

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

    // 2. Get tutorials for the brand
    const { data: tutorials, error: tutorialsError } = await supabase
      .from('tutorials')
      .select('*')
      .eq('brand_id', brand_id);
    
    if (tutorialsError) throw tutorialsError;

    const response = { success: true, tutorials: tutorials || [] };
    // NOTE: Caching implementation would typically be here.

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error getting public tutorials:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

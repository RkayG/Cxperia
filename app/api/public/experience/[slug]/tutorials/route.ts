import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizePublicDataArray } from '@/utils/sanitizePublicData';

const PUBLIC_EXPERIENCE_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || 'your-frontend-secret';
const CACHE_TTL_SECONDS = 604800; // 7 days

// --- GET /api/public/experience/[slug]/tutorials ---
// Mapped from: async function getPublicTutorials(req, res)
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

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

    // 2. Get tutorials for the brand ordered by recent first
    const { data: tutorials, error: tutorialsError } = await supabase
      .from('tutorials')
      .select('*')
      .eq('brand_id', brand_id)
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (tutorialsError) throw tutorialsError;

    // Sanitize tutorials to remove sensitive data
    const sanitizedTutorials = sanitizePublicDataArray(tutorials || []);

    const response = { success: true, tutorials: sanitizedTutorials };
    //console.log('tutorials', tutorials);
    // Return with caching headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=86400`,
        'CDN-Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

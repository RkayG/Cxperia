import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PUBLIC_EXPERIENCE_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || 'your-frontend-secret';
const CACHE_TTL_SECONDS = 3600; // 1 hour for individual tutorials

// GET /api/public/tutorials/[id] - Get a single tutorial by ID (public access)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: tutorialId } = await params;
  const supabase = await createClient();

  // Security Check: Validate Secret Key
  const secret = req.headers.get('x-public-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || secret !== PUBLIC_EXPERIENCE_SECRET) {
    return NextResponse.json({ success: false, message: 'Invalid!!!' }, { status: 403 });
  }

  if (!tutorialId) {
    return NextResponse.json({ success: false, message: 'Tutorial ID is required' }, { status: 400 });
  }

  try {
    // Get tutorial by ID, but only if it's published
    const { data: tutorial, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('id', tutorialId)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ success: false, message: 'Tutorial not found' }, { status: 404 });
      }
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    if (!tutorial) {
      return NextResponse.json({ success: false, message: 'Tutorial not found' }, { status: 404 });
    }

    const response = { success: true, tutorial };
    
    // Return with caching headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=3600`,
        'CDN-Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}`,
      },
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

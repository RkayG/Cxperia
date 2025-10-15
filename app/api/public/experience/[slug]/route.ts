import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeExperienceData } from '@/utils/sanitizePublicData';

// Use server-side only environment variable (no NEXT_PUBLIC_ prefix)
const PUBLIC_EXPERIENCE_SECRET = process.env.PUBLIC_EXPERIENCE_SECRET || 'your-server-secret';
const CACHE_TTL_SECONDS = 604800; // 7 days

// --- GET /api/public/experience/[slug] ---
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!slug) {
    //console.log('Missing slug parameter');
    return NextResponse.json({ success: false, message: 'Missing slug parameter' }, { status: 400 });
  }

  // Security Check: Validate Secret Key (ONLY from headers, NOT query params)
  /*  const secret = req.headers.get('x-public-secret');
  if (!secret || secret !== PUBLIC_EXPERIENCE_SECRET) {
    //console.log('Invalid or missing secret');
    return NextResponse.json({ success: false, message: 'Invalid!!!' }, { status: 401 });
  }  */

  try {
    // --- ONE QUERY with nested joins ---
    const { data: exp, error: expError } = await supabase
      .from('experiences')
      .select(`
        *,
        product:products(*),
        digital_instructions(*),
        ingredients(*),
        experience_features(*),
        brand:brands(
          logo_url,
          name,
          customer_support_links(*)
        )
      `)
      .eq('public_slug', slug)
      .single();

    if (expError) {
      if (expError.code === 'PGRST116') { // No rows found
       // console.log('Experience not found', expError);
        return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
      }
      throw expError;
    }

    // --- Normalize / post-process the response ---
    const combinedExp: Record<string, any> = { ...exp };

    // Compute enabled features list
    combinedExp.features_enabled = (exp.experience_features || [])
      .filter((f: any) => f.is_enabled)
      .map((f: any) => f.feature_name);

    // Simplify customer support links
    combinedExp.customer_support_links_simple = (exp.brand?.customer_support_links || []).map((l: any) => ({
      type: l.type,
      value: l.value,
    }));

    // Expose brand_logo_url and brand_name directly
    combinedExp.brand_logo_url = exp.brand?.logo_url || null;
    combinedExp.brand_name = exp.brand?.name || null;

    // Sanitize the response to remove sensitive data
    const sanitizedExp = sanitizeExperienceData(combinedExp);

    const response = { success: true, data: sanitizedExp };
    
    // Return with caching headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=86400`,
        'CDN-Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}`,
      },
    });

  } catch (error: any) {
     //console.log('Error getting public experience:', error.message);
    //  console.error('Error getting public experience:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Optional: Set revalidation time for Next.js data cache
export const revalidate = 3600; // 1 hour in seconds
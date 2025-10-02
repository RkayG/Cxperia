import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/public/experience/[slug]/scan - Increment scan count for an experience
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // First, get the experience details
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('id, brand_id, scan_count, public_slug')
      .eq('public_slug', slug)
      .eq('is_published', true)
      .single();

    if (fetchError) {
      console.error('Error fetching experience:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
      }
      return NextResponse.json({ 
        error: 'Failed to fetch experience',
        details: process.env.NODE_ENV === 'development' ? fetchError.message : undefined
      }, { status: 500 });
    }

    // Get request metadata for tracking
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || '';
    
    // Create a more robust user fingerprint for unique user detection
    const userFingerprint = `${ipAddress}_${userAgent}`.replace(/[^a-zA-Z0-9_]/g, '_');
    
    // Check if this user has scanned this experience before
    const { data: previousScan } = await supabase
      .from('scan_events')
      .select('id, scanned_at')
      .eq('experience_id', experience.id)
      .eq('user_fingerprint', userFingerprint)
      .order('scanned_at', { ascending: false })
      .limit(1)
      .single();

    const isUniqueScan = !previousScan;
    const sessionId = `${userFingerprint}_${Date.now()}`;

    // Insert scan event record
    const { data: scanEvent, error: scanEventError } = await supabase
      .from('scan_events')
      .insert({
        experience_id: experience.id,
        brand_id: experience.brand_id,
        scanned_at: new Date().toISOString(),
        user_agent: userAgent,
        ip_address: ipAddress || null,
        session_id: sessionId,
        user_fingerprint: userFingerprint,
        is_unique_scan: isUniqueScan,
        previous_scan_id: previousScan?.id || null,
      })
      .select('id')
      .single();

    if (scanEventError) {
      console.error('Error inserting scan event:', scanEventError);
      // Don't fail the request if scan event insertion fails
    }

    // Update the aggregate scan counts (both total and unique)
    const updateData: any = {
      total_scan_count: supabase.raw('total_scan_count + 1'),
      scan_count: supabase.raw('scan_count + 1'), // Keep legacy field for backward compatibility
      updated_at: new Date().toISOString()
    };

    // Only increment unique scan count for first-time visitors
    if (isUniqueScan) {
      updateData.unique_scan_count = supabase.raw('unique_scan_count + 1');
    }

    const { data: updatedExperience, error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', experience.id)
      .select('id, scan_count, total_scan_count, unique_scan_count, public_slug')
      .single();

    if (error) {
      console.error('Error incrementing scan count:', error);
      return NextResponse.json({ 
        error: 'Failed to increment scan count',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        experience_id: updatedExperience.id,
        scan_count: updatedExperience.scan_count, // Legacy field
        total_scan_count: updatedExperience.total_scan_count,
        unique_scan_count: updatedExperience.unique_scan_count,
        public_slug: updatedExperience.public_slug,
        is_unique_scan: isUniqueScan,
        is_returning_user: !isUniqueScan
      },
      message: isUniqueScan ? 'New user scan recorded' : 'Returning user scan recorded'
    });

  } catch (error) {
    console.error('Scan count increment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to increment scan count' },
      { status: 500 }
    );
  }
}

// GET /api/public/experience/[slug]/scan - Get current scan count (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current scan count
    const { data: experience, error } = await supabase
      .from('experiences')
      .select('id, scan_count, public_slug')
      .eq('public_slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to get scan count' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        experience_id: experience.id,
        scan_count: experience.scan_count,
        public_slug: experience.public_slug
      }
    });

  } catch (error) {
    console.error('Get scan count error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get scan count' },
      { status: 500 }
    );
  }
}

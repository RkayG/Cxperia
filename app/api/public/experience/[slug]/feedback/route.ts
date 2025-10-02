import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/public/experience/[slug]/feedback - Create feedback for public users
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body: any = await request.json();
    
    const { 
      customer_name, 
      customer_email, 
      overall_rating, 
      product_rating,
      packaging_rating,
      delivery_rating,
      comment,
      images 
    } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get experience and brand info using the public slug
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id, brand_id, public_slug')
      .eq('public_slug', slug)
      .eq('is_published', true) // Only allow feedback on published experiences
      .single();

    if (expError || !experience) {
      console.error('Experience not found for slug:', slug, expError);
      return NextResponse.json({ error: 'Experience not found or not published' }, { status: 404 });
    }

    // Validate that at least one piece of feedback is provided
    if (!overall_rating && !comment?.trim()) {
      return NextResponse.json({ error: 'Please provide a rating or comment' }, { status: 400 });
    }

    // Insert feedback into the database
    const { data: feedback, error } = await supabase
      .from('customer_feedbacks')
      .insert({
        experience_id: experience.id,
        brand_id: experience.brand_id,
        customer_name: customer_name?.trim() || 'Anonymous',
        customer_email: customer_email?.trim() || null,
        overall_rating: overall_rating || null,
        product_rating: product_rating || null,
        packaging_rating: packaging_rating || null,
        delivery_rating: delivery_rating || null,
        comment: comment?.trim() || null,
        images: images && images.length > 0 ? images : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating feedback:', error);
      
      // Provide more specific error messages
      if (error.code === '23502') {
        return NextResponse.json({ 
          error: 'Database configuration error. Please contact support.',
          details: 'The feedback table may not be properly configured.'
        }, { status: 500 });
      }
      
      if (error.code === '23503') {
        return NextResponse.json({ 
          error: 'Invalid experience reference. Please try again.',
          details: 'The experience may have been removed or is no longer available.'
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to submit feedback. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: feedback,
      message: 'Thank you for your feedback!' 
    });

  } catch (error) {
    console.error('Public feedback submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

// GET /api/public/experience/[slug]/feedback - Get public feedback stats (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get experience info
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id, brand_id')
      .eq('public_slug', slug)
      .eq('is_published', true)
      .single();

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Get feedback statistics (without personal info)
    const { data: stats, error: statsError } = await supabase
      .from('customer_feedbacks')
      .select('overall_rating')
      .eq('experience_id', experience.id)
      .not('overall_rating', 'is', null);

    if (statsError) {
      console.error('Error fetching feedback stats:', statsError);
      return NextResponse.json({ error: 'Failed to fetch feedback stats' }, { status: 500 });
    }

    // Calculate average rating and count
    const totalFeedbacks = stats?.length || 0;
    const averageRating = totalFeedbacks > 0 
      ? stats.reduce((sum, feedback) => sum + (feedback.overall_rating || 0), 0) / totalFeedbacks
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        total_feedbacks: totalFeedbacks,
        average_rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      }
    });

  } catch (error) {
    console.error('Public feedback stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch feedback stats' },
      { status: 500 }
    );
  }
}

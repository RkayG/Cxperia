import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';

// GET /api/feedbacks - Get all feedbacks for a brand
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand_id') || user.brand_id;

    if (!brandId) {
      return NextResponse.json({ error: 'brand_id is required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Get feedbacks for this brand's experiences
    const { data: feedbacks, error } = await supabase
      .from('customer_feedbacks')
      .select(`
        *,
        experiences!inner(
          id,
          brand_id,
          products(name, category)
        )
      `)
      .eq('experiences.brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedbacks:', error);
      return NextResponse.json({ error: 'Failed to fetch feedbacks' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: feedbacks || [] });

  } catch (error) {
    console.error('Get feedbacks error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

// POST /api/feedbacks - Create new feedback (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      experience_id, 
      customer_name, 
      customer_email, 
      overall_rating, 
      product_rating,
      packaging_rating,
      delivery_rating,
      comment,
      images 
    } = body;

    // Validate required fields
    if (!experience_id) {
      return NextResponse.json({ error: 'experience_id is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify experience exists and get brand_id
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id, brand_id')
      .eq('id', experience_id)
      .single();

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Insert feedback
    const { data: feedback, error } = await supabase
      .from('customer_feedbacks')
      .insert({
        experience_id,
        brand_id: experience.brand_id,
        customer_name: customer_name || 'Anonymous',
        customer_email: customer_email || null,
        overall_rating: overall_rating || null,
        product_rating: product_rating || null,
        packaging_rating: packaging_rating || null,
        delivery_rating: delivery_rating || null,
        comment: comment || null,
        images: images || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating feedback:', error);
      return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: feedback });

  } catch (error) {
    console.error('Create feedback error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create feedback' },
      { status: 500 }
    );
  }
}

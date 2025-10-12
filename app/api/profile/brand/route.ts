import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis';
import { sanitizePublicData } from '@/utils/sanitizePublicData';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create cache key
    const cacheKey = `brand:${user.brand_id}`;
    
    // Try to get from Redis cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        // Cache already contains sanitized data
        const response = NextResponse.json({ success: true, data: JSON.parse(cached as string) });
        response.headers.set('Cache-Control', 'private, max-age=600, stale-while-revalidate=1200'); // 10 min cache
        response.headers.set('X-Cache', 'HIT');
        return response;
      }
    } catch (redisError) {
      //console.warn('Redis cache read failed, falling back to database:', redisError);
    }

    // Cache miss - fetch from database
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', user.brand_id)
      .single();

    if (brandError) {
      //console.error('Error fetching brand:', brandError);
      return NextResponse.json({ error: 'Failed to fetch brand data' }, { status: 500 });
    }

    // Sanitize brand data to remove sensitive fields (but keep brand_id for frontend use)
    const sanitizedBrand = sanitizePublicData(brand, ['user_id', 'created_by', 'updated_by']);

    // Cache the sanitized result in Redis (10 minutes)
    try {
      await redis.setex(cacheKey, 600, JSON.stringify(sanitizedBrand));
    } catch (redisError) {
      //console.warn('Redis cache write failed:', redisError);
    }

    const response = NextResponse.json({ success: true, data: sanitizedBrand });
    response.headers.set('Cache-Control', 'private, max-age=600, stale-while-revalidate=1200');
    response.headers.set('X-Cache', 'MISS');
    return response;
  } catch (error) {
    //console.error('Error in GET /api/profile/brand:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      brand_slug,
      website_url,
      contact_info,
      country,
      city,
      zip_code,
      business_address,
      contact_email,
      contact_name,
      contact_phone,
      custom_domain,
      monthly_volume,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ 
        error: 'Brand name is required' 
      }, { status: 400 });
    }

    // Update brand data
    const { data: updatedBrand, error: updateError } = await supabase
      .from('brands')
      .update({
        name: name.trim(),
        brand_slug: brand_slug?.trim() || null,
        website_url: website_url?.trim() || null,
        contact_info: contact_info?.trim() || null,
        country: country?.trim() || null,
        city: city?.trim() || null,
        zip_code: zip_code?.trim() || null,
        business_address: business_address?.trim() || null,
        contact_email: contact_email?.trim() || null,
        contact_name: contact_name?.trim() || null,
        contact_phone: contact_phone?.trim() || null,
        custom_domain: custom_domain?.trim() || null,
        monthly_volume: monthly_volume?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.brand_id)
      .select()
      .single();

    if (updateError) {
      //console.error('Error updating brand:', updateError);
      return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }

    // Invalidate brand cache
    try {
      const cacheKey = `brand:${user.brand_id}`;
      await redis.del(cacheKey);
    } catch (redisError) {
      //console.warn('Failed to invalidate brand cache:', redisError);
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedBrand,
      message: 'Brand profile updated successfully' 
    });
  } catch (error) {
    //console.error('Error in PUT /api/profile/brand:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createExperience, getExperiencesByBrand } from '@/lib/db/experiences';
import { createProduct } from '@/lib/db/products';
import { redis } from '@/lib/redis';

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

    // Create cache key
    const cacheKey = `experiences:${brandId}`;
    
    // Try to get from Redis cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const response = NextResponse.json({ success: true, data: JSON.parse(cached) });
        // Add cache headers
        response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=600');
        response.headers.set('X-Cache', 'HIT');
        return response;
      }
    } catch (redisError) {
      console.warn('Redis cache read failed, falling back to database:', redisError);
    }

    // Cache miss - fetch from database
    const experiences = await getExperiencesByBrand(brandId);
    
    // Cache the result in Redis (5 minutes)
    try {
      await redis.setex(cacheKey, 300, JSON.stringify(experiences));
    } catch (redisError) {
      console.warn('Redis cache write failed:', redisError);
    }

    const response = NextResponse.json({ success: true, data: experiences });
    response.headers.set('Cache-Control', 'private, max-age=300, stale-while-revalidate=600');
    response.headers.set('X-Cache', 'MISS');
    return response;

  } catch (error) {
    console.error('Get experiences error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const body = await request.json() as any;
    console.log('Create experience request body:', body);
    const { product_id, product, experience_id } = body;
    const logo_url = body.logo_url || (product && product.logo_url) || null;
    let finalProductId = product_id || null;

    // Normalize product images from both product.product_image_url and root product_image_url
    let productImagesFromBody = null;
    if (product && typeof product === 'object') {
      if (Array.isArray(product.product_image_url))
        productImagesFromBody = product.product_image_url.filter(Boolean);
      else if (product.product_image_url)
        productImagesFromBody = [product.product_image_url];
    } else if (Array.isArray(body.product_image_url)) {
      productImagesFromBody = body.product_image_url.filter(Boolean);
    } else if (body.product_image_url) {
      productImagesFromBody = [body.product_image_url];
    }
    const mergedProductImages = [].concat(productImagesFromBody || []).filter(Boolean);

    // If experience_id is provided, update existing experience (not handled here)
    if (experience_id) {
      return NextResponse.json({ error: 'Use PATCH /api/experiences/[id] for updates' }, { status: 400 });
    }

    // If product_id is present, update product with new images/logo if provided
    if (finalProductId) {
      const updates: any = {};
      if (mergedProductImages.length > 0) {
        updates.product_image_url = mergedProductImages;
      }
      if (logo_url) {
        updates.logo_url = logo_url;
      }
      if (Object.keys(updates).length > 0) {
        try {
          await (await import('@/lib/db/products')).updateProduct(finalProductId, updates);
        } catch (e) {
          console.warn('Failed to update existing product images/logo', e);
        }
      }
    }

    // Create product if needed
    if (!finalProductId && product && typeof product === 'object') {
      const productData = {
        name: product.name,
        tagline: product.tagline ? String(product.tagline).slice(0, 80) : '',
        description: product.description || '',
        category: product.category,
        skin_type: product.skinType || '',
        store_link: product.store_link,
        product_image_url: mergedProductImages.length > 0 ? mergedProductImages : undefined,
        logo_url: product.logo_url || logo_url || null,
        net_content: product.net_content || null,
        estimated_usage_duration_days: product.estimated_usage_duration_days || 30,
        original_price: product.original_price || null,
        discounted_price: product.discounted_price || null,
      };
      try {
        const newProduct = await createProduct(user.brand_id, productData);
        finalProductId = newProduct.id;
      } catch (err) {
        console.error('Error creating product:', err);
        return NextResponse.json({ error: 'Failed to create product', details: err instanceof Error ? err.message : err }, { status: 500 });
      }
    }

    // Optionally update brand logo if provided
    if (logo_url && user.brand_id) {
      try {
        const { supabase } = await import('@/lib/supabase');
        await supabase
          .from('brands')
          .update({ logo_url })
          .eq('id', user.brand_id);
      } catch (e) {
        console.warn('Failed to persist brand logo_url', e);
      }
    }

    // Create experience
    const experience = await createExperience({
      brand_id: user.brand_id,
      product_id: finalProductId,
      is_published: false,
    });

    // Always return experience with joined product and features (if available)
    // (createExperience already returns joined product, but not features)
    let features = [];
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: featuresData } = await supabase
        .from('experience_features')
        .select('*')
        .eq('experience_id', experience.id);
      if (featuresData) features = featuresData;
    } catch (e) {
      console.warn('Failed to fetch experience features', e);
    }
    experience.features = features;

    // Invalidate cache for this brand
    try {
      const cacheKey = `experiences:${user.brand_id}`;
      await redis.del(cacheKey);
    } catch (redisError) {
      console.warn('Failed to invalidate experiences cache:', redisError);
    }

    return NextResponse.json({ success: true, data: experience });

  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create experience' },
      { status: 500 }
    );
  }
}
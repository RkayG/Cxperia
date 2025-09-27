import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getExperiencesByBrand, createExperience } from '@/lib/db/experiences';
import { createProduct } from '@/lib/db/products';

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

    const experiences = await getExperiencesByBrand(brandId);
    return NextResponse.json({ success: true, data: experiences });

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

    const body = await request.json();
    const { product_id, product, experience_id } = body;

    // If experience_id is provided, update existing experience
    if (experience_id) {
      // This would be handled by the PATCH route
      return NextResponse.json({ error: 'Use PATCH /api/experiences/[id] for updates' }, { status: 400 });
    }

    let finalProductId = product_id || null;

    // Create product if needed
    if (!finalProductId && product) {
      const productData = {
        name: product.name,
        tagline: product.tagline ? String(product.tagline).slice(0, 80) : '',
        description: product.description || '',
        category: product.category,
        skin_type: product.skinType || '',
        store_link: product.store_link,
        product_image_url: Array.isArray(product.product_image_url) 
          ? product.product_image_url.filter(Boolean)
          : product.product_image_url ? [product.product_image_url] : null,
        logo_url: product.logo_url || null,
        net_content: product.net_content || null,
        estimated_usage_duration_days: product.estimated_usage_duration_days || 30,
        original_price: product.original_price || null,
        discounted_price: product.discounted_price || null,
      };

      const newProduct = await createProduct(user.brand_id, productData);
      finalProductId = newProduct.id;

      // Update brand logo if provided
      if (productData.logo_url && user.brand_id) {
        await supabase
          .from('brands')
          .update({ logo_url: productData.logo_url })
          .eq('id', user.brand_id);
      }
    }

    // Create experience
    const experience = await createExperience({
      brand_id: user.brand_id,
      product_id: finalProductId,
      is_published: false,
    });

    return NextResponse.json({ success: true, data: experience });

  } catch (error) {
    console.error('Create experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create experience' },
      { status: 500 }
    );
  }
}
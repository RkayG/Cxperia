import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { updateExperience, getExperienceById } from '@/lib/db/experiences';
import { updateProduct } from '@/lib/db/products';

export async function GET(request: NextRequest, { params }: { params: { expId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const experience = await getExperienceById(params.expId);
    if (!experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    // Always return experience with joined product and features (if available)
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

    // Transform the response to use 'product' instead of 'products' for consistency
    const transformedExperience = {
      ...experience,
      product: experience.products, // Rename products to product
      features: features
    };
    
    // Remove the original 'products' field to avoid confusion
    delete transformedExperience.products;

    return NextResponse.json({ success: true, data: transformedExperience });

  } catch (error) {
    console.error('Get experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { expId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as any;
    console.log('Update experience request body:', body);
    const { product_id, product, experience_id } = body;
    let logo_url = body.logo_url || (product && product.logo_url) || null;
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

    // If product_id is present, update product with new data if provided
    if (finalProductId && product && typeof product === 'object') {
      const updates: any = {};
      
      // Update product fields
      if (product.name !== undefined) updates.name = product.name;
      if (product.tagline !== undefined) updates.tagline = product.tagline ? String(product.tagline).slice(0, 80) : '';
      if (product.description !== undefined) updates.description = product.description || '';
      if (product.category !== undefined) updates.category = product.category;
      if (product.skinType !== undefined) updates.skin_type = product.skinType || '';
      if (product.store_link !== undefined) updates.store_link = product.store_link;
      if (product.net_content !== undefined) updates.net_content = product.net_content || null;
      if (product.estimated_usage_duration_days !== undefined) updates.estimated_usage_duration_days = product.estimated_usage_duration_days || 30;
      if (product.original_price !== undefined) updates.original_price = product.original_price || null;
      if (product.discounted_price !== undefined) updates.discounted_price = product.discounted_price || null;
      
      // Update images and logo
      if (mergedProductImages.length > 0) {
        updates.product_image_url = mergedProductImages;
      }
      if (logo_url) {
        updates.logo_url = logo_url;
      }
      
      if (Object.keys(updates).length > 0) {
        try {
          await updateProduct(finalProductId, updates);
        } catch (e) {
          console.warn('Failed to update existing product', e);
        }
      }
    }

    // Create product if needed
    if (!finalProductId && product && typeof product === 'object') {
      const { createProduct } = await import('@/lib/db/products');
      const productData = {
        name: product.name,
        tagline: product.tagline ? String(product.tagline).slice(0, 80) : '',
        description: product.description || '',
        category: product.category,
        skin_type: product.skin_type || '',
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

    // Update experience
    const experienceUpdates: any = {};
    if (finalProductId) {
      experienceUpdates.product_id = finalProductId;
    }

    const experience = await updateExperience(params.expId, experienceUpdates);

    // Always return experience with joined product and features (if available)
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

    return NextResponse.json({ success: true, data: experience });

  } catch (error) {
    console.error('Update experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { expId: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deleteExperience } = await import('@/lib/db/experiences');
    await deleteExperience(params.expId);

    return NextResponse.json({ success: true, message: 'Experience deleted successfully' });

  } catch (error) {
    console.error('Delete experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete experience' },
      { status: 500 }
    );
  }
}

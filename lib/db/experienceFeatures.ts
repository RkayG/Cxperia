import { supabase } from '@/lib/supabase';

export async function setDefaultExperienceFeatures({ experienceId, brandId }: { experienceId: string; brandId: string }) {
  console.log('Setting default features for experience', experienceId, 'and brand', brandId);
  
  if (!experienceId || !brandId) {
    console.warn('experienceId and brandId are required to set default features');
    return;
  }

  // Always enable feedbackForm
  try {
    await supabase
      .from('experience_features')
      .upsert({
        experience_id: experienceId,
        brand_id: brandId,
        feature_name: 'feedbackForm',
        is_enabled: true,
        status: 'draft'
      }, {
        onConflict: 'experience_id,feature_name',
        ignoreDuplicates: true
      });
  } catch (e) {
    console.warn('Failed to auto-enable feedback form feature', e);
  }

  // Enable customerService if customer_support_links table has data for this brand
  try {
    const { data: supportLinks } = await supabase
      .from('customer_support_links')
      .select('id')
      .eq('brand_id', brandId)
      .limit(1);

    if (supportLinks && supportLinks.length > 0) {
      await supabase
        .from('experience_features')
        .upsert({
          experience_id: experienceId,
          brand_id: brandId,
          feature_name: 'customerService',
          is_enabled: true,
          status: 'draft'
        }, {
          onConflict: 'experience_id,feature_name',
          ignoreDuplicates: true
        });
    }
  } catch (e) {
    console.warn('Failed to auto-enable customerService feature', e);
  }

  // Enable skinRecommendations if products table has data for this brand
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('brand_id', brandId)
      .limit(1);

    if (products && products.length > 0) {
      await supabase
        .from('experience_features')
        .upsert({
          experience_id: experienceId,
          brand_id: brandId,
          feature_name: 'skinRecommendations',
          is_enabled: true,
          status: 'draft'
        }, {
          onConflict: 'experience_id,feature_name',
          ignoreDuplicates: true
        });
    }
  } catch (e) {
    console.warn('Failed to auto-enable skinRecommendations feature', e);
  }

  // Enable tutorialsRoutines if tutorials table has data for this brand
  try {
    const { data: tutorials } = await supabase
      .from('tutorials')
      .select('id')
      .eq('brand_id', brandId)
      .limit(1);

    if (tutorials && tutorials.length > 0) {
      await supabase
        .from('experience_features')
        .upsert({
          experience_id: experienceId,
          brand_id: brandId,
          feature_name: 'tutorialsRoutines',
          is_enabled: true,
          status: 'draft'
        }, {
          onConflict: 'experience_id,feature_name',
          ignoreDuplicates: true
        });
    }
  } catch (e) {
    console.warn('Failed to auto-enable tutorialsRoutines feature', e);
  }
}
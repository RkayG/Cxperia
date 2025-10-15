import { createClient } from '@/lib/supabase/server';
import { sanitizeExperienceData } from '@/utils/sanitizePublicData';

export async function getExperienceBySlug(slug: string) {
  try {
    console.log('🔍 getExperienceBySlug called with slug:', slug);
    const supabase = await createClient();

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
      .eq('is_published', true)
      .single();

    if (expError) {
      console.log('❌ Database error for slug:', slug, expError);
      if (expError.code === 'PGRST116') { // No rows found
        console.log('📭 No experience found with slug:', slug);
        return null;
      }
      throw expError;
    }

    console.log('✅ Experience found for slug:', slug, 'ID:', exp?.id);

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

    return { success: true, data: sanitizedExp };

  } catch (error: any) {
    console.error('💥 Error getting experience by slug:', slug, error);
    return null;
  }
}

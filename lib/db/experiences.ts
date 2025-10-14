import { supabase } from '@/lib/supabase';
import { setDefaultExperienceFeatures } from './experienceFeatures';

export interface Experience {
  id?: string;
  brand_id: string;
  product_id?: string;
  is_published: boolean;
  public_slug?: string;
  experience_url?: string;
  qr_code_url?: string;
  theme?: string;
  primary_color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id?: string;
  brand_id: string;
  name: string;
  tagline?: string;
  description?: string;
  category?: string;
  skin_type?: string;
  store_link?: string;
  product_image_url?: string[];
  logo_url?: string;
  net_content?: string;
  estimated_usage_duration_days?: number;
  original_price?: number;
  discounted_price?: number;
  created_at?: string;
  updated_at?: string;
}

export async function createExperience(experienceData: Omit<Experience, 'id' | 'created_at' | 'updated_at'>) {
  // Generate unique public_slug
  const public_slug = await generateUniqueSlug();
  
  const { data, error } = await supabase
    .from('experiences')
    .insert([{ ...experienceData, public_slug }])
    .select(`
      *,
      products (*)
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create experience: ${error.message}`);
  }

  // Set default features
  await setDefaultExperienceFeatures({
    experienceId: data.id,
    brandId: experienceData.brand_id,
  });

  return data;
}

export async function getExperienceById(id: string, brandId?: string) {

  if (!id ) {
    throw new Error('Experience ID is required');
  }
  if (brandId === '' || brandId === null) {
    throw new Error('Brand ID cannot be an empty string');
  }

  let query = supabase
    .from('experiences')
    .select(`
      *,
      products (*),
      experience_features (*)
    `)
    .eq('id', id);

  if (brandId) {
    query = query.eq('brand_id', brandId);
  }

  const { data, error } = await query.single();

  if (error) {
    throw new Error(`Failed to fetch experience: ${error.message}`);
  }

  if (!data) {
    throw new Error('Experience not found');
  }

  return data;
}

// Fetch only meta fields to avoid heavy joins
export async function getExperienceMetaById(id: string) {

  if (!id) {
    throw new Error('Experience ID is required');
  }

  const { data, error } = await supabase
    .from('experiences')
    .select('id, public_slug, experience_url')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Failed to fetch experience meta: ${error.message}`);
  if (!data) throw new Error('Experience not found');
  return data;
}

export async function updateExperience(id: string, updates: Partial<Experience>) {
  if (Object.keys(updates).length === 0) {
    throw new Error('No updates provided');
  }
  if (!id) {
    throw new Error('Experience ID is required');
  }
  const { data, error } = await supabase
    .from('experiences')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, theme, primary_color, public_slug, updated_at, products(*)')
    .single();

  if (error) {
    throw new Error(`Failed to update experience: ${error.message}`);
  }

  // Invalidate Next.js cache for the experience page and public API
  try {
    const { revalidatePath } = await import('next/cache');
    if (data.public_slug) {
      // Revalidate the experience page
      revalidatePath(`/experience/${data.public_slug}`);
      // Also revalidate the public API cache
      revalidatePath(`/api/public/experience/${data.public_slug}`);
    }
  } catch (revalidateError) {
   // console.warn('Failed to revalidate cache:', revalidateError);
    // Don't throw error - cache invalidation is not critical
  }

  return data;
}

export async function deleteExperience(id: string) {
  if (!id) {
    throw new Error('Experience ID is required');
  }
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete experience: ${error.message}`);
  }
}

export async function getExperiencesByBrand(brandId: string) {
  if (!brandId) {
    throw new Error('Brand ID is required');
  }
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      products (*)
    `)
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch experiences: ${error.message}`);
  }

  return data;
}

export async function getRecentExperiences(brandId: string) {
  if (!brandId) {
    throw new Error('Brand ID is required');
  }
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      products (*)
    `)
    .eq('brand_id', brandId)
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch recent experiences: ${error.message}`);
  }

  return data;
}

export async function setPublishStatus(id: string, isPublished: boolean) {

  if (!id) {
    throw new Error('Experience ID is required');
  }

  const { data, error } = await supabase
    .from('experiences')
    .update({ 
      is_published: isPublished, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select('id, is_published, public_slug, updated_at')
    .single();

  if (error) {
    throw new Error(`Failed to update publish status: ${error.message}`);
  }

  // Invalidate Next.js cache for the experience page and public API
  try {
    const { revalidatePath } = await import('next/cache');
    if (data.public_slug) {
      // Revalidate the experience page
      revalidatePath(`/experience/${data.public_slug}`);
      // Also revalidate the public API cache
      revalidatePath(`/api/public/experience/${data.public_slug}`);
    }
  } catch (revalidateError) {
   // console.warn('Failed to revalidate cache:', revalidateError);
    // Don't throw error - cache invalidation is not critical
  }

  return data;
}

export async function setThemeAndColor(id: string, theme?: string, primary_color?: string) {
  if (!id) {
    throw new Error('Experience ID is required');
  }
  const updates: any = { updated_at: new Date().toISOString() };
  if (theme !== undefined) updates.theme = theme;
  if (primary_color !== undefined) updates.primary_color = primary_color;

  const { error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update theme and color: ${error.message}`);
  }

  // Get public_slug for cache invalidation
  const { data: expData } = await supabase
    .from('experiences')
    .select('public_slug')
    .eq('id', id)
    .single();

  // Invalidate Next.js cache for the experience page and public API
  try {
    const { revalidatePath } = await import('next/cache');
    if (expData?.public_slug) {
      // Revalidate the experience page
      revalidatePath(`/experience/${expData.public_slug}`);
      // Also revalidate the public API cache
      revalidatePath(`/api/public/experience/${expData.public_slug}`);
    }
  } catch (revalidateError) {
   // console.warn('Failed to revalidate cache:', revalidateError);
    // Don't throw error - cache invalidation is not critical
  }

  return { success: true };
}

export async function getOrSetExperienceUrl(id: string) {
  if (!id) {
    throw new Error('Experience ID is required');
  }
  // First, get the experience
  const experience = await getExperienceMetaById(id);
  
  if (experience.experience_url) {
    return experience.experience_url;
  }

  // Generate experience URL
  const baseUrl = process.env.NEXT_PLATFORM_URL || 'http://localhost:3000';
  const public_slug = experience.public_slug || await generateUniqueSlug();
  
  const experience_url = `${baseUrl}/experience/${public_slug}`;

  // Update the experience with the URL and slug
  const { error } = await supabase
    .from('experiences')
    .update({ 
      experience_url, 
      public_slug,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to set experience URL: ${error.message}`);
  }

  return experience_url;
}

async function generateUniqueSlug(): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let slug = '';

  while (!isUnique) {
    slug = '';
    for (let i = 0; i < 8; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const { data } = await supabase
      .from('experiences')
      .select('id')
      .eq('public_slug', slug)
      .single();

    if (!data) {
      isUnique = true;
    }
  }

  return slug;
}
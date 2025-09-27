import { supabase } from '@/lib/supabase';

export interface ProductData {
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
}

export async function createProduct(brandId: string, productData: ProductData) {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...productData, brand_id: brandId }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data;
}

export async function updateProduct(productId: string, updates: Partial<ProductData>) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data;
}
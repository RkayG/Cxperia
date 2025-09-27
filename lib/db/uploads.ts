import { supabase } from '@/lib/supabase';

export interface UploadRecord {
  id?: string;
  brand_id: string | null;
  user_id: string;
  url: string;
  public_id: string;
  file_type: string;
  original_name: string;
  bytes: number;
  created_at?: string;
}

export async function createUploadRecord(uploadData: Omit<UploadRecord, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('uploads')
    .insert([uploadData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create upload record: ${error.message}`);
  }

  return data;
}

export async function deleteUploadRecord(uploadId: string, user: any) {
  // First, get the upload to check permissions
  const { data: upload, error: fetchError } = await supabase
    .from('uploads')
    .select('*')
    .eq('id', uploadId)
    .single();

  if (fetchError) {
    throw new Error('Upload not found');
  }

  // Check authorization
  if (user.brand_id && upload.brand_id && String(upload.brand_id) !== String(user.brand_id) && user.role !== 'super_admin') {
    throw new Error('Not authorized to delete this upload');
  }

  // Delete from database
  const { error: deleteError } = await supabase
    .from('uploads')
    .delete()
    .eq('id', uploadId);

  if (deleteError) {
    throw new Error(`Failed to delete upload record: ${deleteError.message}`);
  }

  return upload;
}

export async function getUploadsByBrand(brandId: string) {
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('brand_id', brandId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch uploads: ${error.message}`);
  }

  return data;
}
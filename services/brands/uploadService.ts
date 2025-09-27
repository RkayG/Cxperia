import { supabase } from '@/lib/supabase';

const DEFAULTS = {
  maxImageSize: 10 * 1024 * 1024,
  maxVideoSize: 100 * 1024 * 1024,
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
  allowedVideoTypesPrefix: 'video/',
};

export interface UploadResult {
  url: string;
  public_id: string;
  upload_record?: any;
  raw?: any;
}

export async function uploadFile(
  file: File,
  folder: string = 'experience_uploads',
  options?: { onProgress?: (progress: number) => void }
): Promise<UploadResult> {
  // Validation
  const isVideo = file.type.startsWith(DEFAULTS.allowedVideoTypesPrefix);
  const maxSize = isVideo ? DEFAULTS.maxVideoSize : DEFAULTS.maxImageSize;
  
  if (file.size > maxSize) {
    throw new Error(`File too large. Max ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
  }

  if (!isVideo && !DEFAULTS.allowedImageTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  const result = await response.json();
  return {
    url: result.data.cloudinary.secure_url,
    public_id: result.data.cloudinary.public_id,
    upload_record: result.data.upload_record,
    raw: result,
  };
}

export async function deleteUpload(uploadId: string) {
  const response = await fetch(`/api/upload?id=${uploadId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Delete failed');
  }

  return await response.json();
}
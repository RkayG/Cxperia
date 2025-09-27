import { useState } from 'react';
import { uploadFile, deleteUpload, UploadResult } from '@/services/brands/uploadService';

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, folder?: string) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress (you can enhance this with actual progress events)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadFile(file, folder);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return {
    upload,
    deleteUpload,
    uploading,
    progress,
    error,
    resetError: () => setError(null),
  };
}
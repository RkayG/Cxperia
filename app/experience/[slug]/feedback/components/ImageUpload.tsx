// src/components/ImageUpload.tsx
import { Loader2, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { usePublicImageUpload } from '@/hooks/public/usePublicFeedbackApi';
import { showToast } from '@/utils/toast';

interface ImageUploadProps {
  images?: string[];
  onImagesChange?: (images: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images = [], onImagesChange }) => {
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const uploadMutation = usePublicImageUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileId = `${file.name}-${Date.now()}`;
      
      // Add to uploading set
      setUploadingFiles(prev => new Set([...prev, fileId]));
      
      try {
        const result = await uploadMutation.mutateAsync(file);
        
        // Add the uploaded image URL to the images array
        if (onImagesChange) {
          onImagesChange([...images, (result as any).data.url]);
        }
        
        showToast.success('Image uploaded successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
        showToast.error(errorMessage);
      } finally {
        // Remove from uploading set
        setUploadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
        
        // Clear the input
        event.target.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (onImagesChange) {
      const newImages = images.filter((_, index) => index !== indexToRemove);
      onImagesChange(newImages);
    }
  };

  const isUploading = uploadMutation.status === 'pending' || uploadingFiles.size > 0;

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700">Télécharger des images (Optionnel)</p>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Upload Button */}
        <label 
          htmlFor="image-upload" 
          className={`flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 size={24} className="text-gray-400 animate-spin" />
          ) : (
            <Plus size={30} className="text-gray-400" />
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>

        {/* Display Uploaded Images */}
        {images.map((imageSrc, index) => (
          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden shadow-md group">
            <img 
              src={imageSrc} 
              alt={`Uploaded ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            {/* Remove button */}
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Upload info */}
      <p className="text-xs text-gray-500">
        Max 5MB par image. Formats supportés: JPEG, PNG, WebP
      </p>
    </div>
  );
};

export default ImageUpload;

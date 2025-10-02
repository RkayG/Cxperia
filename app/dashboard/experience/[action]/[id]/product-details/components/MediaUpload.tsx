import { PictureInPictureIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import demo3Image from '@/assets/images/demo3.jpg';
import demo4Image from '@/assets/images/demo4.png';
import demo6Image from '@/assets/images/demo6.png';
import { useUpload } from '@/hooks/brands/use-uploads';
import type { MediaUploadProps, UploadedImage } from '@/types/productExperience';
import UploadTips from './UploadTips';

const MediaUpload: React.FC<MediaUploadProps> = ({ images, onImagesUpdate, errors }) => {

  const [dragActive, setDragActive] = useState(false);
  //console.log('MediaUpload images:', images);
  // Preset images from fetched experience if available (convert URLs to UploadedImage objects)
  React.useEffect(() => {
    if (images && images.length > 0) {
      // If images are string URLs, convert to UploadedImage objects
      if (typeof images[0] === 'string') {
        // Only map string values to UploadedImage objects
        const presetImages = images
          .map((img, idx) => {
            if (typeof img === 'string') {
              return {
                id: `preset-${idx}`,
                url: img as string,
                preview: img as string,
                uploading: false,
                uploadError: null,
              } as UploadedImage;
            }
            return null;
          })
          .filter((img): img is UploadedImage => Boolean(img));
        onImagesUpdate(presetImages);
      }
    }
  }, [images, onImagesUpdate]);

  const { upload, uploading, progress, error } = useUpload();

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const newImages: UploadedImage[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/') && images.length + newImages.length < 10) {
          const id = Math.random().toString(36).substring(7);
          const preview = URL.createObjectURL(file);
          newImages.push({
            id,
            file,
            preview,
            url: '',
            uploading: true,
            uploadError: null,
          } as UploadedImage);
        }
      });

      const updated = [...images, ...newImages];
      onImagesUpdate(updated);

      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i];
        if (!img) continue; // Skip undefined images
        try {
          const res: any = await upload(img.file!, 'experience_images');
          let url = '';
          if (res?.url) url = res.url;
          else if (res?.secure_url) url = res.secure_url;
          else if (res?.data?.url) url = res.data.url;
          else if (res?.data?.secure_url) url = res.data.secure_url;
          // Update image with url
          const targetIndex = images.length + i;
          if (updated[targetIndex]) {
            updated[targetIndex].url = url;
            updated[targetIndex].uploading = false;
            updated[targetIndex].file = undefined;
          }
        } catch (e: any) {
          const targetIndex = images.length + i;
          if (updated[targetIndex]) {
            updated[targetIndex].uploading = false;
            updated[targetIndex].uploadError = e?.message || 'Upload failed';
          }
        }
        onImagesUpdate([...updated]);
      }
    },
    [images, onImagesUpdate, upload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  }, [handleFiles]);

  const removeImage = useCallback((id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    onImagesUpdate(updatedImages);
  }, [images, onImagesUpdate]);

  const sampleImages = [
    { id: 'sample1', url: demo6Image, name: 'Slot 1' },
    { id: 'sample2', url: demo4Image, name: 'Slot 4' },
    { id: 'sample3', url: demo3Image, name: 'Slot 5' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Media Upload</h2>
        <p className="text-gray-600 text-sm">Upload high-quality images of your product. A maximum of 10 images are allowed.</p>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <div
            id="images"
            data-key="images"
            className={`
              relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300
              ${images.some(img => img.uploading) 
                ? 'border-blue-400 bg-blue-50' 
                : dragActive 
                  ? 'border-purple-400 bg-purple-50' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }
              ${errors?.images ? ' border-red-600 bg-red-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <PictureInPictureIcon className={`mx-auto h-12 w-12 mb-4 ${images.some(img => img.uploading) ? 'text-blue-400' : 'text-gray-400'}`} />
            {images.some(img => img.uploading) ? (
              <>
                <h3 className="text-lg font-medium text-blue-700 mb-2">Uploading images...</h3>
                <p className="text-sm text-blue-600 mb-4">Please wait for uploads to complete</p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-600 mr-2"></div>
                  Uploading...
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Click to upload or drag and drop</h3>
                <p className="text-sm text-gray-600 mb-4">PNG, JPG up to 10MB each</p>
                <button type="button" className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium">
                  <PictureInPictureIcon className="w-4 h-4 mr-2" />Browse Files
                </button>
              </>
            )}
          </div>

          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Images ({images.length}/10)</h4>
              <div className="grid grid-cols-3 gap-3">
                {images.map((image, idx) => {
                  // Support both UploadedImage and string URL
                  const src = typeof image === 'string' ? image : (image.preview || image.url);
                  const id = typeof image === 'string' ? `preset-${idx}` : image.id;
                  return (
                    <div key={id} className="relative group">
                      <div className="w-full h-24 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                        <Image src={src || ''} alt="Upload preview" width={96} height={96} className="w-full h-full object-cover" />
                        {typeof image !== 'string' && image.uploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white" />
                          </div>
                        )}
                        {typeof image !== 'string' && !image.uploading && image.uploadError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-600 text-xs">{image.uploadError}</div>
                        )}
                      </div>
                      <button onClick={() => removeImage(id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs">×</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors?.images && <p className="text-xs text-red-600 mt-2">{errors.images}</p>}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">Sample images</h4>
              <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">3 Preview</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {sampleImages.map((image) => (
                <div key={image.id} className="text-center">
                  <div className="w-full h-24 bg-gradient-to-br from-orange-200 to-yellow-300 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    <Image src={image.url} alt={image.name} width={96} height={96} className="object-cover w-full h-full rounded-lg" />
                  </div>
                  <p className="text-xs text-gray-600">{image.name}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors duration-200">Adjust Thumbnail</button>
        </div>

        <div>
          <UploadTips />
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
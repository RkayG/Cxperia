import { PictureInPictureIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import type { MediaUploadProps, UploadedImage } from '@/types/productExperience';
import UploadTips from './UploadTips';
import demo3Image from '@/assets/images/demo3.jpg';
import demo4Image from '@/assets/images/demo4.png';
import demo6Image from '@/assets/images/demo6.png';
import { uploadFiles } from '@/services/brands/uploadService';

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

  const handleFiles = useCallback((files: FileList | null) => {
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

    (async () => {
      const filesToUpload = newImages.map(n => n.file!).filter(Boolean);
      if (filesToUpload.length === 0) return;
      try {
        const res: any = await uploadFiles(filesToUpload, 'experience_images');
        //console.log('[MediaUpload] uploadFiles response:', res);

        let uploadedUrls: string[] = [];
        // common shapes: array of {url}, { success, data: [...] }, { data: { results: [...] } }, { raw: ... }
        if (Array.isArray(res)) {
          uploadedUrls = res.map((r: any) => r.url || r.secure_url).filter(Boolean);
        } else if (res && Array.isArray(res.data)) {
          uploadedUrls = res.data.map((r: any) => r.url || r.secure_url).filter(Boolean);
        } else if (res && Array.isArray(res.results)) {
          uploadedUrls = res.results.map((r: any) => r.url || r.secure_url).filter(Boolean);
        } else if (res && res.data && Array.isArray(res.data.results)) {
          uploadedUrls = res.data.results.map((r: any) => r.url || r.secure_url).filter(Boolean);
        } else if (res && res.raw) {
          const raw = res.raw;
          // support raw data shapes returned by the upload controller: { success: true, data: [...], records: [...] }
          if (Array.isArray(raw)) uploadedUrls = raw.map((r: any) => r.url || r.secure_url).filter(Boolean);
          else if (Array.isArray(raw.data)) uploadedUrls = raw.data.map((r: any) => r.url || r.secure_url).filter(Boolean);
          else if (Array.isArray(raw.records)) uploadedUrls = raw.records.map((r: any) => r.url || r.secure_url || r.cloudinary?.secure_url).filter(Boolean);
          else if (raw && Array.isArray(raw.results)) uploadedUrls = raw.results.map((r: any) => r.url || r.secure_url).filter(Boolean);
        } else if (res && res.url) {
          uploadedUrls = [res.url];
        }

        const mapped = updated.map(img => ({ ...img } as UploadedImage));
        let uidx = 0;
        for (let i = 0; i < mapped.length; i++) {
          if (mapped[i].uploading && mapped[i].file) {
            mapped[i].url = uploadedUrls[uidx] || '';
            mapped[i].uploading = false;
            mapped[i].file = undefined;
            uidx++;
          }
        }
        onImagesUpdate(mapped);
      } catch (e: any) {
        const mapped = updated.map(img => ({ ...img } as UploadedImage));
        for (let i = 0; i < mapped.length; i++) {
          if (mapped[i].uploading && mapped[i].file) {
            mapped[i].uploading = false;
            mapped[i].uploadError = e?.message || 'Upload failed';
          }
        }
        onImagesUpdate(mapped);
      }
    })();
  }, [images, onImagesUpdate]);

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
        <p className="text-gray-600 text-sm">Upload high-quality images of your product. A maximum of 5 images are allowed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <div
            id="images"
            data-key="images"
            className={`
              relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300
              ${dragActive 
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
            
            <PictureInPictureIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Click to upload or drag and drop</h3>
            <p className="text-sm text-gray-600 mb-4">PNG, JPG up to 10MB each</p>
            <button type="button" className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 font-medium">
              <PictureInPictureIcon className="w-4 h-4 mr-2" />Browse Files
            </button>
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
                        <Image src={src} alt="Upload preview" width={96} height={96} className="w-full h-full object-cover" />
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
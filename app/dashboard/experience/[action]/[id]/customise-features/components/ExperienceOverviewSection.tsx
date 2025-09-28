import React, { useState } from 'react';
import { PictureInPicture, ExternalLink, Loader2 } from 'lucide-react';
import type { ExperienceOverviewProps } from '@/types/productExperience';
import { uploadFile } from '@/services/brands/uploadService';
import { setBrandLogo } from '@/services/brands/featureService';
import { showToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import { useBrandLogo } from '@/hooks/brands/useFeatureApi';

const ExperienceOverviewSection: React.FC<ExperienceOverviewProps> = ({ data, onUpdate }) => {
  // Only logo can be updated, all other fields are read-only
  const { data: brandLogoData } = useBrandLogo();
  console.log('brand logo', brandLogoData);
  const [editData, setEditData] = useState({
    logoFile: (brandLogoData?.data?.logo_url ?? '')
  });

  // Sync editData with data when not editing and data changes
  React.useEffect(() => {
    setEditData(prev => ({
      ...prev,
      logoFile: (brandLogoData?.data?.logo_url ?? '')
    }));
  }, [data.logoFile, brandLogoData]);

  // Remove handleInputChange, only logo can be updated

  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Immediately upload the selected logo and store the returned URL in context
    (async () => {
      try {
        setIsUploading(true);
        // Create a temporary preview while uploading
        const tempPreviewUrl = URL.createObjectURL(file);
        setEditData(prev => ({ ...prev, logoFile: tempPreviewUrl }));
        
        const res: any = await uploadFile(file, 'experience_logos');
        console.debug('[ExperienceOverview] logo upload res:', res);
        let url = '';
        if (res && res.url) url = res.url;
        else if (res && res.raw && Array.isArray(res.raw.data) && res.raw.data[0]) url = res.raw.data[0].url || res.raw.data[0].secure_url;
        else if (res && res.raw && Array.isArray(res.raw.records) && res.raw.records[0]) url = res.raw.records[0].url || res.raw.records[0].cloudinary?.secure_url;
        else if (res && res.data && Array.isArray(res.data) && res.data[0]) url = res.data[0].url || res.data[0].secure_url;
        
        if (url) {
          // Set local logo state immediately so UI updates
          setEditData(prev => ({ ...prev, logoFile: url }));
          onUpdate({ logoFile: url }); // store URL string so create flow sends only URLs
          // Persist brand logo on server
          try {
            const resp = await setBrandLogo(url);
            console.debug('[ExperienceOverview] setBrandLogo response:', resp);
            if (resp && resp.success && resp.data && resp.data.logo_url) {
              // Use the returned logo_url from backend if available
              setEditData(prev => ({ ...prev, logoFile: resp.data.logo_url }));
              onUpdate({ logoFile: resp.data.logo_url });
              showToast.success('Brand logo updated');
            } else if (resp && resp.success) {
              showToast.success('Brand logo updated');
            } else {
              showToast.error('Failed to persist brand logo');
            }
          } catch (e) {
            console.log('Failed to call setBrandLogo', e);
            showToast.error('Failed to persist brand logo');
          }
        } else {
          // If no url extracted, still surface the file so user can retry later
          setEditData(prev => ({ ...prev, logoFile: file }));
          onUpdate({ logoFile: file });
          console.log('Logo upload did not return a URL', res);
        }
      } catch (err) {
        console.log('Logo upload failed', err);
        setEditData(prev => ({ ...prev, logoFile: file }));
        onUpdate({ logoFile: file });
        showToast.error('Logo upload failed');
      } finally {
        setIsUploading(false);
      }
    })();
  };

  return (
    <div className="bg-[#ede8f3] rounded-2xl border-1 border-purple-800 p-6">
      <Toaster />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Experience Overview</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Compact Summary */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-md text-left">
            {/* Experience Name & Category */}
            <div>
              <div className="mb-3">
                <span className="text-gray-900 font-semibold">Experience:</span>
                  <p className={
                    `font-medium ${data.experienceName ? 'text-gray-900' : 'text-[#ede8f3]'}`
                  }>
                    {data.experienceName ? data.experienceName : '...'}
                  </p>
              </div>
              <div className="mb-3">
                <span className="text-gray-900 font-semibold">Tagline:</span>
                  <p
                    className={
                      `font-medium leading-snug max-w-[320px] truncate ${data.shortTagline ? 'text-gray-900' : 'text-[#ede8f3]'}`
                    }
                    title={data.shortTagline}
                  >
                    {data.shortTagline
                      ? (data.shortTagline.length > 60
                          ? data.shortTagline.slice(0, 60) + '...'
                          : data.shortTagline)
                      : '...'}
                  </p>
              </div>
            </div>

            {/* Category & Store URL */}
            <div>
              <div className='mb-3'>
                <span className="text-gray-900 font-semibold min-h-32px">Category:</span>
                <p className="font-medium text-gray-900">{data.category || ''}</p>
              </div>
              <div>
                <span className="text-gray-900 font-semibold min-h-32px">Store:</span>
                <p> 
                  <a 
                    href={data.storeLink || ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-purple-800 hover:text-purple-700 inline-flex items-center gap-1 group"
                  >
                    <span className="truncate max-w-[200px]">{data.storeLink || ''}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 flex-shrink-0" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logo Upload - Prominent */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-4 relative">
            {/* Uploading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
                <p className="text-sm font-medium text-gray-700">Uploading...</p>
                <p className="text-xs text-gray-500 mt-1">Please wait</p>
              </div>
            )}
            
            <label className="block cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="sr-only"
                disabled={isUploading}
              />
              
              {(editData.logoFile || brandLogoData?.data?.logo_url) ? (
                <div className="relative">
                  <img
                    src={
                      typeof editData.logoFile === 'string' && editData.logoFile
                        ? editData.logoFile
                        : (editData.logoFile instanceof File
                            ? URL.createObjectURL(editData.logoFile)
                            : brandLogoData?.data?.logo_url || '')
                    }
                    alt="Logo preview"
                    className="w-full h-32 object-contain rounded-lg bg-white p-2"
                  />
                  {!isUploading && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm">
                        Change Logo
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-32 flex flex-col items-center justify-center text-center group-hover:border-purple-400 group-hover:bg-purple-50/50 rounded-lg transition-all duration-200">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors duration-200">
                    <PictureInPicture className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Upload Brand Logo</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">Recommended: 400x400px</p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceOverviewSection;
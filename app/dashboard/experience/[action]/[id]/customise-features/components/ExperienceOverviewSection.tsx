import { ExternalLink, Loader2, PictureInPicture } from 'lucide-react';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrandLogo } from '@/hooks/brands/useFeatureApi';
import { setBrandLogo } from '@/services/brands/featureService';
import { uploadFile } from '@/services/brands/uploadService';
import type { ExperienceOverviewProps } from '@/types/productExperience';
import { showToast } from '@/utils/toast';

const ExperienceOverviewSection: React.FC<ExperienceOverviewProps> = ({ data, onUpdate, isLoading: externalLoading }) => {
  console.log('data', data);
  // Only logo can be updated, all other fields are read-only
  const { data: brandLogoData, isLoading: isBrandLogoLoading } = useBrandLogo();

  // Determine if we're in a loading state
  const isLoading = externalLoading || (!data.experienceName && !data.shortTagline && !data.category);

  // Skeleton component for the overview section
  const OverviewSkeleton = () => (
    <div className="bg-[#ede8f3] rounded-xl border border-purple-800 p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Compact Summary Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Left Column */}
            <div>
              <div className="mb-2">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="mb-2">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-2">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logo Upload Skeleton */}
        <div className="w-full lg:w-48 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-3">
            <div className="h-24 flex flex-col items-center justify-center text-center">
              <Skeleton className="w-8 h-8 rounded-lg mb-1" />
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
          <Skeleton className="h-2 w-24 mx-auto mt-1" />
        </div>
      </div>
    </div>
  );
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

  // Show skeleton while loading
  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="bg-[#ede8f3] rounded-xl   mb-8 md:mb-12 border border-purple-800 p-4">
      <Toaster />
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Experience Overview</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Compact Summary */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Experience Name & Category */}
            <div>
              <div className="mb-2">
                <span className="text-gray-700 font-medium text-xs uppercase tracking-wide">Experience:</span>
                <p className={`font-medium text-sm ${data.experienceName ? 'text-gray-900' : 'text-gray-400'}`}>
                  {data.experienceName ? data.experienceName : '...'}
                </p>
              </div>
              <div className="mb-2">
                <span className="text-gray-700 font-medium text-xs uppercase tracking-wide">Tagline:</span>
                <p
                  className={`font-medium text-sm leading-snug max-w-[280px] truncate ${data.shortTagline ? 'text-gray-900' : 'text-gray-400'}`}
                  title={data.shortTagline}
                >
                  {data.shortTagline
                    ? (data.shortTagline.length > 50
                        ? data.shortTagline.slice(0, 50) + '...'
                        : data.shortTagline)
                    : '...'}
                </p>
              </div>
            </div>

            {/* Category & Store URL */}
            <div>
              <div className="mb-2">
                <span className="text-gray-700 font-medium text-xs uppercase tracking-wide">Category:</span>
                <p className="font-medium text-sm text-gray-900">{data.category || ''}</p>
              </div>
              <div>
                <span className="text-gray-700 font-medium text-xs uppercase tracking-wide">Store:</span>
                <p> 
                  <a 
                    href={data.storeLink || ''} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-purple-800 hover:text-purple-700 inline-flex items-center gap-1 group text-sm"
                  >
                    <span className="truncate max-w-[180px]">{data.storeLink || ''}</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 flex-shrink-0" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logo Upload - Compact */}
        <div className="w-full lg:w-48 flex-shrink-0">
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-3 relative">
            {/* Uploading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 rounded-lg flex flex-col items-center justify-center z-10">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin mb-1" />
                <p className="text-xs font-medium text-gray-700">Uploading...</p>
                <p className="text-xs text-gray-500">Please wait</p>
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
                    className="w-full h-24 object-contain rounded-lg bg-white p-1"
                  />
                  {!isUploading && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white rounded px-2 py-1 text-xs font-medium text-gray-900 shadow-sm">
                        Change
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-24 flex flex-col items-center justify-center text-center group-hover:border-purple-400 group-hover:bg-purple-50/50 rounded-lg transition-all duration-200">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-1 group-hover:bg-purple-100 transition-colors duration-200">
                    <PictureInPicture className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Upload Logo</p>
                  <p className="text-xs text-gray-500">PNG, JPG</p>
                </div>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-500 text-center mt-1">400x400px</p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceOverviewSection;
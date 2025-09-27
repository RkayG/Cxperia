// src/components/PreviewMode/MobilePreview.tsx

import React from 'react';
import type { MobilePreviewProps } from '@/types/productExperience';
import { useExperienceUrl } from '@/hooks/brands/useExperienceApi';


const MobilePreview: React.FC<MobilePreviewProps> = ({ experienceId }) => {
  const [loading, setLoading] = React.useState(true);
  const [_showSparkle, setShowSparkle] = React.useState(true);
  const { data, isLoading, error, refetch } = useExperienceUrl(experienceId);

  // Fallback to default preview if no experience_url
  const previewUrl = data?.experience_url
    ? `${data.experience_url}`
    : `https://cyxperia.vercel.app`;

  React.useEffect(() => {
    if (!isLoading && !loading) {
      setShowSparkle(false);
    }
  }, [isLoading, loading]);

  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative  sm:min-w-102 h-[600px] bg-black rounded-[2.5rem] shadow-xl flex items-center justify-center overflow-hidden">
        {/* Phone Bezel */}
        <div
          className="absolute inset-0 border-[8px] rounded-[2.5rem] z-10 pointer-events-none"
          style={{ borderColor: 'black', borderStyle: 'solid', borderWidth: 8 }}
        >
          {/* Speaker/Camera Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl"></div>
        </div>

        {/* Screen Content: Live Preview Iframe */}
        <div className="relative w-[calc(100%-16px)] h-[calc(100%-16px)] bg-white rounded-[2rem] overflow-hidden flex flex-col items-center p-0">
          {(loading || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
              <span className="text-gray-500 text-base font-medium">Loading preview…</span>
            </div>
          )}
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20">
              <span className="text-red-500 text-base font-semibold mb-4">Error preparing preview.</span>
              <button
                className="px-4 py-2 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-800 transition"
                onClick={() => {
                  setLoading(true);
                  setShowSparkle(true);
                  refetch();
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <iframe
              src={previewUrl}
              title="Live Customer Preview"
              className="w-full h-full border-0 rounded-[2rem]"
              style={{ minHeight: 0, minWidth: 0 }}
              allow="clipboard-write; clipboard-read"
              onLoad={() => {
                setLoading(false);
                setShowSparkle(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;

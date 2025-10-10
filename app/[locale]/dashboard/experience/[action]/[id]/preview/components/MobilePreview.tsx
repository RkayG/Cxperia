// src/components/PreviewMode/MobilePreview.tsx

import React from 'react';
import SparkleOverlay from '@/components/SparkleOverlay';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import type { MobilePreviewProps } from '@/types/productExperience';
import { useTranslations } from 'next-intl';



const MobilePreview: React.FC<MobilePreviewProps> = ({ experienceId }) => {
  const [loading, setLoading] = React.useState(true);
  const [_showSparkle, setShowSparkle] = React.useState(true);
  const { getExperienceUrl, fetchExperienceUrl, isLoading } = useExperienceStore();
  const [error, setError] = React.useState<string | null>(null);
  const [iframeError, setIframeError] = React.useState(false);
  const [iframeKey, setIframeKey] = React.useState(0);
  const t = useTranslations('mobilePreview');
  
  // Get the URL for the current experience ID
  const experienceUrl = experienceId ? getExperienceUrl(experienceId) : null;

  React.useEffect(() => {
    if (experienceId) {
      // Only fetch if we don't already have the URL for this specific experience
      if (!experienceUrl) {
        console.log(`🔍 MobilePreview: No URL found for experience ${experienceId}, fetching...`);
        setLoading(true);
        fetchExperienceUrl(experienceId)
          .then(() => {
            setError(null);
            setIframeError(false);
            setLoading(false);
            console.log(`✅ MobilePreview: URL fetched for experience ${experienceId}`);
          })
          .catch((e) => {
            console.error('❌ MobilePreview: Error fetching experience URL:', e);
            setError('Error preparing preview.');
            setIframeError(true);
            setLoading(false);
          });
      } else {
        // URL already exists for this experience, just clear any previous errors
        console.log(`✅ MobilePreview: Using existing URL for experience ${experienceId}:`, experienceUrl);
        setError(null);
        setIframeError(false);
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId, experienceUrl]);

  // Fallback to default preview if no experience_url
  const previewUrl = experienceUrl ? `${experienceUrl}` : null;

  React.useEffect(() => {
    if (!isLoading && !loading) {
      setShowSparkle(false);
    }
  }, [isLoading, loading]);

  const handleIframeError = () => {
    console.error('Iframe failed to load:', previewUrl);
    setIframeError(true);
    setLoading(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setShowSparkle(true);
    setIframeError(false);
    setError(null);
    
    if (experienceId) {
      console.log(`🔄 MobilePreview: Retrying fetch for experience ${experienceId}`);
      fetchExperienceUrl(experienceId)
        .then(() => {
          setError(null);
          setIframeError(false);
          setLoading(false);
          console.log(`✅ MobilePreview: Retry successful for experience ${experienceId}`);
        })
        .catch((e) => {
          console.error(`❌ MobilePreview: Retry failed for experience ${experienceId}:`, e);
          setError('Error preparing preview.');
          setIframeError(true);
          setLoading(false);
        });
    } else {
      setError(null);
      setLoading(false);
    }
  };

  const handleReload = () => {
    console.log(`🔄 MobilePreview: Reloading iframe for experience ${experienceId}`);
    setLoading(true);
    setIframeError(false);
    setError(null);
    // Force iframe reload by changing the key
    setIframeKey(prev => prev + 1);
  };

  return (

    <div className="flex justify-center items-center p-4">
      {/* <SparkleOverlay /> */}
      <div className="relative  sm:min-w-102 h-[600px] bg-black rounded-[2.5rem] shadow-xl flex items-center justify-center overflow-hidden">
        {/* Phone Bezel */}
        <div
          className="absolute inset-0 border-[8px] rounded-[2.5rem] z-10 pointer-events-none"
          style={{ borderColor: 'black', borderStyle: 'solid', borderWidth: 8 }}
        >
          {/* Speaker/Camera Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-xl"></div>
        </div>

        {/* Reload Button - Floating in top-right corner */}
        {previewUrl && !loading && !isLoading && !error && !iframeError && (
          <button
            onClick={handleReload}
            className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
            title={t('reloadPreview')}
          >
            <svg 
              className="w-4 h-4 text-gray-600 hover:text-purple-600 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        )}

        {/* Screen Content: Live Preview Iframe */}
        <div className="relative w-[calc(100%-16px)] h-[calc(100%-16px)] bg-white rounded-[2rem] overflow-hidden flex flex-col items-center p-0">
          {(loading || isLoading) && !error && !iframeError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                <span className="text-gray-500 text-base font-medium">{t('loadingPreview')}</span>
              </div>
            </div>
          ) : (error || iframeError) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('previewUnavailable')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {error || t('previewError')}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg font-semibold shadow hover:bg-purple-800 transition"
                    onClick={handleRetry}
                  >
                    {t('retry')}
                  </button>
                  {previewUrl && (
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                      onClick={() => window.open(previewUrl, '_blank')}
                    >
                      {t('openInNewTab')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : previewUrl ? (
            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Live Customer Preview"
              className="w-full h-full border-0 rounded-[2rem]"
              style={{ minHeight: 0, minWidth: 0 }}
              allow="clipboard-write; clipboard-read; camera; microphone; geolocation"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              onLoad={() => {
                setLoading(false);
                setShowSparkle(false);
                setIframeError(false);
              }}
              onError={handleIframeError}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noPreviewAvailable')}</h3>
                <p className="text-sm text-gray-600">{t('experienceUrlNotFound')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;

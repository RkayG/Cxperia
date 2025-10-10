import { useTranslation } from '@/hooks/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function TestPage() {
  const { t: tCommon } = useTranslation('common');
  const { t: tMobile } = useTranslation('mobilePreview');
  const { t: tNav } = useTranslation('navigation');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <LanguageSwitcher />
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Translation Test Page
          </h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Common Translations:</h2>
              <p><strong>Loading:</strong> {tCommon('loading')}</p>
              <p><strong>Error:</strong> {tCommon('error')}</p>
              <p><strong>Retry:</strong> {tCommon('retry')}</p>
              <p><strong>Save:</strong> {tCommon('save')}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Mobile Preview Translations:</h2>
              <p><strong>Loading Preview:</strong> {tMobile('loadingPreview')}</p>
              <p><strong>Preview Unavailable:</strong> {tMobile('previewUnavailable')}</p>
              <p><strong>Reload Preview:</strong> {tMobile('reloadPreview')}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Navigation Translations:</h2>
              <p><strong>Dashboard:</strong> {tNav('dashboard')}</p>
              <p><strong>Settings:</strong> {tNav('settings')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
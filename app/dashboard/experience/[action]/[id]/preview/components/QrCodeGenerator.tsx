// src/components/PreviewMode/QrCodeGenerator.tsx
import { Image as ImageIcon, Loader2 } from "lucide-react";
import React from "react";
import { useQrApi } from "@/hooks/brands/useQrApi";

interface QrCodeGeneratorProps {
  setQrCodeImageUrl?: (url: string) => void;
  setProductName?: (name: string) => void;
  experienceId?: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ setQrCodeImageUrl, setProductName, experienceId }) => {
  const { generate, loading, error, qrDataUrl, productName } = useQrApi(experienceId);
  const [hasGenerated, setHasGenerated] = React.useState(false);
  React.useEffect(() => {
    if (qrDataUrl && setQrCodeImageUrl) {
      setQrCodeImageUrl(qrDataUrl);
    }
  }, [qrDataUrl, setQrCodeImageUrl]);

  React.useEffect(() => {
    if (productName && setProductName) {
      setProductName(productName);
    }
  }, [productName, setProductName]);
  const handleGenerate = async () => {
    if (experienceId) {
      await generate(String(experienceId));
     /*  if (typeof clearExperienceIdFromLocalStorage === 'function') {
        clearExperienceIdFromLocalStorage();
      } */
      setHasGenerated(true);
    }
  };

  return (
    <div className="bg-white p-8 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Générer votre code QR
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Créez un code QR unique qui connecte vos clients à leur expérience beauté personnalisée
        </p>
      </div>

      {/* QR Code Display */}
      <div className="relative mb-8">
        <div className="w-48 h-48 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-200 shadow-inner">
          {loading ? (
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="animate-spin text-purple-500 mb-2" />
              <span className="text-sm text-gray-500">Génération...</span>
            </div>
          ) : qrDataUrl ? (
            <div className="relative">
              <img
                src={qrDataUrl}
                alt="Code QR généré"
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/160x160/F3E8FF/6B46C1?text=QR+Code+Error`;
                }}
              />
              {/* Success indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon size={48} className="mb-2" />
              <span className="text-sm">Le code QR apparaîtra ici</span>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!qrDataUrl && !hasGenerated && (
        <button
          onClick={handleGenerate}
          disabled={loading || !experienceId}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 size={20} className="animate-spin mr-2" />
              Génération du code QR...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Générer le code QR
            </div>
          )}
        </button>
      )}

      {/* Regenerate Button - Show when QR exists but user wants to regenerate */}
      {qrDataUrl && !hasGenerated && (
        <button
          onClick={handleGenerate}
          disabled={loading || !experienceId}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 size={20} className="animate-spin mr-2" />
              Régénération du code QR...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Régénérer le code QR
            </div>
          )}
        </button>
      )}

      {/* Success State */}
      {qrDataUrl && hasGenerated && (
        <div className="text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl mb-4">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 font-semibold">Code QR généré avec succès !</span>
          </div>
          <p className="text-sm text-gray-600">
            Votre code QR est prêt à être téléchargé et partagé avec les clients
          </p>
        </div>
      )}
    </div>
  );
};

export default QrCodeGenerator;

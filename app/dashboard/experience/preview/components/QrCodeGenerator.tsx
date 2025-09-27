// src/components/PreviewMode/QrCodeGenerator.tsx

import React from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useQrApi } from "../../../../hooks/useQrApi";

interface QrCodeGeneratorProps {
  setQrCodeImageUrl?: (url: string) => void;
  setProductName?: (name: string) => void;
  experienceId?: string;
}

const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ setQrCodeImageUrl, setProductName, experienceId }) => {
  const { generate, loading, error, qrDataUrl, productName } = useQrApi();

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
    <div className=" p-6 sm:p-8 flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Generate QR Code
      </h3>
      <p className="text-sm text-gray-600 text-center mb-6">
        Generate your unique QR code.
        <br />
      </p>

      <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
        {loading ? (
          <Loader2 size={48} className="animate-spin text-purple-500" />
        ) : qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Generated QR Code"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/160x160/F3E8FF/6B46C1?text=QR+Code+Error`;
            }}
          />
        ) : (
          <ImageIcon size={48} className="text-gray-400" />
        )}
      </div>

      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      {!qrDataUrl && !hasGenerated && (
        <button
          onClick={handleGenerate}
          disabled={loading || !experienceId}
          className="w-full min-w-xs sm:w-auto px-10 py-3 bg-blue-800 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      )}
      {qrDataUrl && hasGenerated && (
          <div className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text text-base font-semibold rounded-xl px-4 py-3 shadow">
            All set! Your QR code is ready to delight.
          </div>
       
      )}
    </div>
  );
};

export default QrCodeGenerator;

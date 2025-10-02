// src/components/PreviewMode/DownloadOptions.tsx
import { Download } from 'lucide-react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/lib/toast';

interface DownloadOptionsProps {
  onDownload: (format: string) => void;
  qrCodeImageUrl?: string;
  productName?: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ qrCodeImageUrl, productName }) => {
  const formats = ['PNG', 'PDF'];

  // Helper to download the QR code in the requested format
  const handleDownload = (format: string) => {
    if (!qrCodeImageUrl) return;
    showToast.loading('Downloading...');
    const baseName = productName ? productName.replace(/\s+/g, '_') : 'qr-code';
    if (format === 'PNG') {
      const link = document.createElement('a');
      link.href = qrCodeImageUrl;
      link.download = `${baseName}_experience_qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'PDF') {
      import('jspdf').then(jsPDFModule => {
        const jsPDF = jsPDFModule.jsPDF;
        const doc = new jsPDF();
        doc.addImage(qrCodeImageUrl, 'PNG', 15, 40, 180, 180);
        doc.save(`${baseName}_experience_qr-code.pdf`);
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 flex flex-col items-center">
     <Toaster />
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Options</h3>
      <p className="text-sm text-gray-600 text-center mb-6">
        Choose the perfect format for your QR code. High-resolution files for all your needs.
      </p>

      <div className="w-full space-y-3">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => handleDownload(format)}
            disabled={!qrCodeImageUrl}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} className="mr-2" />
            Download {format}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DownloadOptions;

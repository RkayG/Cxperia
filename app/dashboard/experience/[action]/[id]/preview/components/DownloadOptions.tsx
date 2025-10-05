// src/components/PreviewMode/DownloadOptions.tsx
import { Download } from 'lucide-react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { showToast } from '@/utils/toast';

interface DownloadOptionsProps {
  onDownload: (format: string) => void;
  qrCodeImageUrl?: string;
  productName?: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ qrCodeImageUrl, productName }) => {
  const formats = ['PNG', 'PDF'];
  
  // Debug: Log the product name
  console.log('DownloadOptions - productName:', productName);

  // Helper to download the QR code in the requested format
  const handleDownload = (format: string) => {
    if (!qrCodeImageUrl) return;
    showToast.loading('Downloading...');
    const baseName = productName ? productName.replace(/\s+/g, '_') : 'qr-code';
    console.log('DownloadOptions - baseName:', baseName);
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
    <div className="p-8 max-w-md mx-auto">
      <Toaster />
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Download Your QR Code
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Get high-resolution files ready for print, digital use, or sharing with your team
        </p>
      </div>

      {/* Format Options */}
      <div className="space-y-4 mb-8">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => handleDownload(format)}
            disabled={!qrCodeImageUrl}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:from-purple-50 hover:to-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:from-gray-50 disabled:hover:to-gray-100"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500"></div>
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                  {format === 'PNG' ? (
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 text-lg">{format}</div>
                  <div className="text-sm text-gray-500">
                    {format === 'PNG' ? 'High-quality image file' : 'Print-ready document'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-purple-600 group-hover:text-purple-700 transition-colors">
                <Download size={20} className="mr-2" />
                <span className="font-medium">Download</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DownloadOptions;

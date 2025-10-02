// src/components/ProductDashboard/ProductCard.tsx

import jsPDF from 'jspdf';
import { Download, Eye, MoreHorizontal, Pencil, QrCode, Trash2 } from 'lucide-react';
import React from 'react';
// DownloadOptions inline for QR popover
const DownloadOptions: React.FC<{ qrCodeImageUrl?: string; productName?: string }> = ({ qrCodeImageUrl, productName }) => {
  const formats = ['PNG', 'PDF'];
  const baseName = productName ? productName.replace(/\s+/g, '_') : 'qr-code';
  const handleDownload = async (format: string) => {
    if (!qrCodeImageUrl) return;
    if (format === 'PNG') {
      const link = document.createElement('a');
      link.href = qrCodeImageUrl;
      link.download = `${baseName}_experience_qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'PDF') {
      const doc = new jsPDF();
      doc.addImage(qrCodeImageUrl, 'PNG', 15, 40, 180, 180);
      doc.save(`${baseName}_experience_qr-code.pdf`);
    }
  };
  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      {formats.map((format) => (
        <button
          key={format}
          onClick={() => handleDownload(format)}
          disabled={!qrCodeImageUrl}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={18} className="mr-2" />
          Download {format}
        </button>
      ))}
    </div>
  );
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { useDeleteExperience } from '@/hooks/brands/useExperienceApi';
import type { ProductCardProps } from './productTypes';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const qrCodeStatusColor = product.qrCodeStatus === 'Generated'
    ? 'bg-green-100 text-green-800'
    : product.qrCodeStatus === 'Pending'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-600';

  const handleEdit = () => {
    console.log("handleEdit product:", product);
    if (product.id) {
      router.push(`/dashboard/experience/edit/${product.id}?step=product-details`, { state: { experienceData: product._fullExp } } as any);
    }
  };

  // Delete experience mutation
  const { mutate: deleteExperience, status: deleteStatus } = useDeleteExperience();
  const isDeleting = deleteStatus === 'pending';

  const handleDelete = () => {
    if (product.id) {
      if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
        deleteExperience(product.id);
      }
    }
  };
  const handlePreviewOption = (option: 'dashboard' | 'browser') => {
    if (option === 'browser' && product._fullExp?.experience_url) {
      window.open(product._fullExp.experience_url, '_blank');
    } else {
      router.push(`/dashboard/experience/edit/${product.id}?step=preview`);
    }
  };
  const handleViewQr = () => {
    // TODO: Implement view QR code logic
    if (product._fullExp && product._fullExp.qr_code_url) {
      window.open(product._fullExp.qr_code_url, '_blank');
    } else {
      alert('No QR code available.');
    }
  };

  return (
    <div className="bg-white rounded-xl max-w-xs shadow-sm p-4 flex flex-col">
      <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/160x160/F3E8FF/6B46C1?text=Product`;
          }}
        />
        {/* QR Icon Popover for Generated status */}
        {product.qrCodeStatus === 'Generated' && product._fullExp?.qr_code_url && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-100 rounded-full p-2 shadow-lg hover:bg-purple-100 transition-all z-10">
                <QrCode size={32} className="text-purple-700 cursor-pointer" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="center" className="flex bg-white border-0 shadow-lg flex-col items-center w-72">
              <div className="mb-2 font-semibold text-purple-900">QR Code</div>
              <img
                src={product._fullExp.qr_code_url}
                alt="QR Code"
                className="w-40 h-40 object-contain bg-white border border-gray-200 rounded-lg mb-3"
              />
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => window.open(product._fullExp.qr_code_url, '_blank')}
                  className="px-4 py-2 bg-gray-200 text-purple-800 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Open in Tab
                </button>
              </div>
              <DownloadOptions qrCodeImageUrl={product._fullExp.qr_code_url} productName={product.name} />
            </PopoverContent>
          </Popover>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1 truncate">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.category}</p>
      {/* <div className="flex items-center text-xs text-gray-500 mb-3">
        Experience: <span className="font-medium text-gray-700 ml-1 line-clamp-1">{product.experience}</span>
      </div> */}
      <div className="flex items-center justify-between text-xs mb-4">
        <span className={`px-2 py-1 rounded-full ${qrCodeStatusColor} font-medium`}>
          QR Code Status: {product.qrCodeStatus}
        </span>
      </div>
      <p className="text-xs text-left text-gray-400 mb-4">Added: {product.addedDate}</p>
      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <button className="flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium" onClick={handleEdit}>
          <Pencil size={16} className="mr-1 cursor-pointer" /> Edit
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-lg rounded-md border border-gray-200 w-48">
            {product.qrCodeStatus === 'Generated' && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Eye size={16} className="mr-2 cursor-pointer" /> Preview Experience
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-64 bg-white flex flex-col gap-2 z-50">
                  <div className="font-semibold text-gray-900 mb-2 px-2">Preview Experience</div>
                  <DropdownMenuItem
                    onClick={() => handlePreviewOption('dashboard')}
                    className="w-full px-4 py-2 cursor-pointer rounded-lg bg-purple-700 text-white font-medium hover:bg-purple-800 transition"
                  >
                    Preview in Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlePreviewOption('browser')}
                    className="w-full px-4 py-2 cursor-pointer rounded-lg bg-gray-200 text-purple-800 font-medium hover:bg-gray-300 transition"
                  >
                    Preview in Browser
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuItem onClick={handleDelete} variant="destructive" disabled={isDeleting}>
              <Trash2 size={16} className="mr-2 cursor-pointer" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </DropdownMenuItem>
            {product.qrCodeStatus === 'Generated' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewQr}>
                  <QrCode size={16} className="mr-2 cursor-pointer" /> View QR Code
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProductCard;

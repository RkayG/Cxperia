import { CheckCircle2, ImageIcon, Package, Sparkles, Star, Tag } from 'lucide-react';
import React from 'react';

// Mock types for demonstration
interface ExperienceSummaryProps {
  productName: string;
  tagline: string;
  productCategory: string;
  enabledFeatures: string[];
  productImage?: string;
}

// Sample data for demonstration
const sampleData: ExperienceSummaryProps = {
  productName: "CloudSync Pro",
  tagline: "Seamlessly sync your data across all devices with enterprise-grade security",
  productCategory: "Cloud Storage & Sync",
  enabledFeatures: [
    "Real-time synchronization",
    "End-to-end encryption",
    "Multi-device access",
    "Version history",
    "Team collaboration",
    "Advanced sharing controls"
  ],
  productImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop"
};

const ExperienceSummary: React.FC<ExperienceSummaryProps> = ({
  productName = sampleData.productName,
  tagline = sampleData.tagline,
  productCategory = sampleData.productCategory,
  enabledFeatures = sampleData.enabledFeatures,
  productImage = sampleData.productImage,
}) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 sm:px-8 py-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Star size={18} className="text-white" />
          </div>
          <h3 className="text-xl font-bold">Experience Summary</h3>
        </div>
        <p className="text-blue-100 text-sm">Complete overview of your product experience</p>
      </div>

      <div className="p-6 sm:p-8">
        {/* Hero Section with Product Image and Main Info */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-md group hover:shadow-lg transition-shadow duration-200">
              {productImage ? (
                <img
                  src={productImage}
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/128x128/E5E7EB/6B7280?text=${encodeURIComponent(productName.charAt(0))}`;
                  }}
                />
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon size={32} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">{productName}</h4>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {productCategory}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
              <div className="flex items-start gap-2">
                <Tag size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tagline</p>
                  <p className="text-gray-800 leading-relaxed italic">{tagline}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <h5 className="text-lg font-bold text-gray-900">Enabled Features</h5>
            <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
              {enabledFeatures.length} Active
            </div>
          </div>

          {enabledFeatures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enabledFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-sm transition-shadow duration-200"
                >
                  <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No features enabled</p>
              <p className="text-gray-400 text-sm mt-1">Add features to enhance your experience</p>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{enabledFeatures.length}</div>
            <div className="text-xs font-medium text-blue-800 uppercase tracking-wide">Features</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{productCategory.split(' ').length}</div>
            <div className="text-xs font-medium text-purple-800 uppercase tracking-wide">Category</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-xs font-medium text-green-800 uppercase tracking-wide">Active</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">★★★★★</div>
            <div className="text-xs font-medium text-orange-800 uppercase tracking-wide">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceSummary;
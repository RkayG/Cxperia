// src/components/ProductDisplay.tsx

import React from 'react';

interface ProductDisplayProps {
  color: string;
  product: any;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ color, product }) => {
  const productName = product?.name || 'Product';
  const productImage = Array.isArray(product?.product_image_url) ? product.product_image_url[0] : product?.product_image_url || '/demo4.png';
  const netContent = product?.net_content || '';
  return (
    <div className="bg-gray-50 p-4 -mt-6 rounded-xl shadow-sm text-center">
      {/* Product Image */}
      <div className="w-full max-w-[180px] h-[180px] mx-auto mb-4 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-contain"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/150x180/8B4513/FFFFFF?text=Image+Load+Error"; }}
        />
      </div>

      {/* Product Details */}
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-xl font-bold text-left" style={{ color }}>{productName}</h2>
        <span className="text-sm text-gray-500">{netContent}</span>
      </div>
    </div>
  );
};

export default ProductDisplay;

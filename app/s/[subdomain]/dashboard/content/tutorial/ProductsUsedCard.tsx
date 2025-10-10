import React from "react";

interface Product {
    imageUrl?: string;
    name: string;
    brand: string;
    shade?: string;
    amount?: string;
}

interface ProductUsedCardProps {
    product: Product;
}
const ProductUsedCard: React.FC<ProductUsedCardProps> = ({ product }) => (

  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    {product.imageUrl && (
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
    )}
    <div className="font-medium text-gray-900">{product.name}</div>
    <div className="text-gray-700 text-sm">{product.brand}</div>
    <div className="flex gap-4 text-xs text-gray-600 mt-1">
      {product.shade && <span>Shade: {product.shade}</span>}
      {product.amount && <span>Amount: {product.amount}</span>}
    </div>
  </div>
);

export default ProductUsedCard;

// Usage example:
// <ProductUsedCard product={{ imageUrl: 'url', name: 'Product Name', brand: 'Brand', shade: 'Light', amount: '30ml' }} />
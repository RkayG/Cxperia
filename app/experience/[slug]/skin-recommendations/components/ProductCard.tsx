// src/components/ProductCard.tsx
import React from 'react';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  tag?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, title, description, tag }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200">
      <div className="relative w-full h-32 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/200x150/f0f0f0/333?text=Image+Load+Error"; }}
        />
        {tag && (
          <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            {tag}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{description}</p>
        <button className="w-full py-2 text-purple-700 text-xs font-semibold rounded-full border border-purple-300 hover:bg-purple-50 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

import React from 'react';
import { Mountain, Star } from 'lucide-react';

const RecommendedProductHero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-400 to-purple-800 p-6 rounded-b-xl shadow-inner">
      {/* Header with Logo */}
      <div className="flex items-center space-x-2 text-white/90 mb-6">
        <Mountain size={20} strokeWidth={2} />
        <span className="text-lg font-bold">LOGO</span>
      </div>

      {/* Product Information and Image Container */}
      <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-8 relative">
        {/* Product Details */}
        <div className="text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-2">OIL TONER</h1>
          {/* Rating Stars */}
          <div className="flex space-x-1 text-yellow-400 mb-4">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
            <Star size={18} className="text-gray-400" />
          </div>
          <p className="text-sm leading-relaxed text-white/80 max-w-xs">
            True beauty is not just about the external appearance, but also the inner nourishment.
          </p>
        </div>
        
        {/* Product Image */}
        <div className="w-40 h-48 md:w-56 md:h-64 absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:block">
          <img
            src="[https://placehold.co/200x250/333/fff/png?text=Product+Image](https://placehold.co/200x250/333/fff/png?text=Product+Image)"
            alt="Product bottle"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      {/* "Shop Now" Button */}
      <div className="flex justify-center mt-12 md:mt-24">
        <button className="py-3 px-8 bg-pink-200 text-purple-900 font-semibold rounded-full shadow-lg hover:bg-pink-300 transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default RecommendedProductHero;
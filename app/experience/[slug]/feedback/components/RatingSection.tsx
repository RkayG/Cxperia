import React, { useState } from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

interface RatingSectionProps {
  onRatingSelected?: () => void;
}

const RatingSection: React.FC<RatingSectionProps> = ({ onRatingSelected }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { color, product } = usePublicExpStore();
  // Rating data with emojis and descriptive text
  const ratings = [
    { emoji: '😠', label: 'Poor', color: 'from-red-500 to-red-600' },
    { emoji: '😞', label: 'Fair', color: 'from-orange-500 to-orange-600' },
    { emoji: '😐', label: 'Good', color: 'from-yellow-500 to-yellow-600' },
    { emoji: '😊', label: 'Great', color: 'from-blue-500 to-blue-600' },
    { emoji: '😍', label: 'Excellent', color: 'from-purple-500 to-pink-500' }
  ];

  const currentRating = hoveredRating || selectedRating;

  return (
    <div className="relative p-2 rounded-2xl overflow-hidden">
      {/* Animated background */}
     
      
      {/* Glass morphism overlay */}
      <div className="relative rounded-xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color }}>
            Rate Your Experience With {product?.name || 'Our Product'}
          </h2>
          <div className="w-16 h-px mx-auto" style={{ backgroundColor: color }}></div>
          <p className="text-sm mt-3 font-light text-black">
            Help us improve by sharing your feedback
          </p>
        </div>

        {/* Rating Display (always reserve space, animate label change) */}
        <div className="text-center mb-6 min-h-[40px] flex items-center justify-center">
          <div
            className={`inline-block px-4 py-2 rounded-full min-w-[80px] bg-gradient-to-r ${currentRating ? ratings[currentRating - 1].color : 'from-slate-200 to-slate-300'} text-white text-sm font-medium shadow-lg transform transition-all duration-300`}
            style={{ opacity: currentRating ? 1 : 0.5, transition: 'background 0.3s, opacity 0.3s' }}
          >
            <span className="transition-opacity duration-200" style={{ opacity: currentRating ? 1 : 0 }}>
              {currentRating ? ratings[currentRating - 1].label : '\u00A0'}
            </span>
          </div>
        </div>

        {/* Rating Buttons */}
        <div className="flex justify-center items-center space-x-1 mb-6">
          {ratings.map((rating, index) => {
            const ratingNumber = index + 1;
            const isSelected = selectedRating === ratingNumber;
            const isHovered = hoveredRating === ratingNumber;
            const isActive = isSelected || isHovered;

            return (
              <button
                key={index}
                className={`relative group p-2 rounded-2xl transition-all duration-300 transform
                  ${isActive 
                    ? 'scale-110 shadow-xl' 
                    : 'hover:scale-105 hover:shadow-lg'
                  }`}
                onClick={() => {
                  setSelectedRating(ratingNumber);
                  if (onRatingSelected) onRatingSelected();
                }}
                onMouseEnter={() => setHoveredRating(ratingNumber)}
                onMouseLeave={() => setHoveredRating(null)}
                style={{ minWidth: 0 }}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${rating.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                {/* Selection ring */}
                {isSelected && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${rating.color} p-px`}>
                    <div className="w-full h-full rounded-2xl bg-slate-900"></div>
                  </div>
                )}
                {/* Emoji */}
                <span className={`relative text-3xl block transition-all duration-300 ${isActive ? 'filter drop-shadow-lg' : ''}`}>
                  {rating.emoji}
                </span>
                {/* Hover effect particles */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping animation-delay-600"></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-ping animation-delay-900"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Rating Scale */}
        <div className="flex justify-between text-xs text-slate-800 px-4">
          <span>Poor</span>
          <span>Excellent</span>
        </div>


      </div>

      {/* Custom CSS for animations */}
      <style>{`
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-900 {
          animation-delay: 900ms;
        }
      `}</style>
    </div>
  );
};

export default RatingSection;
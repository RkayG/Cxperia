// src/components/RatingSection.tsx
//import React, { useState } from 'react';
//
//const RatingSection: React.FC = () => {
//  const [selectedRating, setSelectedRating] = useState<number | null>(null);
//
//  // Emojis for rating, can be replaced with LucideReact icons if preferred for consistency
//  const emojis = ['😠', '😞', '😐', '😊', '😍'];
//
//  return (
//    <div className="space-y-4">
//      <h2 className="text-xl font-semibold text-[#7c3f6d]">How would you rate our product?</h2>
//      <div className="flex justify-around items-center bg-gray-50 p-3 rounded-xl shadow-sm">
//        {emojis.map((emoji, index) => (
//          <button
//            key={index}
//            className={`text-4xl p-2 rounded-full transition-all duration-200
//              ${selectedRating === index + 1 ? 'scale-125 ring-2 ring-purple-500' : 'hover:scale-110'}`}
//            onClick={() => setSelectedRating(index + 1)}
//          >
//            {emoji}
//          </button>
//        ))}
//      </div>
//    </div>
//  );
//};
//
//export default RatingSection;
//
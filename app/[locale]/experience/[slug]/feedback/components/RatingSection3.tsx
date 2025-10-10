//import React, { useState } from 'react';
//
//const RatingSection: React.FC = () => {
//  const [selectedRating, setSelectedRating] = useState<number | null>(null);
//  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
//
//  // Rating data with emojis and descriptive text - softer colors for white theme
//  const ratings = [
//    { emoji: '😠', label: 'Poor', color: 'from-red-100 to-red-200', textColor: 'text-red-600' },
//    { emoji: '😞', label: 'Fair', color: 'from-orange-100 to-orange-200', textColor: 'text-orange-600' },
//    { emoji: '😐', label: 'Good', color: 'from-yellow-100 to-yellow-200', textColor: 'text-yellow-700' },
//    { emoji: '😊', label: 'Great', color: 'from-blue-100 to-blue-200', textColor: 'text-blue-600' },
//    { emoji: '😍', label: 'Excellent', color: 'from-rose-100 to-pink-200', textColor: 'text-rose-600' }
//  ];
//
//  const currentRating = hoveredRating || selectedRating;
//
//  return (
//    <div className="relative p-8 rounded-2xl overflow-hidden">
//      {/* Clean minimalist background */}
//      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50">
//        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,0,0,0.02),transparent)]"></div>
//        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
//      </div>
//      
//      {/* Clean content overlay */}
//      <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-6 shadow-sm">
//        
//        {/* Header */}
//        <div className="mb-8 text-center">
//          <h2 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
//            Rate Your Experience
//          </h2>
//          <div className="w-12 h-px bg-gradient-to-r from-gray-300 to-transparent mx-auto"></div>
//          <p className="text-gray-500 text-sm mt-3 font-light">
//            Your feedback helps us create better products
//          </p>
//        </div>
//
//        {/* Rating Display */}
//        {currentRating && (
//          <div className="text-center mb-6">
//            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${ratings[currentRating - 1].color} ${ratings[currentRating - 1].textColor} text-sm font-medium shadow-sm transform transition-all duration-300 border border-gray-100`}>
//              {ratings[currentRating - 1].label}
//            </div>
//          </div>
//        )}
//
//        {/* Rating Buttons */}
//        <div className="flex justify-center items-center space-x-3 mb-6">
//          {ratings.map((rating, index) => {
//            const ratingNumber = index + 1;
//            const isSelected = selectedRating === ratingNumber;
//            const isHovered = hoveredRating === ratingNumber;
//            const isActive = isSelected || isHovered;
//
//            return (
//              <button
//                key={index}
//                className={`relative group p-4 rounded-xl transition-all duration-300 transform border
//                  ${isActive 
//                    ? 'scale-110 shadow-lg border-gray-200 bg-white' 
//                    : 'hover:scale-105 hover:shadow-md border-gray-100 bg-gray-50/50 hover:bg-white'
//                  }`}
//                onClick={() => setSelectedRating(ratingNumber)}
//                onMouseEnter={() => setHoveredRating(ratingNumber)}
//                onMouseLeave={() => setHoveredRating(null)}
//              >
//                {/* Subtle background glow */}
//                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${rating.color} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
//                
//                {/* Selection indicator */}
//                {isSelected && (
//                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full border-2 border-white shadow-sm"></div>
//                )}
//                
//                {/* Emoji */}
//                <span className={`relative text-3xl block transition-all duration-300 ${isActive ? 'filter drop-shadow-sm' : ''}`}>
//                  {rating.emoji}
//                </span>
//                
//                {/* Minimal hover indicator */}
//                {isHovered && !isSelected && (
//                  <div className="absolute inset-0 rounded-xl border-2 border-gray-200 pointer-events-none"></div>
//                )}
//              </button>
//            );
//          })}
//        </div>
//
//        {/* Rating Scale */}
//        <div className="flex justify-between text-xs text-gray-400 px-4 font-light">
//          <span>Poor</span>
//          <span>Excellent</span>
//        </div>
//
//        {/* Confirmation Message */}
//       {/*  {selectedRating && (
//          <div className="mt-6 text-center">
//            <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 shadow-sm">
//              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//              <span className="text-gray-600 text-sm font-light">Thank you for your feedback</span>
//            </div>
//          </div>
//        )} */}
//
//      </div>
//
//      {/* Custom CSS for subtle animations */}
//      {/* <style jsx>{`
//        @keyframes fadeIn {
//          from {
//            opacity: 0;
//            transform: translateY(10px);
//          }
//          to {
//            opacity: 1;
//            transform: translateY(0);
//          }
//        }
//        
//        .animate-fade-in {
//          animation: fadeIn 0.3s ease-out;
//        }
//      `}</style> */}
//    </div>
//  );
//};
//
//export default RatingSection;
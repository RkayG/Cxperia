// src/components/MorningGlowCard.tsx
import { Play } from 'lucide-react';
import React from 'react';

const MorningGlowCard: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg h-56 w-full flex items-end p-4 text-white">
      {/* Background Image - Replace with your actual image path */}
      <img
        src="/demo8.png"
        alt="Morning Glow Routine"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.currentTarget.src = "https://placehold.co/600x224/8A2BE2/FFFFFF?text=Image+Load+Error"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Morning Glow Routine</h2>
        <p className="text-sm mb-4">
          Illuminate your day with a simple yet powerful routine for radiant skin.
        </p>
        <button className="flex items-center space-x-2 px-5 py-2 bg-white text-purple-700 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <Play size={18} fill="currentColor" />
          <span>Start Now</span>
        </button>
      </div>
    </div>
  );
};

export default MorningGlowCard;

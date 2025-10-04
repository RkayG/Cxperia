import React from 'react';
interface FeatureCardProps {
  iconSrc: string;
  label: string;
  isHighlighted?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ iconSrc, label, isHighlighted = false }) => {
  return (
    <div className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
      isHighlighted 
        ? 'bg-white text-gray-900 shadow-2xl hover:shadow-[0_8px_32px_0_rgba(60,0,120,0.18)] hover:scale-103' 
        : 'bg-white/80 backdrop-blur-xs text-gray-700 shadow-lg hover:shadow-2xl hover:bg-white hover:scale-101'
    }`}>
      {/* Background decoration */}
  <div className={`absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-white`}></div>
      {/* Floating accent dot */}
      <div className={`absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-300 ${
        isHighlighted 
          ? 'bg-white/20 group-hover:bg-white/30' 
          : 'bg-purple-100 group-hover:bg-purple-300'
      }`}></div>
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon container */}
        <div className={`relative mb-4 p-2 rounded-2xl transition-all duration-300 bg-white shadow group-hover:shadow-md group-hover:scale-105`}>
          {/* Icon subtle effect */}
          <div className="absolute inset-0 rounded-2xl blur-[2px] opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-white"></div>
          <img
            src={iconSrc}
            alt={label + ' icon'}
            className="relative z-10 w-20 h-20 object-contain mx-auto"
            draggable={false}
          />
        </div>
        {/* Label */}
        <span className={`text-sm font-semibold leading-tight transition-all duration-300 text-gray-800 group-hover:text-gray-900`}>
          {label}
        </span>
        {/* Subtle arrow indicator */}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
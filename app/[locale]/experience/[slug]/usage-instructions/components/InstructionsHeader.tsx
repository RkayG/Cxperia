import React from 'react';


interface InstructionsHeaderProps {
  color: string;
}

const InstructionsHeader: React.FC<InstructionsHeaderProps> = ({ color }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-b-3xl relative" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-white text-2xl font-bold leading-tight">Digital Instructions & Ingredients</h1>
        {/* Logo Placeholder */}
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-gray-500 font-bold text-sm shadow-inner">
          LOGO
        </div>
      </div>
      <p className="text-white text-sm opacity-90 max-w-[85%]">
        Get expert advice and insider tips for radiant skin.
      </p>
    </div>
  );
};

export default InstructionsHeader;
import React from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  logoText?: string;
  color?: string;
}

const SectionHeaderLight: React.FC<SectionHeaderProps> = ({ title, subtitle, color }) => {
 const { color: storeColor, brandName } = usePublicExpStore();
 const finalColor = color || storeColor;
  return (
    <div className="relative overflow-hidden">
      {/* Simple white background */}
      <div className="bg-white">
        <div className="p-8">
          <div className="flex items-start justify-between">
            {/* Title Section */}
            <div className="flex-1">
              <h1
                className="text-4xl uppercase font-black text-left tracking-tight leading-tight"
                style={{ color: finalColor }}
              >
                <span
                  className=" text-sm block mb-1"
                  style={{ color: finalColor }}
                >
                 // {brandName}
                </span>
                {title}
              </h1>
              {subtitle && (
                <div className="mt-4 max-w-md">
                  <p className="text-gray-600 text-left text-sm font-light leading-relaxed tracking-wide">
                    {subtitle}
                  </p>
                  <div className="mt-2 h-px w-16" style={{ backgroundColor: finalColor }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bottom curve */}
        <div className="relative h-9 bg-gray-50 -mb-2 w-full rounded-tl-full">
          {/* Minimalist placeholder */}
        </div>
      </div>
    </div>
  );
};

export default SectionHeaderLight;

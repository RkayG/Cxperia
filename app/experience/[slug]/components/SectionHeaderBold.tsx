import React  from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  logoText?: string;
  color?: string;
}

const SectionHeaderBold: React.FC<SectionHeaderProps> = ({ title, subtitle, color }) => {
  const { color: storeColor, brandName } = usePublicExpStore();
  const finalColor = color || storeColor;
  return (
    <div className="relative overflow-hidden">
      {/* Bold theme: colored background, white text */}
      <div className="absolute inset-0 w-full h-full " style={{ background: finalColor, zIndex: 0 }}></div>
      <div className="relative z-10">
        <div className="p-8">
          <div className="flex items-start justify-between">
            {/* Title Section */}
            <div className="flex-1">
              <h1
                className="text-4xl uppercase font-black text-left tracking-tight leading-tight"
                style={{ color: '#fff' }}
              >
                <span
                  className="font-mono text-sm block mb-1"
                  style={{ color: '#fff', opacity: 0.7 }}
                >
                  // {brandName || ""}
                </span>
                {title}
              </h1>
              {subtitle && (
                <div className="mt-4 max-w-md">
                  <p className="text-white text-left text-sm font-light leading-relaxed tracking-wide opacity-80">
                    {subtitle}
                  </p>
                  <div className="mt-2 h-px w-16 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bottom curve */}
        <div className="relative h-9 bg-gray-50 " style={{  borderTopLeftRadius: '9999px' }}>
          {/* Minimalist placeholder */}
        </div>
      </div>
    </div>
  );
};

export default SectionHeaderBold;

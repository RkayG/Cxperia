"use client";
import React, { useMemo, useState } from "react";
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import { GiEnvelope, GiPhone, GiNotebook, GiPerfumeBottle } from "react-icons/gi";

// Map backend feature_name to frontend label
const featureNameToLabel: Record<string, string> = {
  ingredientList: "Ingredient Breakdown",
  productUsage: "Usage Instructions",
  feedbackForm: "Share Feedback",
  /* skinRecommendations: "Skin Recommendations", */
  tutorialsRoutines: "Tutorials & Routines",
  customerService: "Customer Support",
  // Add more mappings as needed
};

const allFeatures = [
  { icon: GiPerfumeBottle, label: "Ingredient Breakdown", highlighted: true },
  {
    icon: GiNotebook,
    label: "Usage Instructions",
    highlighted: true,
  },
    { icon: GiEnvelope, label: "Share Feedback" },
  { icon: GiNotebook, label: "Tutorials & Routines" },
  { icon: GiPhone, label: "Customer Support" },
];
type ActiveSection = 'home' | 'ingredients' | 'feedback' | 'usage-instructions' | 'support-channels' | 'tutorials';

interface FeatureSliderProps {
  onSectionChange: (section: ActiveSection) => void;
  slug: string;
}


const FeatureSlider: React.FC<FeatureSliderProps> = ({ onSectionChange, slug }) => {
  const {color, experience} = usePublicExpStore();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Get enabled feature labels from backend data
  const enabledLabels = useMemo(() => {
    if (!experience || !experience.data.features_enabled) return [];
    return experience.data.features_enabled
      .map((name: string) => featureNameToLabel[name])
      .filter(Boolean);
  }, [experience]);

  // Only show features that are enabled (by label)
  const features = useMemo(() => {
    return allFeatures.filter((f) => enabledLabels.includes(f.label));
  }, [enabledLabels]);

  // Handle feature click - same as SectionNavigation
  const handleFeatureClick = (label: string) => {
    let section: ActiveSection = 'home';
    
    switch (label) {
      case "Share Feedback":
        section = 'feedback';
        break;
      case "Usage Instructions":
        section = 'usage-instructions';
        break;
      case "Ingredient Breakdown":
        section = 'ingredients';
        break;
      case "Customer Support":
        section = 'support-channels';
        break;
      case "Tutorials & Routines":
        section = 'tutorials';
        break;
      default:
        section = 'home';
    }
    
    // This will hide YouHaveScanned and show the appropriate section
    onSectionChange(section);
  };

  if (features.length === 0) return null;

  return (
    <div className="relative overflow-hidden pb-3 border-5 rounded-t-3xl border-t border-black">
      {/* Cool headline */}
      <div className="text-center mb-6 mt-4 px-2">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          We have prepared something extra special for you ✨
        </h2>
        <p className="text-sm text-gray-600 italic">
          Which would you like to explore first?
        </p>
      </div>

      {/* Compact Features Grid - 4 per row */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              onClick={() => handleFeatureClick(feature.label)}
              className="group relative block cursor-pointer"
              onMouseEnter={() => setHoveredFeature(feature.label)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className="relative rounded-xl p-3 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{
                  backgroundColor: hoveredFeature === feature.label ? 'white' : `${color}`,
                  borderColor: hoveredFeature === feature.label ? '#e5e7eb' : color,
                }}
              >
                {/* Subtle pulse animation */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: color }}
                />
                
                {/* Icon with subtle bounce */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: `white` }}
                  >
                      <feature.icon
                      aria-label={feature.label + ' icon'}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  
                  {/* Label with subtle animation */}
                  <span 
                    className="text-xs font-medium text-center leading-tight transition-colors duration-300"
                    style={{ 
                      color: hoveredFeature === feature.label ? '#374151' : 'white'
                    }}
                  >
                    {feature.label}
                  </span>
                </div>

                {/* Subtle glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ 
                    background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-6">
        <div
          onClick={() => handleFeatureClick('home')}
          className="group relative inline-block px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          style={{
            backgroundColor: color,
            backgroundSize: "200% 200%",
            animation: "shimmer 3s infinite",
          }}
        >
          <span className="relative z-10 font-bold" style={{ color: 'white'}}>
            Start Your Journey →
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeatureSlider;

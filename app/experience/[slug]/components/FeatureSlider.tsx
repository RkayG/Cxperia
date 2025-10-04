"use client";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

// Map backend feature_name to frontend label
const featureNameToLabel: Record<string, string> = {
  ingredientList: "See Ingredients",
  productUsage: "See Instructions",
  feedbackForm: "Share Feedback",
  /* skinRecommendations: "Skin Recommendations", */
  tutorialsRoutines: "Tutorials & Routines",
  customerService: "Customer Support",
  // Add more mappings as needed
};

const allFeatures = [
  { icon: "/icons/ingredients.png", label: "See Ingredients", highlighted: true },
  {
    icon: "/icons/product-usage.png",
    label: "See Instructions",
    highlighted: true,
  },
  { icon: "/icons/beauty-tips.png", label: "Beauty Tips" },
  { icon: "/icons/feedback.png", label: "Share Feedback" },
  {
    icon: "/icons/skin-diagnosis.png",
    label: "See Skin Recommendations",
    highlighted: true,
  },
  { icon: "/icons/tutorial.png", label: "Tutorials & Routines" },
  { icon: "/icons/customer-support.png", label: "Customer Support" },
];


const FeatureSlider: React.FC = () => {
  const router = useRouter();
  const {color, slug, experience} = usePublicExpStore();
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

  // Navigation handlers - using router.push for proper navigation
  const navigateToFeature = (label: string) => {
    if (!slug) return;
    
    switch (label) {
      case "Share Feedback":
        router.push(`/experience/${slug}/feedback`);
        break;
      case "See Instructions":
        router.push(`/experience/${slug}/usage-instructions`);
        break;
      case "See Ingredients":
        router.push(`/experience/${slug}/ingredients`);
        break;
      case "Customer Support":
        router.push(`/experience/${slug}/support-channels`);
        break;
      case "Tutorials & Routines":
        router.push(`/experience/${slug}/tutorials`);
        break;
      case "See Skin Recommendations":
        router.push(`/experience/${slug}/skin-recommendations`);
        break;
      default:
        return;
    }
  };

  if (features.length === 0) return null;

  return (
    <div className="relative overflow-hidden pb-3 border-5 rounded-t-3xl border-t border-black">
      {/* Cool headline */}
      <div className="text-center mb-6 mt-4 px-2">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          We have prepared these specially for you ✨
        </h2>
        <p className="text-sm text-gray-600 italic">
          Which would you like to explore first?
        </p>
      </div>

      {/* Compact Features Grid - 4 per row */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2">
          {features.map((feature, index) => (
            <div
              key={feature.label}
              className="group relative"
              onClick={() => navigateToFeature(feature.label)}
              onMouseEnter={() => setHoveredFeature(feature.label)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className="relative rounded-xl p-3 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-105"
                style={{
                  backgroundColor: hoveredFeature === feature.label ? 'white' : `${color}15`,
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
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <img
                      src={feature.icon}
                      alt={feature.label}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  
                  {/* Label with subtle animation */}
                  <span 
                    className="text-xs font-medium text-center leading-tight transition-colors duration-300"
                    style={{ 
                      color: hoveredFeature === feature.label ? '#374151' : color 
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
        <button
          className="group relative  px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          style={{
            backgroundColor: color,
            backgroundSize: "200% 200%",
            animation: "shimmer 3s infinite",
          }}
          onClick={() => slug && router.push(`/experience/${slug}`)}
        >
          <span className="relative z-10 font-bold" style={{ color: 'white'}}>
            Start Your Journey →
          </span>
          {/* <svg
            className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg> */}
        </button>
      </div>
    </div>
  );
};

export default FeatureSlider;

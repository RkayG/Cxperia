"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

// Map backend feature_name to frontend label
const featureNameToLabel: Record<string, string> = {
  ingredientList: "Ingredients",
  productUsage: "Instructions",
  feedbackForm: "Feedback",
  skinRecommendations: "Skin Recommendations",
  tutorialsRoutines: "Tutorials & Routines",
  customerService: "Customer Support",
  // Add more mappings as needed
};

const allFeatures = [
  { icon: "/icons/ingredients.png", label: "Ingredients", highlighted: true },
  {
    icon: "/icons/product-usage.png",
    label: "Instructions",
    highlighted: true,
  },
  { icon: "/icons/beauty-tips.png", label: "Beauty Tips" },
  { icon: "/icons/feedback.png", label: "Feedback" },
  {
    icon: "/icons/skin-diagnosis.png",
    label: "Skin Recommendations",
    highlighted: true,
  },
  { icon: "/icons/tutorial.png", label: "Tutorials & Routines" },
  { icon: "/icons/digital-instructions.png", label: "Digital Instructions" },
  { icon: "/icons/loyalty-points.png", label: "Loyalty Program" },
  { icon: "/icons/customer-support.png", label: "Customer Support" },
];

// Custom engaging taglines for each feature
const featureTaglines: Record<string, string> = {
  Ingredients: "Know what goes into your glow ✨",
  Instructions: "Master every step of your ritual",
  "Beauty Tips": "Insider tricks for everyday radiance",
  Feedback: "Your voice shapes tomorrow’s beauty",
  "Skin Recommendations": "Care made just for your skin",
  "Tutorials & Routines": "Step-by-step guides to glow smarter",
  "Digital Instructions": "Always-on help, right at your fingertips",
  "Loyalty Program": "Earn rewards as you shine",
  "Customer Support": "We’re here whenever you need us ❤️",
};

const FeatureSlider: React.FC = () => {
  const router = useRouter();
  const {color, slug, experience} = usePublicExpStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ctaTextIndex, setCtaTextIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<number | null>(null);

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

  // Engaging CTA options instead of "Explore"
  const ctaOptions = [
    "Reveal What’s Inside →",
    "Transform Your Routine →",
    "Your Glow Starts Here →",
    "Unlock Expert Secrets →",
    "Personalize My Ritual →",
    "Show Me the Magic →",
  ];

  // Navigation handlers
  const navigateToFeature = (label: string) => {
    let path = '';
    switch (label) {
      case "Feedback":
        path = "feedback";
        break;
      case "Beauty Tips":
        path = "beauty-tips";
        break;
      case "Tutorials & Routines":
        path = "tutorials";
        break;
      case "Instructions":
        path = "instructions";
        break;
      case "Ingredients":
        path = "ingredients";
        break;
      case "Skin Recommendations":
        path = "skin-diagnosis";
        break;
      case "Customer Support":
        path = "customer-support";
        break;
      default:
        return;
    }
    if (slug && path) {
      router.push(`/experience/${slug}/${path}`);
    }
  };

  // Auto-advance the slider
  useEffect(() => {
    if (features.length <= 1 || isPaused) return;

    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
    }

    autoplayRef.current = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [currentIndex, features.length, isPaused]);

  // Manual navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  // Handle touch events for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNext();
    }
    if (touchStart - touchEnd < -50) {
      goToPrev();
    }
  };

  // Rotate through CTA text options
  useEffect(() => {
    const interval = setInterval(() => {
      setCtaTextIndex((prev) => (prev + 1) % ctaOptions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (features.length === 0) return null;

  return (
    <div className="relative overflow-hidden pb-3 border-5 rounded-t-3xl border-t border-black">
      {/* Subtle prompt text */}
      <p className="text-black text-sm mt-4 italic text-center px-4">
         Unlock tailored routines, hidden ingredients, and beauty secrets designed to make you shine.
      </p>

      {/* Animated Call to Action */}
      <div className="text-center mb-6 mt-4">
        <button
          className="group relative bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
          style={{
            minWidth: "220px",
            background: `linear-gradient(45deg, white, #f0f0f0, white)`,
            backgroundSize: "200% 200%",
            animation: "shimmer 3s infinite",
          }}
          onClick={() => slug && router.push(`/experience/${slug}`)}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Text with fade transition */}
          <span className="relative z-10 bg-gradient-to-r from-purple-700 to-orange-500 bg-clip-text text-transparent font-bold">
            {ctaOptions[ctaTextIndex]}
          </span>

          <svg
            className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Slider Container */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={sliderRef}
      >
        {/* Slider Track */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full px-4"
              onClick={() => navigateToFeature(feature.label)}
            >
              <div
                className="rounded-2xl p-6 shadow-md border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: `${color}` }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/30 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `white` }}
                  >
                    <img
                      src={feature.icon}
                      alt={feature.label}
                      className="w-full h-full p-1 rounded-full object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.label}
                  </h3>
                  <p className="text-sm text-white text-center">
                    {featureTaglines[feature.label] ||
                      `Explore ${feature.label}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Dots */}
      {features.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gray-500 w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureSlider;

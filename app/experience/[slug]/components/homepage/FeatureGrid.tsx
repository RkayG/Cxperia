'use client';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import {  GiPerfumeBottle, GiPhone } from 'react-icons/gi';
import { GiNotebook } from 'react-icons/gi';
import { GiEnvelope } from 'react-icons/gi';

// Map backend feature_name to frontend label
const featureNameToLabel: Record<string, string> = {
  ingredientList: 'Ingredients',
  productUsage: 'Instructions',
  feedbackForm: 'Feedback',
  skinRecommendations: 'Skin Recommendations',
  tutorialsRoutines: 'Tutorials & Routines',
  customerService: 'Customer Support',
  // Add more mappings as needed
};

const allFeatures = [
  { id: 'ingredients', icon: GiPerfumeBottle, label: 'Ingredients', description: 'Discover what makes it special', path: 'ingredients', highlighted: true },
  { id: 'instructions', icon: GiNotebook, label: 'Instructions', description: 'How to use the product', path: 'usage-instructions', highlighted: true },
  { id: 'beauty-tips', icon: GiEnvelope, label: 'Beauty Tips', description: 'Tips for best results', path: 'beauty-tips' },
  { id: 'feedback', icon: GiEnvelope, label: 'Feedback', description: 'Share your thoughts', path: 'feedback' },
  /* { id: 'skin-recommendations', icon: GiBeaker, label: 'Skin Recommendations', description: 'Personalized advice', path: 'skin-recommendations', highlighted: true }, */
  { id: 'tutorials', icon: GiNotebook, label: 'Tutorials & Routines', description: 'Watch and learn', path: 'tutorials' },
  { id: 'digital-instructions', icon: GiNotebook, label: 'Digital Instructions', description: 'Step-by-step digital guide', path: 'digital-instructions' },
  { id: 'loyalty', icon: GiNotebook, label: 'Loyalty Program', description: 'Earn rewards', path: 'loyalty' },
  { id: 'customer-support', icon: GiPhone, label: 'Customer Support', description: 'Get help or contact us', path: 'support-channels' },
];


type ActiveSection = 'home' | 'ingredients' | 'feedback' | 'usage-instructions' | 'support-channels' | 'tutorials';

interface FeatureGridProps {
  onSectionChange: (section: ActiveSection) => void;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ onSectionChange }) => {
 const { experience, color } = usePublicExpStore();

 function hexToRgba(hex: string, alpha: number) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
} 

  const navigateToSection = (path: string) => {
    onSectionChange(path as ActiveSection);
  };
  // Get enabled feature labels from backend data
  const enabledLabels = useMemo(() => {
    if (!experience || !experience.data.features_enabled) return [];
    return experience.data.features_enabled.map((name: string) => featureNameToLabel[name]).filter(Boolean);
  }, [experience]);

  // Only show features that are enabled (by label)
  const features = useMemo(() => {
    return allFeatures.filter(f => enabledLabels.includes(f.label));
  }, [enabledLabels]);

  return (
    <div className="relative overflow-y-auto mb-10">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gray-50"></div>
      {/* Main container */}
      <div className="relative  p-6 shadow-lg border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color }}>What are you exploring today?</h2>
          <div className="w-16 h-1 rounded-full mx-auto" style={{ background: `linear-gradient(to right, ${color}, #fff)` }}></div>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id || feature.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigateToSection(feature.path)}
              className={`p-4 rounded-xl text-left transition-all duration-300 border-1  border-white/20 backdrop-blur-sm hover:bg-white/20 focus:outline-none flex items-center gap-4`}
              style={{ backgroundColor: hexToRgba(color, 0.1), borderColor: color }}
            >
              <feature.icon className="w-10 h-10 object-contain flex-shrink-0" />
              <div>
                <div className="text-black font-bold" 
                style={{ color: color }}>{feature.label}</div>
                <div className="text-black text-sm mt-1">{feature.description}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
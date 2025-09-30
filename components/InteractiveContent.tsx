// src/components/InteractiveContent.tsx
'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import Link from 'next/link';

type ContentSection = 'overview' | 'navigation';

interface InteractiveContentProps {
  selectedFeatures: string[];
  onBackToFeatures?: () => void;
}

const InteractiveContent: React.FC<InteractiveContentProps> = ({ 
  selectedFeatures, 
  onBackToFeatures 
}) => {
  const experience = usePublicExpStore((state) => state.experience);
  const product = usePublicExpStore((state) => state.product) || {};
  const brandLogo = usePublicExpStore((state) => state.brandLogo) || "";
  const color = experience?.data?.primary_color || "#1e3a8a";
  const slug = experience?.data?.public_slug;
  
  const [activeSection, setActiveSection] = useState<ContentSection>('overview');
  const [displayedFeatures, setDisplayedFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Show features one by one with delay
    selectedFeatures.forEach((feature, index) => {
      setTimeout(() => {
        setDisplayedFeatures(prev => [...prev, feature]);
      }, index * 200);
    });
  }, [selectedFeatures]);

  const featureConfigs = {
    ingredients: {
      icon: '🔬',
      title: 'Ingredients & Formula',
      description: 'Discover what makes this product special',
      href: `/experience/${slug}/ingredients`,
      color: '#10b981'
    },
    usage: {
      icon: '📖',
      title: 'Usage Instructions',
      description: 'How to get the best results',
      href: `/experience/${slug}/usage`,
      color: '#3b82f6'
    },
    tutorials: {
      icon: '🎬',
      title: 'Video Tutorials',
      description: 'Watch it in action',
      href: `/experience/${slug}/tutorials`,
      color: '#8b5cf6'
    },
    benefits: {
      icon: '✨',
      title: 'Key Benefits',
      description: 'What it does for you',
      href: `/experience/${slug}/benefits`,
      color: '#f59e0b'
    },
    reviews: {
      icon: '⭐',
      title: 'Customer Stories',
      description: 'Hear from others',
      href: `/experience/${slug}/reviews`,
      color: '#ec4899'
    },
    routine: {
      icon: '🔄',
      title: 'Daily Routine',
      description: 'Fit it into your life',
      href: `/experience/${slug}/routine`,
      color: '#06b6d4'
    }
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4"
        style={{ backgroundColor: color + '20' }}
      >
        🎉
      </motion.div>
      
      <h2 className="text-3xl font-bold text-gray-800">
        Perfect! Let's Explore
      </h2>
      
      <p className="text-gray-600 text-lg">
        We've prepared {selectedFeatures.length} amazing feature{selectedFeatures.length > 1 ? 's' : ''} for you:
      </p>

      <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
        {displayedFeatures.map((featureId, index) => {
          const feature = featureConfigs[featureId as keyof typeof featureConfigs];
          if (!feature) return null;
          
          return (
            <motion.div
              key={featureId}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-4 p-3 bg-white rounded-xl border-2 shadow-sm"
              style={{ borderColor: feature.color + '40' }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: feature.color + '20' }}
              >
                {feature.icon}
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: selectedFeatures.length * 0.2 + 0.5 }}
        onClick={() => setActiveSection('navigation')}
        className="w-full max-w-sm mx-auto py-4 rounded-2xl font-semibold text-lg border-2 transition-all duration-300 hover:scale-105"
        style={{ 
          backgroundColor: color,
          borderColor: color,
          color: 'white'
        }}
      >
        Start Exploring →
      </motion.button>
    </motion.div>
  );

  const renderNavigation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Choose Your Journey
        </h2>
        <p className="text-gray-600">
          Where would you like to start?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {selectedFeatures.map((featureId, index) => {
          const feature = featureConfigs[featureId as keyof typeof featureConfigs];
          if (!feature) return null;
          
          return (
            <motion.div
              key={featureId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-6 rounded-2xl border-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                  style={{ 
                    borderColor: feature.color + '40',
                    backgroundColor: 'white'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: feature.color + '20' }}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                    <div className="text-2xl opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setActiveSection('overview')}
          className="flex-1 py-3 rounded-xl font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-300"
        >
          ← Back
        </button>
        {onBackToFeatures && (
          <button
            onClick={onBackToFeatures}
            className="flex-1 py-3 rounded-xl font-medium border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-300"
          >
            Choose Different Features
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {brandLogo && (
            <img
              src={brandLogo}
              alt="Brand Logo"
              className="w-16 h-16 rounded-full mx-auto mb-4 object-contain border-2"
              style={{ borderColor: color + '40' }}
            />
          )}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {product?.name}
          </h1>
          <p className="text-gray-600">
            {product?.tagline}
          </p>
        </motion.div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && renderOverview()}
            {activeSection === 'navigation' && renderNavigation()}
          </AnimatePresence>
        </div>

        {/* Progress */}
        <motion.div 
          className="flex justify-center space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {['overview', 'navigation'].map((section, index) => (
            <div
              key={section}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === section 
                  ? 'bg-gray-800' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InteractiveContent;
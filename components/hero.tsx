'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import NavMenu from './nav-menu';
import TiltedCard from './TiltedCard';
import GradientText from '../components/GradientText';

const HeroSection = () => {
  return (
    <div className="bg-[#e9c0e9] p-8 mt-16 md:mt-auto md:p-16 lg:p-24 pb-0">
      {/* NavMenu - Animated Navigation */}
      <NavMenu />

      {/* Hero Content */}
      <div className="flex flex-col mt-16 lg:flex-row items-center justify-center max-w-7xl mx-auto gap-8">
        {/* Left Content */}
        <div className="text-center lg:text-left lg:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#502274] bricolage-grotesque font-black mb-6 leading-tight">
            Beyond the packaging. Into the{' '}
            <GradientText
              colors={['#ff4f8b', '#ff4f8b', '#4079ff', '#502274', '#ff4f8b', '#ff4f8b']}
              animationSpeed={3}
              showBorder={false}
              className="font-black text-5xl sm:text-6xl md:text-7xl inline-block align-middle"
            >
              experience
            </GradientText>
            .
          </h1>
          <p className="text-base sm:text-lg bricolage-grotesque-light text-black mb-8 max-w-md mx-auto lg:mx-0">
            Delight your customers beyond purchase. Offer personalized routines,
            helpful insights, and exclusive experiences with smart, QR-powered
            packaging.
          </p>
          <Button variant="default" className="bg-[#191970] text-white px-8 py-6 font-semibold">
            Get A Demo
          </Button>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0">
          <TiltedCard
            imageSrc="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
            altText="Cosmetic Product Jar"
            containerHeight="400px"
            containerWidth="400px"
            imageHeight="400px"
            imageWidth="400px"
            rotateAmplitude={14}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <p className="tilted-card-demo-text font-bold text-lg text-white bg-[#502274] px-4 py-2 rounded-lg">
                Experience the future of beauty
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
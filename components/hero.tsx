'use client';
import React from 'react';
import Image from 'next/image';
import hero from '../assets/images/hero-image.png';
import GradientText from '../components/GradientText';
import { Button } from '@/components/ui/button';
import NavMenu from './nav-menu';

const HeroSection = () => {
  return (
    <div className="bg-[#e9c0e9] p-4 sm:p-8 lg:px-16">
      {/* NavMenu - Animated Navigation */}
      <NavMenu />

      {/* Hero Content */}
      <div className="flex flex-col mt-16 lg:flex-row items-center justify-center pb-12 max-w-7xl mx-auto gap-8">
        {/* Left Content */}
        <div className="text-center lg:text-left lg:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#502274] bricolage-grotesque font-black mb-6 leading-tight">
            Beyond the packaging. Into the{' '}
            <GradientText
              colors={['#ff4f8b', '#ff4f8b', '#4079ff',  '#502274', '#ff4f8b', '#ff4f8b']}
              animationSpeed={3}
              showBorder={false}
               className="font-black text-5xl sm:text-6xl md:text-7xl inline-block align-middle"
            >
              experience
            </GradientText>
            .
          </h1>
          <p className="text-base sm:text-lg text-black mb-8 max-w-md mx-auto lg:mx-0">
            Delight your customers beyond purchase. Offer personalized routines,
            helpful insights, and exclusive experiences with smart, QR-powered
            packaging.
          </p>
          <Button variant="default" className="bg-[#4d2d7c] text-white px-8 py-4 rounded-full font-semibold">
            Get A Demo
          </Button>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 relative flex justify-center items-center mt-12 lg:mt-0">
          <div className="relative w-full max-w-xl h-[500px] lg:h-[600px] flex items-center justify-center">
            <Image
              src={hero}
              alt="Product Jar"
              fill
              style={{ objectFit: 'contain' }}
              className="animate-float"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
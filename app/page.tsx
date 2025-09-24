import React from 'react';
import Image from 'next/image';
import hero from '../assets/images/hero-image.png';

const HeroSection = () => {
  return (
    <div className="bg-[#e9c0e9] p-4 sm:p-8"> {/* Adjust padding for smaller screens */}
      {/* Navbar - Simplified */}
      <nav className="flex items-center justify-between max-w-7xl mx-auto py-4">
        <div className="flex items-center space-x-4">
          <a href="#" className="font-bold text-lg text-black">
            qp.
          </a>
          <a href="#" className="text-sm text-black hidden sm:inline">
            Story
          </a>
          <a href="#" className="text-sm text-black hidden sm:inline">
            Shop
          </a>
          <a href="#" className="text-sm text-black hidden sm:inline">
            Blog
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-black">
            Login
          </a>
          <button className="bg-black text-white px-4 py-2 rounded-full text-sm">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Content */}
  <div className="flex flex-col lg:flex-row items-center justify-center pb-12 max-w-7xl mx-auto gap-8">
        {/* Left Content */}
  <div className="text-center lg:text-left lg:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-[#502274] bricolage-grotesque font-black mb-6 leading-tight">
            Beyond the packaging. Into the <span className="text-[#ff4f8b] drop-shadow font-black">experience</span>.
          </h1>
          <p className="text-base  sm:text-lg text-black mb-8 max-w-md mx-auto lg:mx-0">
            Delight your customers beyond purchase. Offer personalized routines,
            helpful insights, and exclusive experiences with smart, QR-powered
            packaging.
          </p>
          <button className="bg-[#4d2d7c] text-white px-8 py-4 rounded-full font-semibold">
            Get A Demo
          </button>
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
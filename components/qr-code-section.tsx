'use client';
import TiltedCard from './TiltedCard';
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui button
import productBox from '../assets/images/package-with-qr.png'; 
// Placeholder image
const QRCodeSection = () => {
  return (
    <div className="bg-[#e9c0e9] p-8 md:p-16 lg:p-24">
      <div className="flex flex-col px-4 lg:flex-row max-w-7xl mx-auto items-center justify-between">
        {/* Left Column for Content */}
        <div className="lg:w-1/2 w-full text-center lg:text-left mb-12 lg:mb-0">
          <h2 className="text-4xl max-w-lg md:text-5xl bricolage-grotesque font-bold text-[#4d2d7c] mb-4 leading-tight">
            Get a unique QR-Code and 
            place on your product 
            packaging
          </h2>
          <p className="text-base md:text-lg bricolage-grotesque-light text-black mb-8 max-w-md mx-auto lg:mx-0">
            Your QR-Code is your customers' portal to the experience you have 
            prepared for them. 
          </p>
          <Button
            variant="default"
            className="bg-[#191970] w-full text-white px-8 py-6 font-semibold hover:bg-opacity-90 transition-colors"
          >
            Get A Demo
          </Button>
        </div>

        {/* Right Column for TiltedCard Image */}
        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
          <TiltedCard
            imageSrc={productBox.src}
            altText="Product box with QR code"
            captionText="Scan to unlock your experience"
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
              <p className="tilted-card-demo-text font-bold text-lg text-white bg-[#191970] px-4 py-2 rounded-lg">
                Try scanning your product!
              </p>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;
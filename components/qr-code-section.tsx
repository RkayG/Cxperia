import React from 'react';
import Image from 'next/image';
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
            className="bg-[#4d2d7c] w-full text-white px-8 py-6 font-semibold hover:bg-opacity-90 transition-colors"
          >
            Get started for free
          </Button>
        </div>

        {/* Right Column for Image */}
        <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
          {/* Placeholder for your product box image */}
          {/* You would use next/image here with your actual image source */}
          <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center rounded-lg">
            {/* Replace this with your actual Next.js Image component */}
            
            <Image
              src={productBox}
              alt="Product box with QR code"
              width={400} // Adjust based on your image
              height={400} // Adjust based on your image
              className="object-contain"
            />
            
    
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeSection;
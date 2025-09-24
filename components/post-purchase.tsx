'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import CardSwap, { Card } from './CardSwap';
import Image from 'next/image';
import img1 from '../assets/images/hero-image.png';
import img2 from '../assets/images/package-with-qr.png';
import img3 from '../assets/logo.png';
import InfiniteScroll from './InfiniteScroll.tsx'

const PostPurchaseSection = () => {
  return (
    <div className="bg-gradient-to-b from-[#e9c0e9] to-[#ffffff] p-8 md:p-16 lg:p-24">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto items-center">
        {/* Left Column for InfiniteScroll Text Animation */}
        <div className="lg:w-1/2 w-full mb-12 lg:mb-0 lg:pr-12 flex items-center justify-center">
          <div style={{ height: '500px', position: 'relative', width: '100%' }}>
            {/* InfiniteScroll with mixed text and paragraph items, tilted left */}
            <InfiniteScroll
              items={[
                { content: "Create tutorials for your product" },
                { content: <p>Usage instructions and routines</p> },
                { content: "Ingredients and product details" },
                { content: <p>Support channels and contact info</p> },
                { content: "Personalized product suggestions" },
                { content: <p>Exclusive offers and loyalty rewards</p> },
                { content: "Customer community and feedback" },
                { content: <p>How-to videos and guides</p> },
                { content: "Product care tips" },
                { content: <p>FAQs and troubleshooting</p> },
                { content: "Ingredient sourcing stories" },
                { content: <p>Direct support chat</p> },
                { content: "Warranty and returns info" },
                { content: <p>Share your experience</p> }
              ]}
              isTilted={true}
              tiltDirection="left"
              autoplay={true}
              autoplaySpeed={0.1}
              autoplayDirection="down"
              pauseOnHover={true}
            />
          </div>
        </div>

        {/* Right Column for Content */}
        <div className="lg:w-1/2 w-full text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl bricolage-grotesque font-extrabold text-[#4d2d7c] mb-4 leading-tight">
            Create your product <br className="hidden md:inline" />
            post-purchase experience
          </h2>
          <p className="text-base md:text-lg text-[#4d2d7c] mb-8 max-w-md mx-auto lg:mx-0">
            Design the digital journey your customer will have after
            purchase. Add tutorials, routines, product suggestions, and
            more.
          </p>
          <Button 
            variant="default" 
            className="bg-[#4d2d7c] text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-colors"
          >
            Get started for free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostPurchaseSection;
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import InfiniteScroll from './InfiniteScroll'

const PostPurchaseSection = () => {
  return (
    <div className="bg-[#e9c0e9] p-8 md:p-16 lg:p-24">
      <div className="flex flex-col text-white border-5 bg-[#502274] border-[#580F41] lg:flex-row max-w-7xl mx-auto items-center">
        {/* Left Column for InfiniteScroll Text Animation */}
        <div className="lg:w-1/2  w-full mb-12 lg:mb-0 lg:pr-12 flex items-center justify-center">
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
              autoplaySpeed={1}
              autoplayDirection="down"
              pauseOnHover={true}
            />
          </div>
        </div>

        {/* Right Column for Content */}
        <div className="lg:w-1/2 w-full text-white text-center lg:text-left">
          <h2 className="text-4xl max-w-lg md:text-5xl bricolage-grotesque font-extrabold text-whitemb-4 leading-tight">
            Create your product <br className="hidden md:inline" />
            post-purchase experience
          </h2>
          <p className="text-base md:text-lg bricolage-grotesque-light text-white mb-8 max-w-md mx-auto lg:mx-0">
            Design the digital journey your customers will have after
            purchase. Add tutorials, routines, product ingredients, application tips, and
            more.
          </p>
          <Button 
            variant="default" 
            className="bg-white text-[#580F41] px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 hover:text-white transition-colors"
          >
            Get started for free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostPurchaseSection;
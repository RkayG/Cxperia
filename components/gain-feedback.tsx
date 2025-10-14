//'use client';
//import React from 'react';
//import { Button } from '@/components/ui/button';
//import InfiniteScroll from './InfiniteScroll'
////bg-[#580F41]
//const GainFeedbackSection = () => {
//  return (
//    <div className="bg-[#e9c0e9] p-8 md:p-16 lg:p-24">
//      <div className="flex flex-col text-white border-5  bg-[#191970] border-[#580F41] lg:flex-row max-w-7xl mx-auto items-center">
//        {/* Left Column for InfiniteScroll Text Animation */}
//        <div className="lg:w-1/2  w-full mb-12 lg:mb-0 lg:pr-12 flex items-center justify-center">
//          <div style={{ height: '500px', position: 'relative', width: '100%' }}>
//            {/* InfiniteScroll with mixed text and paragraph items, tilted left */}
//            {/* @ts-ignore */}
//            <InfiniteScroll
//              items={[
//                { content: "😠 'This cleanser dried out my skin.'" },
//                { content: "😞 'The moisturizer felt heavy and greasy.'" },
//                { content: "😐 'Decent sunscreen, but left a white cast.'" },
//                { content: "😊 'Loved the serum, my skin feels smoother!'" },
//                { content: "😍 'Best face mask ever! My skin glows.'" },
//                { content: "😠 'Mascara clumped after one use.'" },
//                { content: "😞 'Lip balm didn’t last long.'" },
//                { content: "😐 'Foundation coverage was average.'" },
//                { content: "😊 'Gentle toner, no irritation.'" },
//                { content: "😍 'Amazing shampoo, smells great!'" },
//                { content: "😠 'Eye cream stung my eyes.'" },
//                { content: "😞 'Body lotion was too sticky.'" },
//                { content: "😐 'Face wash was okay, nothing special.'" },
//                { content: "😊 'Hydrating mist is refreshing.'" },
//                { content: "😍 'Love the texture of this cream!'" }
//              ]}
//              isTilted={true}
//              tiltDirection="left"
//              autoplay={true}
//              autoplaySpeed={1}
//              autoplayDirection="down"
//              pauseOnHover={true}
//              
//            />
//          </div>
//        </div>
//
//        {/* Right Column for Content */}
//        <div className="lg:w-1/2 w-full text-white text-center lg:text-left">
//          <h2 className="text-4xl max-w-md md:text-5xl bricolage-grotesque font-extrabold text-white mb-4 leading-tight">
//            Engage your Customers.
//            Gain their Feedback. 
//            Serve them better.
//          </h2>
//          <p className="text-base md:text-lg bricolage-grotesque-light text-white mb-8 max-w-md mx-auto lg:mx-0">
//            Use surveys and feedback forms to
//            gather insights directly from your customers. Understand their needs
//            and preferences to continually enhance their experience.
//          </p>
//          <Button 
//            variant="default" 
//            className="bg-white text-[#580F41] px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 hover:text-white transition-colors"
//          >
//            See Demo
//          </Button>
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default GainFeedbackSection;
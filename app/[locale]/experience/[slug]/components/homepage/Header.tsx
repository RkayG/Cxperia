//import React, { useContext } from 'react';
//
//const Header: React.FC = () => {
//  const {contextColor} = useContext(ColorContext);
//  const color = contextColor;
//  return (
//    <div className="bg-white relative overflow-hidden">      
//      <div className="relative z-10 px-6 py-8">
//        {/* Logo Section */}
//        <div className="flex justify-center">
//          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200">
//            <span className="text-gray-800 font-bold text-sm tracking-wide">LOGO</span>
//          </div>
//        </div>
//        
//        {/* Main Content */}
//        <div className="flex items-center justify-between gap-6">
//          {/* Product Info */}
//          <div className="flex-1 max-w-xs ml-2">
//            <div className="mb-2">
//              <h1 className="text-2xl text-left font-bold tracking-tight" style={{ color }}>
//                Nivea Men
//              </h1>
//              <div className="w-12 h-1 rounded-full mt-2" style={{ backgroundColor: color }}></div>
//            </div>
//            <p className="text-gray-600 text-left text-sm leading-relaxed mb-6">
//              Deep hydration & moisture & soft skin with nature's touch
//            </p>
//            
//            {/* Call to Action */}
//            <button
//              className="group text-white px-3 md:px-6 py-3 rounded-full font-semibold text-sm shadow-md hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
//              style={{ backgroundColor: color }}
//            >
//              <span>VISIT STORE</span>
//              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//              </svg>
//            </button>
//          </div>
//          
//          {/* Product Image */}
//          <div className="flex-shrink-0">
//            <div className="relative">
//              <img
//                src="/demo4.png"
//                alt="Nivea Product"
//                className="relative w-40 h-48 object-cover rounded-2xl shadow-lg border border-gray-100"
//              />
//              {/* Minimalist accent replaced with star icon */}
//              <svg
//                className="absolute -top-2 -right-2 w-5 h-5 animate-pulse"
//                viewBox="0 0 24 24"
//                fill={color}
//                style={{ filter: `drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #fff)` }}
//                xmlns="http://www.w3.org/2000/svg"
//              >
//                <path d="M12 2l2.9 6.9L22 10l-5 5.1L18 22l-6-3.2L6 22l1-6.9L2 10l7.1-1.1L12 2z" />
//                {/* Tiny white lights for sparkle */}
//                <circle cx="12" cy="5.5" r="0.5" fill="#fff" opacity="0.9" />
//                <circle cx="16.5" cy="16" r="0.35" fill="#fff" opacity="0.8" />
//                <circle cx="16.5" cy="10" r="0.35" fill="#fff" opacity="0.8" />
//                <circle cx="16.5" cy="16" r="0.35" fill="#fff" opacity="0.8" />
//                <circle cx="8.5" cy="14" r="0.25" fill="#fff" opacity="0.6" />
//                <circle cx="10" cy="17" r="0.3" fill="#fff" opacity="0.7" />
//                <circle cx="8.5" cy="10" r="0.3" fill="#fff" opacity="0.7" />
//                <circle cx="12" cy="17" r="0.4" fill="#fff" opacity="0.8" />
//              </svg>
//            </div>
//          </div>
//        </div>
//        
//        {/* Bottom accent line */}
//        <div className="mt-8 h-px bg-gray-200"></div>
//      </div>
//    </div>
//  );
//};
//
//export default Header;
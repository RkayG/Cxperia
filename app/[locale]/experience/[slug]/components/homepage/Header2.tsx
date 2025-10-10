//import React, { useContext } from 'react';
//import ColorContext from '../../context/ColorContext';
//
//const Header: React.FC = () => {
//  const { contextColor } = useContext(ColorContext);
//  const color = contextColor;
//  // Fallbacks for gradient stops
//  const gradientFrom = color || '#a78bfa'; // purple-400
//  const gradientTo = color || '#60a5fa';   // blue-400
//  return (
//    <div
//      className="relative overflow-hidden"
//      style={{
//        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
//      }}
//    >
//      {/* Background decorative elements */}
//      <div
//        className="absolute inset-0"
//        style={{
//          background: `linear-gradient(90deg, ${gradientFrom}10 0%, ${gradientTo}10 100%)`,
//          opacity: 0.7
//        }}
//      ></div>
//      <div
//        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
//        style={{ background: `${gradientFrom}0D` }}
//      ></div>
//      <div
//        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl"
//        style={{ background: `${gradientTo}0D` }}
//      ></div>
//      <div className="relative z-10 px-6 py-8">
//        {/* Logo Section */}
//        <div className="flex justify-center ">
//          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
//            <span className="text-slate-700 font-bold text-sm tracking-wide">LOGO</span>
//          </div>
//        </div>
//        
//        {/* Main Content */}
//        <div className="flex items-center justify-between gap-6">
//          {/* Product Info */}
//          <div className="flex-1 max-w-xs ml-2">
//            <div className="mb-2">
//              <h1 className="text-2xl text-left font-bold text-white tracking-tight">
//                Nivea Men
//              </h1>
//              <div
//                className="w-12 h-1 rounded-full mt-2"
//                style={{
//                  background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
//                }}
//              ></div>
//            </div>
//            <p className="text-gray-200 text-left text-sm leading-relaxed mb-6">
//              Deep hydration & moisture & soft skin with nature's touch
//            </p>
//            
//            {/* Call to Action */}
//            <button className="group bg-white/90 backdrop-blur-sm text-slate-800 px-3 md:px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
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
//              {/* Image container with subtle glow */}
//              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-2xl blur-sm"></div>
//              <img
//                src="/demo4.png"
//                alt="Nivea Product"
//                className="relative w-40 h-48 object-cover rounded-2xl shadow-2xl"
//              />
//              {/* Floating accent */}
//              <div
//                className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg animate-pulse"
//                style={{
//                  background: `linear-gradient(135deg, #fff, ${color})`,
//                  boxShadow: `0 0 16px 4px ${color}99, 0 0 32px 8px #fff6`
//                }}
//              ></div>
//            </div>
//          </div>
//        </div>
//        
//        {/* Bottom accent line */}
//        <div
//          className="mt-8 h-px"
//          style={{
//            background: `linear-gradient(90deg, transparent 0%, ${color}80 50%, transparent 100%)`
//          }}
//        ></div>
//      </div>
//    </div>
//  );
//};
// 
//export default Header;
//import React, { useState } from 'react';
//import { Play, Clock, List, MoreVertical } from 'lucide-react';
//
//export interface TutorialCardProps {
//  image: string;
//  title: string;
//  duration: string;
//  steps: string;
//  brandLogo: string;
//  brandName: string;
//  views: string;
//  publishedAt: string;
//  verified?: boolean;
//}
//
//const TutorialCard: React.FC<TutorialCardProps> = ({ 
//  image, 
//  title, 
//  duration, 
//  steps, 
//  brandName,
//  views,
//  publishedAt,
//  verified = false
//}) => {
//  const [isHovered, setIsHovered] = useState(false);
//  const [imageLoaded, setImageLoaded] = useState(false);
//
//  return (
//    <div 
//      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
//      onMouseEnter={() => setIsHovered(true)}
//      onMouseLeave={() => setIsHovered(false)}
//    >
//      {/* Video Thumbnail */}
//      <div className="relative aspect-video bg-gray-200 overflow-hidden">
//        <img
//          src={image}
//          alt={title}
//          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
//            imageLoaded ? 'opacity-100' : 'opacity-0'
//          }`}
//          onLoad={() => setImageLoaded(true)}
//          onError={(e) => { 
//            e.currentTarget.src = "https://placehold.co/640x360/8A2BE2/FFFFFF?text=Tutorial+Thumbnail"; 
//          }}
//        />
//        
//        {/* Duration Badge */}
//        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium flex items-center space-x-1">
//          <Clock size={10} />
//          <span>{duration}</span>
//        </div>
//
//        {/* Steps Badge */}
//        <div className="absolute bottom-2 left-2 bg-purple-600/90 text-white text-xs px-2 py-1 rounded font-medium flex items-center space-x-1">
//          <List size={10} />
//          <span>{steps}</span>
//        </div>
//
//        {/* Play Button Overlay */}
//        <div 
//          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
//            isHovered ? 'opacity-100' : 'opacity-0'
//          }`}
//        >
//          <div className="bg-black/60 rounded-full p-4 transform transition-transform duration-200 hover:scale-110">
//            <Play size={32} className="text-white fill-current ml-1" />
//          </div>
//        </div>
//
//        {/* Loading skeleton */}
//        {!imageLoaded && (
//          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
//            <div className="text-gray-400">Loading...</div>
//          </div>
//        )}
//      </div>
//
//      {/* Video Info */}
//      <div className="p-3">
//        <div className="flex space-x-3">
//          {/* Brand Logo */}
//          <div className="flex-shrink-0">
//              <div className="flex justify-center ">
//              <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
//                <span className="text-slate-700 font-bold text-sm tracking-wide">LOGO</span>
//              </div>
//            </div>
//          </div>
//
//          {/* Content */}
//          <div className="flex-1 min-w-0">
//            <h3 
//              className="font-semibold text-left text-gray-900 text-sm leading-5 mb-1 line-clamp-2 group-hover:text-purple-700 transition-colors"
//              title={title}
//            >
//              {title}
//            </h3>
//            
//            <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
//              <span className="hover:text-gray-900 transition-colors cursor-pointer">
//                {brandName}
//              </span>
//              {verified && (
//                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
//                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                </svg>
//              )}
//            </div>
//            
//            <div className="flex items-center space-x-1 text-xs text-gray-500">
//              <span>{views}</span>
//              <span>•</span>
//              <span>{publishedAt}</span>
//            </div>
//          </div>
//
//          {/* More Options */}
//          <div className={`flex-shrink-0 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
//              <MoreVertical size={16} className="text-gray-600" />
//            </button>
//          </div>
//        </div>
//
//        {/* Action Button */}
//       {/*  <div className="mt-3">
//          <button className="w-full bg-purple-800 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
//            <Play size={14} className="fill-current" />
//            <span>Watch</span>
//          </button>
//        </div> */}
//      </div>
//    </div>
//  );
//};
//
//export default TutorialCard;
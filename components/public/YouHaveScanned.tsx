// src/components/HeaderBold.tsx
import React, { useState, useEffect, useRef } from "react";
import UnpackingLoader  from '@/components/UnpackingLoader';
import Image from 'next/image';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import FeatureSlider from "./FeatureSlider";

const YouHaveScanned: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const experience = usePublicExpStore((state) => state.experience);
  const product = usePublicExpStore((state) => state.product) || {};
  const brandLogo = usePublicExpStore((state) => state.brandLogo) || "";
  const images = product.product_image_url || [];
  const color = experience?.data?.primary_color || "#1e3a8a";
  const [showConfetti, setShowConfetti] = useState(true);
  const [_ctaTextIndex, setCtaTextIndex] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  // Always show loader for at least 2.5s
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Engaging CTA options instead of "Explore"
  const ctaOptions = [
    "Discover Benefits →",
    "See Ingredients →",
    "Learn How To Use →",
    "Get Beauty Tips →",
    "Find Your Routine →",
    "Unlock Secrets →",
  ];

  // Rotate through CTA text options
  useEffect(() => {
    const interval = setInterval(() => {
      setCtaTextIndex((prev) => (prev + 1) % ctaOptions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Hide confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Confetti effect
  const Confetti = () => (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-4 opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: [
              "#ff6b6b",
              "#54a0ff",
              "#10ac84",
              "#feca57",
              "#a29bfe",
              "#ee5a24",
            ][i % 6],
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `confetti-fall ${
              Math.random() * 3 + 2
            }s linear forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );

  if (showLoader) {
    return <UnpackingLoader />;
  }

  return (
    <div className="overflow-y-auto min-h-screen max-w-xl bg-white mx-auto">
      <div className="relative min-h-screen flex flex-col">
        {showConfetti && <Confetti />}

        {/* Header Section */}
        <div
          className="text-left p-8 h-60 w-full block text-white"
          style={{ backgroundColor: color }}
        >
          <div className="flex justify-left">
            {brandLogo ? (
              <Image
                src={brandLogo}
                alt="Brand Logo"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm object-contain"
                style={{ background: 'white' }}
                priority
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-slate-700 font-bold text-sm tracking-wide">
                  LOGO
                </span>
              </div>
            )}
          </div>

          <div className="mb-4 text-center py-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {experience?.data?.product?.name || ""}
            </h1>
            <div
              className="w-16 h-1 mt-3 bg-white mx-auto"
              style={{
                clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
              }}
            ></div>
            <p className="text-gray-200 text-lg my-3 leading-relaxed pb-8">
              {experience?.data?.product?.tagline || ""}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div
          ref={contentRef}
          className="flex-grow min-h-96 p-3 -mt-10 space-y-6"
        >
          <div className="text-center px-2 py-8 bg-white rounded-lg shadow-md">
            <h1 className="font-bold text-2xl">Scan Successful!</h1>
            <h3 className="text-lg font-semibold">
              Thank you for scanning {product?.name || "this product"}!
            </h3>

            {/* Product Image (if available) */}
            {images.length > 0 && (
              <div className="my-6 flex rounded-full justify-center border-2" 
                style={{border:'2px', borderColor: color}}>
                <Image
                  src={images[0]}
                  alt={product?.name || "Product"}
                  width={272}
                  height={272}
                  className="h-68 w-68 rounded-full object-cover"
                  style={{ borderRadius: '9999px', objectFit: 'cover' }}
                  priority
                />
              </div>
            )}

            <FeatureSlider />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default YouHaveScanned;

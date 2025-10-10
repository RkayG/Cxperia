import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const HeaderLight: React.FC = () => {
  const { experience, brandName, color } = usePublicExpStore();
  const product = experience?.data?.product || {};
  const brandLogoUrl = experience?.data?.brand_logo_url || "";

  // Sample product images if none provided
  /*   const defaultImages = [
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1602488257133-58d5fc939286?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
  ]; */

  const images =
    product.product_image_url && product.product_image_url.length > 0
      ? product.product_image_url
      : [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance the slider
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToNext = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    if (images.length <= 1) return;
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToImage = (index: number) => {
    if (images.length <= 1) return;
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Don't render anything if no experience data
  if (!experience) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      {/* Header Section with Auto-Sliding Banner */}
      <div className="bg-white rounded-b-3xl  relative overflow-hidden">
        <div className="relative z-10 px-6 py-8">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200 overflow-hidden">
              {brandLogoUrl ? (
                <Image
                  src={brandLogoUrl}
                  alt={brandName}
                  width={48}
                  height={48}
                  className="object-contain"
                  style={{ maxWidth: "48px", maxHeight: "48px" }}
                  priority
                />
              ) : (
                <span className="text-gray-800 font-bold text-sm tracking-wide">
                  LOGO
                </span>
              )}
            </div>
          </div>

          {/* Main Content with Image Banner */}
          <div className="flex flex-col items-center justify-between gap-8 mt-8">
            {/* Product Info */}
            <div className="flex-1 max-w-lg text-center">
              <div className="mb-4">
                <h1
                  className="text-3xl md:text-4xl font-bold tracking-tight"
                  style={{ color }}
                >
                  {product.name || ""}
                </h1>
                <div
                  className="w-16 h-1 rounded-full mt-3 mx-auto"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {product.tagline || ""}
              </p>

              {/* Ratings and Price */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
                {/* <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    (128 reviews)
                  </span>
                </div> */}

                {(product.discounted_price || product.original_price) && (
                  <div className="text-gray-900">
                    <span className="text-2xl font-bold">
                      {product.discounted_price
                        ? `€${product.discounted_price}`
                        : ""}
                    </span>
                    <span className="text-sm line-through ml-2 opacity-75">
                      {product.original_price
                        ? `€${product.original_price}`
                        : ""}
                    </span>
                  </div>
                )}
              </div>
              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={product.store_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="group bg-white/90 w-full backdrop-blur-sm text-slate-800 px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ borderColor: color, borderWidth: "1px" }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>VISIT STORE</span>
                  </button>
                </a>

                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <button
                      className="group border border-white text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-white/20 hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                      style={{ backgroundColor: color }}
                    >
                      <span>VIEW DETAILS</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle className="text-center text-xl font-bold" style={{ color }}>
                          {product?.name || "Product Details"}
                        </DrawerTitle>
                        <DrawerDescription className="text-center text-gray-600">
                          Learn more about this amazing product
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-8">
                        <div className="space-y-4">
                          {/* Product Description */}
                          {product?.description && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                          )}
                          
                          {/* Product Category */}
                          {product?.category && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                              <p className="text-gray-700 text-sm">
                                {product.category}
                              </p>
                            </div>
                          )}
                          
                          {/* Skin Type */}
                          {product?.skin_type && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Skin Type</h3>
                              <p className="text-gray-700 text-sm">
                                {product.skin_type}
                              </p>
                            </div>
                          )}
                          
                          {/* Net Content */}
                          {product?.net_content && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Net Content</h3>
                              <p className="text-gray-700 text-sm">
                                {product.net_content}ml
                              </p>
                            </div>
                          )}
                          
                          {/* Usage Duration */}
                          {product?.estimated_usage_duration_days && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Estimated Duration</h3>
                              <p className="text-gray-700 text-sm">
                                {product.estimated_usage_duration_days} days
                              </p>
                            </div>
                          )}
                          
                          {/* Pricing */}
                          {(product?.original_price || product?.discounted_price) && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                              <div className="flex items-center gap-2">
                                {product?.discounted_price && (
                                  <span className="text-lg font-bold" style={{ color }}>
                                    €{product.discounted_price}
                                  </span>
                                )}
                                {product?.original_price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    €{product.original_price}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            {/* Product Image Banner */}
            <div className="flex-shrink-0 w-full">
              <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100">
                {/* Main Image */}
                <div className="relative h-64 md:h-80 lg:h-96 bg-gray-100">
                  <Image
                    src={images[currentImageIndex] || '/assets/images/placeholder.png'}
                    alt={product.name || "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover transition-opacity duration-500"
                    style={{ zIndex: 1, borderRadius: '1rem' }}
                    priority={currentImageIndex === 0}
                  />

                  {/* Navigation Arrows (only show if multiple images) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors z-20"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-800" />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors z-20"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-800" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation (only show if multiple images) */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                    {images.map((_: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full ${
                          currentImageIndex === index
                            ? "bg-gray-800"
                            : "bg-gray-400"
                        } transition-colors`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Star accent */}
                <svg
                  className="absolute -top-2 -right-2 w-6 h-6 animate-pulse z-10"
                  viewBox="0 0 24 24"
                  fill={color}
                  style={{
                    filter: `drop-shadow(0 0 8px rgba(255,255,255,0.8)) drop-shadow(0 0 16px rgba(255,255,255,0.6))`,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l2.9 6.9L22 10l-5 5.1L18 22l-6-3.2L6 22l1-6.9L2 10l7.1-1.1L12 2z" />
                  {/* Tiny white lights for sparkle */}
                  <circle cx="12" cy="5.5" r="0.5" fill="#fff" opacity="0.9" />
                  <circle
                    cx="16.5"
                    cy="16"
                    r="0.35"
                    fill="#fff"
                    opacity="0.8"
                  />
                  <circle
                    cx="16.5"
                    cy="10"
                    r="0.35"
                    fill="#fff"
                    opacity="0.8"
                  />
                  <circle cx="8.5" cy="14" r="0.25" fill="#fff" opacity="0.6" />
                  <circle cx="10" cy="17" r="0.3" fill="#fff" opacity="0.7" />
                  <circle cx="8.5" cy="10" r="0.3" fill="#fff" opacity="0.7" />
                  <circle cx="12" cy="17" r="0.4" fill="#fff" opacity="0.8" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="mt-12 h-px bg-gray-200"></div>
        </div>
      </div>

    </div>
  );
};

export default HeaderLight;

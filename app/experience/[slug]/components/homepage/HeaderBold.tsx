import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
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

interface HeaderBoldProps {
  color?: string;
}

const HeaderBold: React.FC<HeaderBoldProps> = ({ color }) => {
  const { experience, brandLogo, brandName, color: storeColor } = usePublicExpStore();
  const finalColor = color || storeColor;

  // Use product images if available, else fallback to sample images
  const product = experience?.data?.product || {};
  const productImages =
    Array.isArray(product.product_image_url) &&
    product.product_image_url.length > 0
      ? product.product_image_url
      : [
          /* 
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602488257133-58d5fc939286?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
    */
        ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance the slider
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, productImages.length]);

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === productImages.length - 1 ? 0 : currentImageIndex + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? productImages.length - 1 : currentImageIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  // Fallbacks for gradient stops
  const gradientFrom = finalColor;
  const gradientTo = finalColor;

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Store link
  const storeLink = product.store_link || "#";

  // Don't render anything if no experience data
  if (!experience) {
    return null;
  }

  return (
    <div className=" rounded-b-3xl overflow-hidden">
      {/* Banner Section with Auto-Sliding Images */}
      <div
        className="relative rounded-b-3xl   overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        }}
      >

        <div className="relative z-10 px-6 py-8">
          {/* Logo Section */}
          <div className="flex justify-center">
            {brandLogo ? (
              <img
                src={brandLogo}
                alt={brandName}
                className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm object-contain"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-slate-700 font-bold text-sm tracking-wide">
                  {brandName.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Main Content with Image Banner */}
          <div className="flex flex-col items-center justify-between gap-8 mt-8">
            {/* Product Info */}
            <div className="flex-1 max-w-lg text-center">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {experience?.data?.product?.name || ""}
                </h1>
                <div
                  className="w-16 h-1 mt-3 bg-white mx-auto"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
                  }}
                ></div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                {experience?.data?.product?.tagline || ""}
              </p>

              {/* Ratings and Price */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-3">
                {/* <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-white text-sm">(128 reviews)</span>
                </div> */}

                {(product?.discounted_price || product?.original_price) && (
                  <div className="text-white">
                    <span className="text-2xl font-bold">
                      {product?.discounted_price
                        ? `€${product.discounted_price}`
                        : ""}
                    </span>
                    <span className="text-sm line-through ml-2 opacity-75">
                      {product?.original_price
                        ? `€${product.original_price}`
                        : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={storeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/90 backdrop-blur-sm text-slate-800 px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-white hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    pointerEvents: storeLink === "#" ? "none" : undefined,
                    opacity: storeLink === "#" ? 0.5 : 1,
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>VISITER LE STORE</span>
                </a>
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <button className="group border border-white text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-white/20 hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2">
                      <span>VOIR LES DÉTAILS</span>
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
                  <DrawerContent className="max-w-xl mx-auto">
                    <div className="mx-auto w-full max-w-xl">
                      <DrawerHeader>
                        <DrawerTitle className="text-center text-xl font-bold" style={{ color: finalColor }}>
                          {experience?.data?.product?.name || "Détails du produit"}
                        </DrawerTitle>
                        <DrawerDescription className="text-center text-gray-600">
                          En savoir plus sur ce produit incroyable
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-8">
                        <div className="space-y-4">
                          {/* Product Description */}
                          {product?.description && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Description</h3> {/* Description */}
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
                        {/*   {product?.estimated_usage_duration_days && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Estimated Duration</h3>
                              <p className="text-gray-700 text-sm">
                                {product.estimated_usage_duration_days} days
                              </p>
                            </div>
                          )} */}
                          
                          {/* Pricing */}
                          {(product?.original_price || product?.discounted_price) && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                              <div className="flex items-center gap-2">
                                {product?.discounted_price && (
                                  <span className="text-lg font-bold" style={{ color: finalColor }}>
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
            <div className="flex-shrink-0 w-full ">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                {/* Image container with subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-2xl blur-sm z-10"></div>

                {/* Main Image */}
                <div className="relative h-64 md:h-80 lg:h-96 bg-gray-200">
                  <Image
                    src={productImages[currentImageIndex] || '/assets/images/placeholder.png'}
                    alt="Product showcase"
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover transition-opacity duration-500"
                    style={{ zIndex: 1, borderRadius: '1rem' }}
                    priority={currentImageIndex === 0}
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors z-20"
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-800" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors z-20"
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-800" />
                  </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                  {productImages.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full ${
                        currentImageIndex === index ? "bg-white" : "bg-white/50"
                      } transition-colors`}
                      aria-label={`Aller à l'image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div
            className="mt-12 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #fff 40%, #fff 60%, transparent 100%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBold;

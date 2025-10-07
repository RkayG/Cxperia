'use client';

import React, { useEffect, useState } from "react";
import YouHaveScanned from "./YouHaveScanned";
import FeatureGrid from "./homepage/FeatureGrid";
import ThemeAwareHeader from "./homepage/ThemeAwareHeader";

interface ClientExperienceWrapperProps {
  slug: string;
  color: string;
  product: any;
  brandLogo?: string;
  brandName?: string;
}

const ClientExperienceWrapper: React.FC<ClientExperienceWrapperProps> = ({
  slug,
  color,
  product,
  brandLogo,
  brandName,
}) => {
  const [isNewCustomer, setIsNewCustomer] = useState<boolean | null>(null);

  // Check if this is a new customer (first-time visitor to this specific experience)
  useEffect(() => {
    const checkNewCustomer = () => {
      // Check localStorage for previous visits to this specific experience
      const visitedExperiences = JSON.parse(localStorage.getItem('visitedExperiences') || '[]') as string[];
      const hasVisitedThisExperience = visitedExperiences.includes(slug);
      const isNewCustomer = !hasVisitedThisExperience;
      
      console.log('🔍 ClientExperienceWrapper customer check:', { 
        slug, 
        visitedExperiences, 
        hasVisitedThisExperience, 
        isNewCustomer 
      });
      
      setIsNewCustomer(isNewCustomer);
      
      // Mark this experience as visited for future visits
      if (isNewCustomer && slug) {
        const updatedVisitedExperiences = [...visitedExperiences, slug] as string[];
        localStorage.setItem('visitedExperiences', JSON.stringify(updatedVisitedExperiences));
        console.log('✅ ClientExperienceWrapper marked experience as visited:', slug);
      }
    };

    checkNewCustomer();
  }, [slug]);

  // Show loading while determining customer status
  if (isNewCustomer === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: color }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Show YouHaveScanned for new customers
  if (isNewCustomer === true) {
    console.log('🎉 ClientExperienceWrapper showing YouHaveScanned for new customer');
    return <YouHaveScanned slug={slug} />;
  }

  // Show regular home page for returning customers
  if (isNewCustomer === false) {
    console.log('🏠 ClientExperienceWrapper showing home page for returning customer');
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: color }}>
      <div className="max-w-xl mx-auto bg-gray-50 min-h-screen overflow-hidden">
        <ThemeAwareHeader 
          product={product}
          brandLogo={brandLogo}
          brandName={brandName}
          color={color}
        />
        <main className="rounded-3xl bg-gray-50 space-y-4">
          <FeatureGrid 
            product={product}
            brandLogo={brandLogo}
            brandName={brandName}
            color={color}
          />
        </main>
      </div>
    </div>
  );
};

export default ClientExperienceWrapper;
v
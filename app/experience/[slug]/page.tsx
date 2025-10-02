'use client';
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import WelcomeFlow from './components/WelcomeFlow';
import PublicLoading from "./components/PublicLoading";

const InteractiveWelcome = () => {
  const router = useRouter();
  const { experience, isLoading, brandLogo, color, brandName, product} = usePublicExpStore();
  const [customerCheckComplete, setCustomerCheckComplete] = useState(false);
  const [lastCheckedSlug, setLastCheckedSlug] = useState<string | null>(null);
  const [isReturningCustomer, setIsReturningCustomer] = useState<boolean | null>(null);

  // Get slug from URL
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null;

  // Check if this is a returning customer
  useEffect(() => {
    // Reset customer check if slug has changed
    if (slug && slug !== lastCheckedSlug) {
      console.log("🔄 Slug changed, resetting customer check");
      setCustomerCheckComplete(false);
      setLastCheckedSlug(slug);
    }
    
    if (slug && !customerCheckComplete) {
      console.log("🔍 Checking customer status for slug:", slug);
      
      // Check if this is their first time scanning ANY product
      const hasScannedAnyProduct = localStorage.getItem('has_scanned_any_product');
      const hasScannedThisProduct = localStorage.getItem(`scanned_${slug}`);
      
      console.log("📊 Has scanned any product:", hasScannedAnyProduct);
      console.log("📊 Has scanned this product:", hasScannedThisProduct);
      console.log("🔄 Customer check complete:", customerCheckComplete);
      
      if (hasScannedThisProduct) {
        // They've scanned this specific product before - returning customer
        setIsReturningCustomer(true);
        setCustomerCheckComplete(true);
        console.log("Returning customer - scanned this product before");
      } else if (hasScannedAnyProduct) {
        // They've scanned other products but not this one - new to this product
        setIsReturningCustomer(false);
        localStorage.setItem(`scanned_${slug}`, 'true');
        setCustomerCheckComplete(true);
        console.log("New to this product - but has scanned other products");
      } else {
        // First time scanning anything - completely new customer
        setIsReturningCustomer(false);
        localStorage.setItem('has_scanned_any_product', 'true');
        localStorage.setItem(`scanned_${slug}`, 'true');
        setCustomerCheckComplete(true);
        console.log("Completely new customer - first scan ever");
      } 
    } else if (!slug) {
      console.log("❌ No slug provided, skipping customer check");
      return;
    } else {
      console.log("⏭️ Customer check already complete, skipping");
    }
  }, [slug, customerCheckComplete, lastCheckedSlug]);

  // Handle feature selection
  const handleFeatureSelect = (featureId: string) => {
    if (!slug) return;
    
    const featureRoutes: Record<string, string> = {
      'ingredients': `/experience/${slug}/ingredients`,
      'usage': `/experience/${slug}/usage`,
      'tutorials': `/experience/${slug}/tutorials`,
      'benefits': `/experience/${slug}/benefits`,
      'chatbot': `/experience/${slug}/chatbot`
    };

    const route = featureRoutes[featureId];
    if (route) {
      router.push(route);
    }
  };
  if (isLoading) {
    return <PublicLoading />;
  }     
  // Show loading while checking customer status or loading experience
  if (!customerCheckComplete || !experience) {
    return (
      <WelcomeFlow
        product={null}
        brandLogo={undefined}
        brandName={undefined}
        color="#6366f1"
        isReturningCustomer={null}
        onFeatureSelect={() => {}}
        isLoading={true}
      />
    );
  }

  return (
    <WelcomeFlow
      product={product}
      brandLogo={brandLogo}
      brandName={brandName}
      color={color}
      isReturningCustomer={isReturningCustomer}
      onFeatureSelect={handleFeatureSelect}
      isLoading={isLoading}
    />
  );
};

export default InteractiveWelcome;
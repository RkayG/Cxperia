// src/App.tsx
'use client';
import React from "react";
import FeatureGrid from "@/app/experience/[slug]/components/homepage/FeatureGrid";
import ThemeAwareHeader from "@/app/experience/[slug]/components/homepage/ThemeAwareHeader";
import YouHaveScanned from "@/app/experience/[slug]/components/YouHaveScanned";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";
import PublicLoading from "./components/PublicLoading";

const HomePage: React.FC = () => {
  const { color, isLoading } = usePublicExpStore();
  const [isNewCustomer, setIsNewCustomer] = React.useState<boolean | null>(null);

  // Check if this is a new customer (first-time visitor to this specific experience)
  React.useEffect(() => {
    const checkNewCustomer = () => {
      // Get the current experience slug from the URL
      const currentPath = window.location.pathname;
      const experienceSlug = currentPath.split('/')[2]; // Extract slug from /experience/[slug]/home
      
      // Check localStorage for previous visits to this specific experience
      const visitedExperiences = JSON.parse(localStorage.getItem('visitedExperiences') || '[]') as string[];
      const hasVisitedThisExperience = visitedExperiences.includes(experienceSlug);
      const isNewCustomer = !hasVisitedThisExperience;
      
      console.log('🔍 Customer check:', { 
        experienceSlug, 
        visitedExperiences, 
        hasVisitedThisExperience, 
        isNewCustomer 
      });
      
      setIsNewCustomer(isNewCustomer);
      
      // Mark this experience as visited for future visits
      if (isNewCustomer && experienceSlug) {
        const updatedVisitedExperiences = [...visitedExperiences, experienceSlug] as string[] ;
        localStorage.setItem('visitedExperiences', JSON.stringify(updatedVisitedExperiences));
        console.log('✅ Marked experience as visited:', experienceSlug);
      }
    };

    checkNewCustomer();
  }, []);

  if (isLoading) {
    return <PublicLoading />;
  }

  // Show loading while determining customer status
  if (isNewCustomer === null) {
    return <PublicLoading />;
  }

  // Show YouHaveScanned for new customers
  if (isNewCustomer === true) {
    console.log('🎉 Showing YouHaveScanned for new customer');
    return <YouHaveScanned />;
  }

  // Show regular home page for returning customers
  if (isNewCustomer === false) {
    console.log('🏠 Showing home page for returning customer');
  }
  return (
    <div className="min-h-screen " style={{ backgroundColor: color }}>
      <div
        className="max-w-xl mx-auto bg-gray-50  min-h-screen overflow-hidden"
      >
        <ThemeAwareHeader />
        <main className="rounded-3xl bg-gray-50 space-y-4">
          <FeatureGrid />
        </main>
      </div>
    </div>
  );
};

export default HomePage;

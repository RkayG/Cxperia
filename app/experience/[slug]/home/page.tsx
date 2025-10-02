// src/App.tsx
'use client';
import React from "react";
import ThemeAwareHeader from "@/components/public/homepage/ThemeAwareHeader";
import FeatureGrid from "@/components/public/homepage/FeatureGrid";
import { usePublicExpStore } from "@/store/public/usePublicExpStore";
import YouHaveScanned from "@/components/public/YouHaveScanned";
import PublicLoading from "../components/PublicLoading";

interface HomePageProps {
  color?: string | null;
}




const HomePage: React.FC<HomePageProps> = () => {

  const { color, isLoading } = usePublicExpStore();
  // Removed slug/fetch logic, now handled in InteractiveWelcome
  const [hasScanned, setHasScanned] = React.useState<boolean | null>(null);

   if (isLoading) {
    return <PublicLoading />;
  } 

/*   if (!hasScanned) {
    return <YouHaveScanned />;
  }
 */
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

'use client';

import React from "react";

// INTERNAL IMPORTS
import SectionHeader from "@/app/experience/[slug]/components/ThemeAwareSectionHeader";
import { useExperienceTutorials } from "@/hooks/public/useTutorials";
import CategoryTabs from "./CategoryTabs";
import TutorialsGrid from "./TutorialGrid";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientTutorialsWrapperProps {
  slug: string;
  color: string;
}

const ClientTutorialsWrapper: React.FC<ClientTutorialsWrapperProps> = ({
  slug,
  color,
}) => {
  const { data: tutorialsData, isLoading } = useExperienceTutorials(slug);

  const tutorials = Array.isArray((tutorialsData as any)?.tutorials) ? (tutorialsData as any).tutorials : [];
  //console.log('tutorials', tutorialsData);
  // Category filter state
  const [activeCategory, setActiveCategory] = React.useState<string>("Toutes les catégories");
  
  // Set default category to 'All Categories' when tutorials load
  React.useEffect(() => {
    setActiveCategory("Toutes les catégories");
  }, [tutorials]);

  // Filter tutorials by active category
  const filteredTutorials =
    activeCategory && activeCategory !== "Toutes les catégories"
      ? tutorials.filter((t: any) => t.category === activeCategory)
      : tutorials;
      
  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <>
      <SectionHeader
        title="Tutoriels & Routines"
        subtitle="Découvrez des tutoriels personnalisés et des routines quotidiennes."
      />
      <main className="space-y-6">
        <div className="px-4 pb-4">
          <CategoryTabs tutorials={tutorials} onCategoryChange={setActiveCategory} />
        </div>
        <div className="mb-12">
          <TutorialsGrid tutorials={filteredTutorials} />
        </div>
      </main>
    </>
  );
};

export default ClientTutorialsWrapper;

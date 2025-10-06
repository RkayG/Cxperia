'use client';

import React from "react";

// INTERNAL IMPORTS
import SectionHeader from "@/app/experience/[slug]/components/ThemeAwareSectionHeader";
import { useExperienceTutorials } from "@/hooks/public/useTutorials";
import CategoryTabs from "./CategoryTabs";
import TutorialsGrid from "./TutorialGrid";
import { Skeleton } from "@/components/ui/skeleton";
import SectionNavigation from "../../components/SectionNavigation";

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
  console.log('tutorials', tutorialsData);
  // Category filter state
  const [activeCategory, setActiveCategory] = React.useState<string>("All Categories");
  
  // Set default category to 'All Categories' when tutorials load
  React.useEffect(() => {
    setActiveCategory("All Categories");
  }, [tutorials]);

  // Filter tutorials by active category
  const filteredTutorials =
    activeCategory && activeCategory !== "All Categories"
      ? tutorials.filter((t: any) => t.category === activeCategory)
      : tutorials;
      
  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div className="flex min-h-screen mb-32 justify-center bg-gray-100 font-sans" style={{ backgroundColor: color }}>
      <div className="mx-auto w-full max-w-xl overflow-hidden bg-gray-50 shadow-lg">
        <SectionHeader
          title="Tutorials & Routines"
          subtitle="Discover personalized beauty tutorials and daily routines."
        />
        <main className="space-y-6">
          <div className="px-4 pb-4">
            <CategoryTabs tutorials={tutorials} onCategoryChange={setActiveCategory} />
          </div>
          <div className="mb-12">
            <TutorialsGrid tutorials={filteredTutorials} />
          </div>
        </main>
      </div>
      <SectionNavigation activeSection="tutorials" onSectionChange={() => {}} color={color} slug={slug} /> {/* Navigation for mobile */}
    </div>
  );
};

export default ClientTutorialsWrapper;

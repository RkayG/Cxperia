// src/App.tsx
'use client'
import React, { useCallback } from "react"

// INTERNAL IMPORTS

import { useExperienceTutorials } from "@/hooks/public/useTutorials"
import CategoryTabs from "./components/CategoryTabs"
import TutorialsGrid from "./components/TutorialGrid"
import SectionHeader from "@/components/public/ThemeAwareSectionHeader"
import { usePublicExpStore } from "@/store/public/usePublicExpStore"
import CurvedBottomNav from "@/components/public/CurvedBottomNav"
import PublicLoading from "../components/PublicLoading"


const TutorialPage: React.FC = () => {
  // Use stable selectors to prevent infinite re-renders
  const colorSelector = useCallback((state: any) => state.color, []);
  const isLoadingSelector = useCallback((state: any) => state.isLoading, []);
  const slugSelector = useCallback((state: any) => state.slug, []);
  
  const color = usePublicExpStore(colorSelector);
  const isLoading = usePublicExpStore(isLoadingSelector);
  const slug = usePublicExpStore(slugSelector);

  const { data: tutorialsData } = useExperienceTutorials(slug)

  const tutorials = Array.isArray(tutorialsData?.tutorials) ? tutorialsData.tutorials : []

  // Category filter state
  const [activeCategory, setActiveCategory] = React.useState<string>("All Categories")
  // Set default category to 'All Categories' when tutorials load
  React.useEffect(() => {
    setActiveCategory("All Categories")
  }, [tutorials])

  // Filter tutorials by active category
  const filteredTutorials =
    activeCategory && activeCategory !== "All Categories"
      ? tutorials.filter((t: any) => t.category === activeCategory)
      : tutorials
      
  if (isLoading) {
    return <PublicLoading />;
  }

  return (
      <div className="flex min-h-screen justify-center bg-gray-100 font-sans" style={{ backgroundColor: color }}>
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
      <CurvedBottomNav />
    </div>
  )
}

export default TutorialPage

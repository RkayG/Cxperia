// src/App.tsx
'use client'
import React from "react"

// INTERNAL IMPORTS

import { useExperienceTutorials } from "@/hooks/public/useTutorials"
import CategoryTabs from "./components/CategoryTabs"
import TutorialsGrid from "./components/TutorialGrid"
import SectionHeader from "@/components/public/ThemeAwareSectionHeader"
import { usePublicExpStore } from "@/store/public/usePublicExpStore"
import CurvedBottomNav from "@/components/public/CurvedBottomNav"


const TutorialPage: React.FC = () => {
  const contextColor = usePublicExpStore((state) => state.color)
  const slug = usePublicExpStore((state) => state.slug)

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

  return (
    <div className="flex min-h-screen justify-center bg-gray-100 font-sans" style={{ backgroundColor: contextColor }}>
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

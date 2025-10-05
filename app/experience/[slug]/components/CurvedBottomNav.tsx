"use client"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

interface CurvedBottomNavProps {
  color: string;
  slug: string;
  onSectionChange: (section: 'home' | 'ingredients' | 'feedback' | 'usage-instructions' | 'support-channels' | 'tutorials') => void;
}

const CurvedBottomNav: React.FC<CurvedBottomNavProps> = ({ color, slug, onSectionChange }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDirection = currentScrollY > lastScrollY ? "down" : "up"

      // Show when scrolling up, hide when scrolling down
      // Also show if we're at the very top
      if (currentScrollY <= 10) {
        setIsVisible(true)
      } else if (scrollDirection === "up") {
        setIsVisible(true)
      } else if (scrollDirection === "down") {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const navigateToHome = () => {
    // Update the active section state immediately
    onSectionChange('home');
    
    // Update the URL
    const url = new URL(window.location.href);
    url.searchParams.set('section', 'home');
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-end justify-center bg-transparent transition-transform duration-300 ease-in-out sm:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Center icon/logo container only */}
      <div
        className="mb-4 cursor-pointer rounded-lg bg-gray-100 p-2 transition-transform active:scale-95"
        style={{ boxShadow: `0 4px 24px 0 ${color}55, 0 1.5px 4px 0 ${color}33` }}
        onClick={navigateToHome}
        title="Go to Home"
      >
        {/* Four squares grid */}
        <div className="grid h-8 w-8 grid-cols-2 gap-1">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }}></div>
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }}></div>
        </div>
      </div>
    </div>
  )
}

export default CurvedBottomNav

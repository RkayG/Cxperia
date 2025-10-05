'use client';

import React, { useEffect, useState } from 'react';
import { GiPerfumeBottle, GiPhone, GiNotebook , GiEnvelope, GiHouse} from 'react-icons/gi';
import CurvedBottomNav from './CurvedBottomNav';

type ActiveSection = 'home' | 'ingredients' | 'feedback' | 'usage-instructions' | 'support-channels' | 'tutorials';

interface SectionNavigationProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
  color: string;
  slug: string;
}


const SectionNavigation: React.FC<SectionNavigationProps> = ({
  activeSection,
  onSectionChange,
  color,
  slug,
}) => {
  const sections = [
    { id: 'home', label: 'Home', icon: <GiHouse /> },
    { id: 'ingredients', label: 'Ingredients', icon: <GiPerfumeBottle /> },
    { id: 'usage-instructions', label: 'Instructions', icon: <GiNotebook /> },
   /*  { id: 'tutorials', label: 'Tutorials', icon: <GiVideoCamera /> }, */
    { id: 'feedback', label: 'Feedback', icon: <GiEnvelope /> },
    { id: 'support-channels', label: 'Support', icon: <GiPhone /> },
  ];

  
const [isVisible, setIsVisible] = useState(true)
const [lastScrollY, setLastScrollY] = useState(0)
const [screenWidth, setScreenWidth] = useState(0)

// Check screen width on mount and resize
useEffect(() => {
  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  // Set initial width
  updateScreenWidth();

  // Add resize listener
  window.addEventListener('resize', updateScreenWidth);

  // Cleanup
  return () => window.removeEventListener('resize', updateScreenWidth);
}, []);

// If screen width is less than 400px, return CurvedBottomNav
if (screenWidth < 400) {
  return <CurvedBottomNav color={color} slug={slug} onSectionChange={onSectionChange} />;
}

useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY
    const scrollDifference = Math.abs(currentScrollY - lastScrollY)
    
    // Only trigger if scroll difference is significant enough
    if (scrollDifference < 5) return
    
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

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4  transition-transform duration-300 ease-in-out ${
      isVisible ? "translate-y-0" : "translate-y-full"
    }`}>
      <div className="flex bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id as ActiveSection)}
            className={`flex flex-col items-center justify-center px-3 py-2 text-xs font-medium transition-all duration-200 ${
              activeSection === section.id
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{
              backgroundColor: activeSection === section.id ? color : 'transparent',
              color: activeSection === section.id ? '#fff' : '#000',
            }}
          >
            <span className="text-lg mb-1">{section.icon}</span>
            <span className="text-[10px] leading-tight">{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SectionNavigation;

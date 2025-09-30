'use client'
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  FaCrown,
  FaFileAlt,
  FaBell,
  FaPlus
} from "react-icons/fa";

interface BottomNavLink {
  id: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const bottomNavLinks: BottomNavLink[] = [
  { id: 1, label: "Home", icon: FaHome, path: "/home" },
  { id: 2, label: "Catalog", icon: FaCrown, path: "/dashboard/products" },
  { id: 3, label: "Create", icon: FaPlus, path: "/dashboard/experience/create?step=product-details&new=true" },
  { id: 4, label: "Content", icon: FaFileAlt, path: "/dashboard/content" },
  { id: 5, label: "Overview", icon: FaBell, path: "/dashboard/overview" },
];

const MobileBottomNav: React.FC = () => {
  const navigate = useRouter().push;
  // const location = useRouter().location; // useRouter does not have location
  // Use usePathname to get the current path
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  // Update active tab when route changes
  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const handleNavigation = (path: string) => {
    if (path !== pathname) {
      navigate(path);
      setActiveTab(path);
    }
  };

  // Only show on mobile devices
  if (window.innerWidth >= 1024) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-3">
        {bottomNavLinks.map((link) => {
          const IconComponent = link.icon;
          const isActive = activeTab === link.path;
          
          return (
            <button
              key={link.id}
              onClick={() => handleNavigation(link.path)}
              className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "text-purple-800 bg-purple-100" 
                  : "text-gray-600 hover:text-purple-700"
              }`}
              aria-label={link.label}
            >
              <IconComponent 
                className={`w-5 h-5 ${isActive ? "text-purple-800" : "text-gray-500"}`} 
              />
              <span className={`text-xs mt-1 font-medium ${
                isActive ? "text-purple-800" : "text-gray-600"
              }`}>
                {link.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
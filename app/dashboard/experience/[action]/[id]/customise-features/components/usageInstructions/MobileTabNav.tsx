// MobileTabNav.tsx
import { AlertTriangle, Lightbulb, ListChecks } from "lucide-react";
import React from "react";
import { ActiveTab } from "@/types/usageTypes";

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "instructions", label: "Instructions", icon: ListChecks },
  { id: "tips", label: "Tips", icon: Lightbulb },
  { id: "warnings", label: "Warnings", icon: AlertTriangle },
];

interface MobileTabNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const MobileTabNav: React.FC<MobileTabNavProps> = ({ activeTab, setActiveTab }) => (
  // Mobile Tab Navigation
  <div
    className="mb-6 px-2 bg-gray-50 relative overflow-x-auto lg:hidden"
    style={{ marginLeft: 0 }}
  >
    <nav className="flex space-x-2 border-b border-gray-200">
      {navItems.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`flex w-full py-2 px-1 border-b-2 font-medium text-sm transition-colors justify-center ${
              activeTab === tab.id
                ? "border-purple-800 text-purple-800"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4 mt-0.5 mr-1" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  </div>
);

export default MobileTabNav;
// Sidebar.tsx
import { AlertTriangle, Lightbulb, ListChecks } from "lucide-react";
import React from "react";
import { ActiveTab } from "@/types/usageTypes";

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "instructions", label: "Instructions & Steps", icon: ListChecks },
  { id: "tips", label: "Application Tips", icon: Lightbulb },
  { id: "warnings", label: "Warnings & Precautions", icon: AlertTriangle },
];

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  // Desktop Sidebar
  <div className="w-64 bg-gray-50 relative hidden lg:block border-r border-gray-200 p-4 fixed left-0 top-0 h-full z-30">
    <nav className="space-y-2 ">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl transition-colors ${
              activeTab === item.id
                ? "bg-gray-100 text-purple-800 font-semibold"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            <Icon className="w-5 h-5 mr-1" /> {item.label}
          </button>
        );
      })}
    </nav>
  </div>
);

export default Sidebar;
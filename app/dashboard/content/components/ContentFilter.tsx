import { Search, ChevronDown } from 'lucide-react';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


interface ContentDashboardFilterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  search: string;
  setSearch: (s: string) => void;
  count: number;
}

const tabs = [
  { id: 'all', label: 'All contents' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Draft' },
];

const categories = [
  'Skin Care',
  'Cleanser',
  'Serum',
  'Toner',
  'Moisturizer',
  'Sunscreen',
  'Mask',
  'Eye Care',
  'Other',
];
const types = [
  'All Types',
  'Article',
  'Video',
];

const ContentDashboardFilter: React.FC<ContentDashboardFilterProps> = ({
  activeTab,
  setActiveTab,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  count,
}) => {
  return (
  <div className="relative px-6 left-0 w-full z-20  bg-gray-50 mb-6 space-y-4 border-b border-gray-100" >
      {/* Tabs */}
      <nav className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm sm:text-base font-medium transition-colors
              ${activeTab === tab.id
                ? 'border-b-2 border-purple-600 text-purple-700'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Search and Product Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Type Dropdown */}
        <div className="relative w-full sm:w-40">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
              <span className={selectedType ? 'text-gray-900' : 'text-gray-500'}>
                {selectedType || 'All Types'}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[160px]">
              {types.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className="cursor-pointer"
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Category Dropdown */}
        <div className="relative w-full sm:w-48">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
              <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
                {selectedCategory || 'All Categories'}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[192px]">
              {["All Categories", ...categories].map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="cursor-pointer"
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Article Count and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mt-4 sm:mt-0">
        <span>Showing {count} contents</span>
        
      </div>
    </div>
  );
};

export default ContentDashboardFilter;

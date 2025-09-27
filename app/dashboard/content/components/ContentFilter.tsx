import { Search, ChevronDown } from 'lucide-react';
import React from 'react';
import DropdownSelect from '@/components/DropdownSelect';


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
            className="w-full pl-10 pr-4 py-3.5 text-gray-900 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Type Dropdown (reused) */}
        <div className="relative w-full sm:w-40">
          <DropdownSelect
            value={selectedType}
            onChange={setSelectedType}
            options={types}
            placeholder="All Types"
            searchPlaceholder="Search types..."
          />
        </div>
        {/* Category Dropdown (reused) */}
        <div className="relative w-full sm:w-48">
          <DropdownSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={["All Categories", ...categories]}
            placeholder="All Categories"
            searchPlaceholder="Search categories..."
          />
        </div>
      </div>

      {/* Article Count and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mt-4 sm:mt-0">
        <span>Showing {count} contents</span>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span>Sort by</span>
          <select className="appearance-none bg-transparent border-b border-gray-400 py-1 pr-6 focus:outline-none focus:border-purple-500">
            <option>LATEST DATE</option>
            <option>MOST VIEWS</option>
          </select>
          <ChevronDown size={16} className="text-gray-500 pointer-events-none -ml-5" />
        </div>
      </div>
    </div>
  );
};

export default ContentDashboardFilter;

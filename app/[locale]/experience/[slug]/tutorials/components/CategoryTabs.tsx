import { ChevronRight, Search} from 'lucide-react';
import React, { useState} from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
interface CategoryTabsProps {
  tutorials: any[];
  onCategoryChange?: (category: string) => void;
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onSearch?: (query: string) => void;
  showViewToggle?: boolean;
  showFilter?: boolean;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  tutorials,
  onCategoryChange, 
  onSearch,
}) => {
  // Dynamically extract unique categories from tutorials, prepend 'All Categories'
  const categories = ['All Categories', ...Array.from(new Set(tutorials.map(t => t.category).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const color = usePublicExpStore((state) => state.color);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Count items per category
  const itemCounts: Record<string, number> = { 'All Categories': tutorials.length };
  tutorials.forEach(t => {
    if (t.category) {
      itemCounts[t.category] = (itemCounts[t.category] || 0) + 1;
    }
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      

        {/* Controls */}
        {/* <div className="flex items-center gap-3">
          {showViewToggle && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={viewMode === 'grid' ? { color } : {}}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={viewMode === 'list' ? { color } : {}}
              >
                <List size={18} />
              </button>
            </div>
          )}

          {showFilter && (
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
              <Filter size={16} />
              Filters
            </button>
          )}
        </div> */}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-1">
          <div className="flex space-x-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`relative flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 group ${
                  activeCategory === category
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={
                  activeCategory === category
                    ? { backgroundColor: color }
                    : {}
                }
              >
                {activeCategory === category && (
                  <div className="absolute  bg-gradient-to-r from-transparent to-white/10 rounded-lg" />
                )}
                
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>{category}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                      activeCategory === category
                        ? 'bg-white/20 text-white/90'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {itemCounts[category as keyof typeof itemCounts]}
                  </span>
                </div>

                {/* Active indicator */}
                {activeCategory === category && (
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                    style={{ boxShadow: `0 0 8px 2px ${color}` }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        <div className="relative">
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex space-x-2 overflow-x-auto pb-3 px-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap group ${
                  activeCategory === category
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                }`}
                style={
                  activeCategory === category
                    ? { 
                        backgroundColor: color,
                        boxShadow: `0 4px 12px ${color}40`
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-2">
                  <span>{category}</span>
                  {activeCategory === category && (
                    <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder={`Search ${activeCategory.toLowerCase()} tutorials...`}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200"
            style={{
              borderColor: searchQuery ? `${color}50` : undefined,
              boxShadow: searchQuery ? `0 0 0 3px ${color}10` : undefined,
            }}
          />
          {searchQuery && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {Math.floor(Math.random() * 20) + 5} results
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Category Info */}
      <div className="flex items-center justify-between py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium" style={{ color }}>
            {activeCategory}
          </span>
          <ChevronRight size={14} />
          <span>Showing {itemCounts[activeCategory as keyof typeof itemCounts]} tutorials</span>
        </div>
        
       
      </div>
    </div>
  );
};

export default CategoryTabs;
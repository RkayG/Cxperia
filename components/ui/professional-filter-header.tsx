'use client';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/brands/use-mobile';

interface FilterOption {
  value: string;
  label: string;
}

interface ProfessionalFilterHeaderProps {
  onSearch: (query: string) => void;
  filters: {
    rating?: FilterOption[];
    product?: FilterOption[];
    category?: FilterOption[];
  };
  activeFilters?: {
    rating?: string;
    product?: string;
    category?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  searchPlaceholder?: string;
}

const ProfessionalFilterHeader: React.FC<ProfessionalFilterHeaderProps> = ({
  onSearch,
  filters,
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  searchPlaceholder = "Search feedbacks..."
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const FilterDropdown: React.FC<{
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }> = ({ label, options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-sm font-medium text-gray-700 min-w-[140px]"
        >
          <span className="truncate">{value ? options.find(opt => opt.value === value)?.label : placeholder}</span>
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                    value === option.value ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const MobileFilterPanel = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Rating Filter */}
            {filters.rating && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <FilterDropdown
                  label="Rating"
                  options={filters.rating}
                  value={activeFilters.rating || ''}
                  onChange={(value) => onFilterChange('rating', value)}
                  placeholder="All Ratings"
                />
              </div>
            )}

            {/* Product Filter */}
            {filters.product && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                <FilterDropdown
                  label="Product"
                  options={filters.product}
                  value={activeFilters.product || ''}
                  onChange={(value) => onFilterChange('product', value)}
                  placeholder="All Products"
                />
              </div>
            )}

            {/* Category Filter */}
            {filters.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <FilterDropdown
                  label="Category"
                  options={filters.category}
                  value={activeFilters.category || ''}
                  onChange={(value) => onFilterChange('category', value)}
                  placeholder="All Categories"
                />
              </div>
            )}
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  onClearFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-lg border border-gray-200">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Filter size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {isMobileFiltersOpen && <MobileFilterPanel />}
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
            Clear Filters ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="flex-1 relative max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>

        {/* Desktop Filters */}
        <div className="flex items-center gap-3">
          {filters.rating && (
            <FilterDropdown
              label="Rating"
              options={filters.rating}
              value={activeFilters.rating || ''}
              onChange={(value) => onFilterChange('rating', value)}
              placeholder="All Ratings"
            />
          )}

          {filters.product && (
            <FilterDropdown
              label="Product"
              options={filters.product}
              value={activeFilters.product || ''}
              onChange={(value) => onFilterChange('product', value)}
              placeholder="All Products"
            />
          )}

          {filters.category && (
            <FilterDropdown
              label="Category"
              options={filters.category}
              value={activeFilters.category || ''}
              onChange={(value) => onFilterChange('category', value)}
              placeholder="All Categories"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalFilterHeader;

'use client';
import { Search, Filter, X, ChevronDown, FileText, Video, Image } from 'lucide-react';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/brands/use-mobile';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProfessionalContentFilterProps {
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

const types: FilterOption[] = [
  { value: 'All Types', label: 'All Types', icon: <FileText size={16} className="text-gray-500" /> },
  { value: 'Article', label: 'Article', icon: <FileText size={16} className="text-blue-500" /> },
  { value: 'Video', label: 'Video', icon: <Video size={16} className="text-red-500" /> },
];

const ProfessionalContentFilter: React.FC<ProfessionalContentFilterProps> = ({
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  const categoryOptions: FilterOption[] = [
    { value: 'All Categories', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: cat })),
  ];

  const activeFilterCount = [selectedType !== 'All Types' ? selectedType : '', selectedCategory !== 'All Categories' ? selectedCategory : ''].filter(Boolean).length;

  const FilterDropdown: React.FC<{
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
  }> = ({ label, options, value, onChange, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px] shadow-sm"
        >
          <span className="truncate flex items-center gap-1">
            {value ? (
              <>
                {options.find(opt => opt.value === value)?.icon}
                {options.find(opt => opt.value === value)?.label}
              </>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown size={16} className="text-gray-400 flex-shrink-0 transition-transform duration-200" />
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
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                    value === option.value ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option.icon}
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <FilterDropdown
                label="Type"
                options={types}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="All Types"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <FilterDropdown
                label="Category"
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedType('All Types');
                  setSelectedCategory('All Categories');
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
        {/* Mobile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-600 text-purple-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Filter size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Count */}
          <div className="mt-3 text-sm text-gray-600">
            Showing {count} contents
          </div>
        </div>

        {isMobileFiltersOpen && <MobileFilterPanel />}
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-purple-600 text-purple-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              setSelectedType('All Types');
              setSelectedCategory('All Categories');
            }}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>

        {/* Desktop Filters */}
        <div className="flex items-center gap-3">
          <FilterDropdown
            label="Type"
            options={types}
            value={selectedType}
            onChange={setSelectedType}
            placeholder="All Types"
          />

          <FilterDropdown
            label="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="All Categories"
          />
        </div>
      </div>

      {/* Count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {count} contents
      </div>
    </div>
  );
};

export default ProfessionalContentFilter;

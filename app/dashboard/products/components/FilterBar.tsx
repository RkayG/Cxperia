// src/components/ProductDashboard/FilterBar.tsx
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
//import UnfinishedWorkModal from '../../../components/UnfinishedWorkModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import type { FilterBarProps } from './productTypes';

interface FilterBarPropsWithLoading extends FilterBarProps {
  isLoading?: boolean;
}

const FilterBar: React.FC<FilterBarPropsWithLoading> = ({ onFilterChange, onSortChange, isLoading = false }) => {
  // State for dropdowns
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  // Options for dropdowns
  const filterOptions = ['All', 'Active QR Codes', 'Pending QR Codes'];
  const sortOptions = ['Sort By', 'None', 'Name', 'Added Date'];


  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex flex-row gap-3">
          {/* Filter skeleton */}
          <Skeleton className="w-48 h-10 rounded-xl" />
          {/* Sort skeleton */}
          <Skeleton className="w-48 h-10 rounded-xl" />
        </div>
        {/* Add button skeleton */}
        <Skeleton className="w-full sm:w-32 h-10 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex flex-row gap-3 w-full sm:w-auto">
        {/* Filter Products DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-1/2 sm:w-48 px-3 py-2 bg-white border border-gray-300 rounded-lg text-left text-gray-700 font-medium flex items-center justify-between hover:border-gray-400 transition-colors">
              {selectedFilter || 'Filter Products'}
              <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 z-50 bg-white border border-gray-200 shadow-lg">
            {filterOptions.map(option => (
              <DropdownMenuItem
                key={option}
                onClick={() => {
                  setSelectedFilter(option);
                  onFilterChange(option === 'All' ? '' : option);
                }}
                className={selectedFilter === option ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-50'}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-1/2 sm:w-48 px-3 py-2 bg-white border border-gray-300 rounded-lg text-left text-gray-700 font-medium flex items-center justify-between hover:border-gray-400 transition-colors">
              {selectedSort || 'Sort By'}
              <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-white border border-gray-200 shadow-lg z-50">
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option}
                onClick={() => {
                  setSelectedSort(option);
                  onSortChange(option === 'Sort By' ? '' : option);
                }}
                className={selectedSort === option ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-50'}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add New Product Button */}
      <Link href="/dashboard/experience/create?step=product-details&new=true">
      <button
        
        className="flex items-center text-purple-700 hover:text-purple-800 font-medium text-sm transition-colors duration-200 whitespace-nowrap"
      >
        <Plus size={16} className="mr-1" />
        Add New
      </button>
      </Link>
    </div>
  );
};

export default FilterBar;

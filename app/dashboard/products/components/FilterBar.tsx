// src/components/ProductDashboard/FilterBar.tsx
import React, { useState } from 'react';
//import UnfinishedWorkModal from '../../../components/UnfinishedWorkModal';
import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import type { FilterBarProps } from './productTypes';
import { useRouter } from 'next/navigation';

interface FilterBarPropsWithLoading extends FilterBarProps {
  isLoading?: boolean;
}

const FilterBar: React.FC<FilterBarPropsWithLoading> = ({ onFilterChange, onSortChange, isLoading = false }) => {
  // State for dropdowns
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  const router = useRouter();
  // Options for dropdowns
  const filterOptions = ['All', 'Active QR Codes', 'Pending QR Codes'];
  const sortOptions = ['Sort By', 'None', 'Name', 'Added Date'];

  // Handler for Add New Product button
  const handleAddNewProduct = () => {
    router.push('/dashboard/experience/create?step=product-details&new=true');
  };


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
      <div className="flex flex-row gap-3 ">

        {/* Filter Products DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-48 px-2 py-2 bg-white border border-gray-300 rounded-xl text-left text-gray-700 font-medium flex items-center justify-between">
              {selectedFilter || 'Filter Products'}
              <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 z-50 bg-white border-0">
            {filterOptions.map(option => (
              <DropdownMenuItem
                key={option}
                onClick={() => {
                  setSelectedFilter(option);
                  onFilterChange(option === 'All' ? '' : option);
                }}
                className={selectedFilter === option ? 'bg-purple-100 text-purple-800' : ''}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className=" sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-xl text-left text-gray-700 font-medium flex items-center justify-between">
              {selectedSort || 'Sort By'}
              <svg className="ml-2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-white z-50 border-0">
            {sortOptions.map(option => (
              <DropdownMenuItem
                key={option}
                onClick={() => {
                  setSelectedSort(option);
                  onSortChange(option === 'Sort By' ? '' : option);
                }}
                className={selectedSort === option ? 'bg-purple-100 text-purple-800' : ''}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add New Product Button */}
      <button
        onClick={handleAddNewProduct}
        className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-purple-800 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-md"
      >
        <Plus size={20} className="mr-2" />
        Add New
      </button>
      
    </div>
  );
};

export default FilterBar;

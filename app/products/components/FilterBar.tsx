// src/components/ProductDashboard/FilterBar.tsx
import { Plus } from 'lucide-react';
import Link from 'next/link';
  
import React, { useState } from 'react';
//import UnfinishedWorkModal from '../../../components/UnfinishedWorkModal';
import type { FilterBarProps } from './productTypes';
import SimpleDropdown from '@/components/ui/simple-dropdown';

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSortChange }) => {
  // State for dropdowns
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  // Options for dropdowns
  const filterOptions = ['All', 'Active QR Codes', 'Pending QR Codes'];
  const sortOptions = ['Sort By', 'None', 'Name', 'Added Date'];




  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="flex flex-row gap-3 ">

        {/* Filter Products Dropdown */}
        <SimpleDropdown
          value={selectedFilter}
          onChange={(option) => {
            setSelectedFilter(option);
            onFilterChange(option === 'All' ? '' : option);
          }}
          options={filterOptions}
          placeholder="Filter Products"
          className="w-48"
        />

        {/* Sort By Dropdown */}
        <SimpleDropdown
          value={selectedSort}
          onChange={(option) => {
            setSelectedSort(option);
            onSortChange(option === 'Sort By' ? '' : option);
          }}
          options={sortOptions}
          placeholder="Sort By"
          className="sm:w-48"
        />
      </div>

      {/* Add New Product Button */}
      <Link href="/dashboard/experience/create?step=product-details&new=true">
      <button
        className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-purple-800 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-md"
      >
        <Plus size={20} className="mr-2" />
        Add New Product
      </button>
      </Link>
      
    </div>
  );
};

export default FilterBar;

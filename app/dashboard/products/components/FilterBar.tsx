// src/components/ProductDashboard/FilterBar.tsx
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
//import UnfinishedWorkModal from '../../../components/UnfinishedWorkModal';
import { Skeleton } from '@/components/ui/skeleton';
import SimpleDropdown from '@/components/ui/simple-dropdown';
import type { FilterBarProps } from './productTypes';

interface FilterBarPropsWithLoading extends FilterBarProps {
  isLoading?: boolean;
}

const FilterBar: React.FC<FilterBarPropsWithLoading> = ({ onFilterChange, onSortChange, onAddNewProduct, isLoading = false }) => {
  // State for dropdowns
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedSort, setSelectedSort] = useState('');
  
  // Options for dropdowns
  /** Filter Options: All, Active QR Codes, Pending QR Codes */
  const filterOptions = ['Tous', 'Codes QR actifs', 'Codes QR en attente'];
  /** Sort Options: Sort By, None, Name, Added Date */
  const sortOptions = ['Trier par', 'Aucun', 'Nom', 'Date d\'ajout'];

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
        {/* Filter Products Dropdown */}
        <div className="w-1/2 sm:w-48">
          <SimpleDropdown
            value={selectedFilter}
            onChange={(value) => {
              setSelectedFilter(value);
              onFilterChange(value === 'Tous' ? '' : value);
            }}
            options={filterOptions}
            placeholder="Filtrer les produits"
            className="w-full"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="w-1/2 sm:w-48">
          <SimpleDropdown
            value={selectedSort}
            onChange={(value) => {
              setSelectedSort(value);
              onSortChange(value === 'Trier par' ? '' : value);
            }}
            options={sortOptions}
            placeholder="Trier par"
            className="w-full"
          />
        </div>
      </div>

      {/* Add New Product Button */}
      <Link href="/dashboard/experience/create?step=product-details&new=true">
        <button className="flex items-center text-purple-700 hover:text-purple-800 font-medium text-sm transition-colors duration-200 whitespace-nowrap">
          <Plus size={16} className="mr-1" />
          Ajouter un nouveau
        </button>
      </Link>
    </div>
  );
};

export default FilterBar;
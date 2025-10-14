'use client';
import { Search, Filter, X, ChevronDown, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/brands/use-mobile';

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ProfessionalInboxHeaderProps {
  onSearch: (query: string) => void;
  productOptions: string[];
  searchPlaceholder?: string;
}

const ProfessionalInboxHeader: React.FC<ProfessionalInboxHeaderProps> = ({
  onSearch,
  productOptions,
  searchPlaceholder = "Rechercher des commentaires..." // Search feedback
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  const ratingOptions: FilterOption[] = [
    { value: '', label: 'Toutes les notes' },
    { value: '1', label: 'Mauvais', icon: <Star size={14} className="text-red-500 fill-current" /> },
    { value: '2', label: 'Moyen', icon: <Star size={14} className="text-orange-500 fill-current" /> },
    { value: '3', label: 'Bon', icon: <Star size={14} className="text-yellow-500 fill-current" /> },
    { value: '4', label: 'Très bon', icon: <Star size={14} className="text-blue-500 fill-current" /> },
    { value: '5', label: 'Excellent', icon: <Star size={14} className="text-green-500 fill-current" /> },
  ];

  const productFilterOptions: FilterOption[] = [
    { value: '', label: 'Tous les produits' },
    ...productOptions.filter(opt => opt).map(opt => ({ value: opt, label: opt })),
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Send combined filters as JSON
    const filters = {
      searchQuery: value,
      rating: selectedRating,
      product: selectedProduct,
    };
    onSearch(JSON.stringify(filters));
  };

  const handleFilterChange = (filterType: 'rating' | 'product', value: string) => {
    if (filterType === 'rating') {
      setSelectedRating(value);
    } else if (filterType === 'product') {
      setSelectedProduct(value);
    }
    
    // Send combined filters as JSON
    const filters = {
      searchQuery: searchQuery,
      rating: filterType === 'rating' ? value : selectedRating,
      product: filterType === 'product' ? value : selectedProduct,
    };
    onSearch(JSON.stringify(filters));
  };

  const activeFilterCount = [selectedRating, selectedProduct].filter(Boolean).length;

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
          className="flex justify-between items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 text-sm font-medium text-gray-700 min-w-[140px] md:min-w-[220px] shadow-sm"
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
          <ChevronDown size={16} className="text-gray-400  flex-shrink-0 transition-transform duration-200" />
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
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
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
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
               <FilterDropdown
                 label="Rating"
                 options={ratingOptions}
                 value={selectedRating}
                 onChange={(value) => handleFilterChange('rating', value)}
                 placeholder="Toutes les notes"
               />
             </div>

            {/* Product Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Produit</label>
              <FilterDropdown
                label="Produit"
                options={productFilterOptions}
                value={selectedProduct}
                onChange={(value) => handleFilterChange('product', value)}
                placeholder="Tous les produits"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
               <button
                 onClick={() => {
                   setSelectedRating('');
                   setSelectedProduct('');
                   setIsMobileFiltersOpen(false);
                   // Send updated filters
                   const filters = {
                     searchQuery: searchQuery,
                     rating: '',
                     product: '',
                   };
                   onSearch(JSON.stringify(filters));
                 }}
                 className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
               >
                 Effacer tous les filtres
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
        <div className="flex items-center gap-3 mb-6 p-4 bg-white z-500 rounded-xl border border-gray-200 shadow-sm">
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

        {isMobileFiltersOpen && <MobileFilterPanel />}
      </>
    );
  }

  return (
    <div className="bg-white z-500 rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtrer et rechercher</h3>
        {activeFilterCount > 0 && (
           <button
             onClick={() => {
               setSelectedRating('');
               setSelectedProduct('');
               // Send updated filters
               const filters = {
                 searchQuery: searchQuery,
                 rating: '',
                 product: '',
               };
               onSearch(JSON.stringify(filters));
             }}
             className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <X size={16} />
             Effacer les filtres ({activeFilterCount})
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
           <FilterDropdown
             label="Rating"
             options={ratingOptions}
             value={selectedRating}
             onChange={(value) => handleFilterChange('rating', value)}
             placeholder="Toutes les notes"
           />

           <FilterDropdown
             label="Product"
             options={productFilterOptions}
             value={selectedProduct}
             onChange={(value) => handleFilterChange('product', value)}
             placeholder="Tous les produits"
           />
         </div>
      </div>
    </div>
  );
};

export default ProfessionalInboxHeader;

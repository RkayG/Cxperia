// src/components/Inbox/InboxHeader.tsx
'use client';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import DropdownSelect from '@/components/DropdownSelect';
import type { InboxHeaderProps } from './inboxTypes';


const ratingOptions = [
  '', // for "All"
  'Mauvais', // Poor 
  'Moyen', // Fair 
  'Bon', // Good 
  'Très bon', // Great 
  'Excellent', // Excellent 
];

interface InboxHeaderPropsExtended extends InboxHeaderProps {
  productOptions?: string[];
  categoryOptions?: string[];
}

const InboxHeader: React.FC<InboxHeaderPropsExtended> = ({ 
  onSearch, 
  productOptions = [''], 
  categoryOptions = [''] 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rating, setRating] = useState('');
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState('');

  // Call onSearch with a combined query string or object (adapt as needed)
  const triggerSearch = (next?: Partial<{searchQuery: string; rating: string; product: string; category: string;}>) => {
    const q = {
      searchQuery: next?.searchQuery ?? searchQuery,
      rating: next?.rating ?? rating,
      product: next?.product ?? product,
      category: next?.category ?? category,
    };
    // You may want to pass an object instead
    onSearch(JSON.stringify(q));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    triggerSearch({ searchQuery: e.target.value });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4  gap-4">
      <div className="flex flex-col sm:flex-row gap-2 flex-1">
        <div className="relative flex-1 min-w-[180px] mr-3">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          {/* Search message */}
          <input
            type="text"
            placeholder="Rechercher un message" 
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>
        {/* All Ratings */}
        <DropdownSelect
          value={rating}
          onChange={val => { setRating(val); triggerSearch({ rating: val }); }}
          options={ratingOptions}
          placeholder="Tous les avis" 
          className="min-w-[140px]"
        />
        {/* All Products */}
        <DropdownSelect
          value={product}
          onChange={val => { setProduct(val); triggerSearch({ product: val }); }}
          options={productOptions}
          placeholder="Tous les produits" 
          className="min-w-[140px]"
        />
        {/* All Categories */}
        <DropdownSelect
          value={category}
          onChange={val => { setCategory(val); triggerSearch({ category: val }); }}
          options={categoryOptions}
          placeholder="Toutes les catégories" 
          className="min-w-[140px]"
        />
      </div>
    </div>
  );
};

export default InboxHeader;

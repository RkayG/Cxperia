import { Search } from 'lucide-react';
import React from 'react';
import SimpleDropdown from '@/components/ui/simple-dropdown';


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
  { id: 'all', label: 'Tous les contenus' },
  { id: 'published', label: 'Publiés' },
  { id: 'draft', label: 'Brouillons' },
];

const categories = [
  'Soins de la peau',
  'Nettoyant',
  'Sérum',
  'Tonique',
  'Hydratant',
  'Écran solaire',
  'Masque',
  'Soins des yeux',
  'Autre',
];
const types = [
  'Tous les types',
  'Article',
  'Vidéo',
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
            placeholder="Rechercher du contenu..."
            className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Type Dropdown */}
        <div className="relative w-full sm:w-40">
          <SimpleDropdown
            value={selectedType}
            onChange={setSelectedType}
            options={types}
            placeholder="Tous les types"
            className="text-sm"
          />
        </div>
        {/* Category Dropdown */}
        <div className="relative w-full sm:w-48">
          <SimpleDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={["Toutes les catégories", ...categories]}
            placeholder="Toutes les catégories"
            className="text-sm"
          />
        </div>
      </div>

      {/* Article Count and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mt-4 sm:mt-0">
        <span>Affichage de {count} contenus</span>
        
      </div>
    </div>
  );
};

export default ContentDashboardFilter;

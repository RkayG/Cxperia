import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { useIsMobile } from '@/hooks/brands/use-mobile';

const ContentDashboardHeader: React.FC = () => {

  const isMobile = useIsMobile();
  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl  font-bold text-gray-800">Contenu</h1>
          <Link href="/dashboard/content/tutorial?mode=create">
          <button
            className="flex items-center text-purple-700 hover:text-purple-800 font-medium text-sm transition-colors duration-200"
           
          >
            <Plus size={16} className="mr-1" />
            {isMobile ? 'Nouveau' : 'Nouveau contenu'}
          </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ContentDashboardHeader;

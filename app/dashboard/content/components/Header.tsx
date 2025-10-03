import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useIsMobile } from '@/hooks/brands/use-mobile';

const ContentDashboardHeader: React.FC = () => {
  const router = useRouter();
  // Handler for New Content button
  const handleNewContent = () => {
       router.push('/dashboard/content/tutorial?mode=create');
  };
  const isMobile = useIsMobile();
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-50 border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Content</h1>
          <button
            className="flex items-center text-purple-700 hover:text-purple-800 font-medium text-sm transition-colors duration-200"
            onClick={handleNewContent}
          >
            <Plus size={16} className="mr-1" />
            {isMobile ? 'New' : 'New Content'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default ContentDashboardHeader;

import { useRouter } from 'next/navigation';
import React from 'react';

const ContentDashboardHeader: React.FC = () => {
  const router = useRouter();
  // Handler for New Content button
  const handleNewContent = () => {
       router.push('/tutorial?mode=create');
  };

  return (
    <>
      <header className="relative lg:top-0 left-0 w-full z-30 flex items-center bg-gray-50 justify-between p-4 sm:p-6  h-20" >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Content</h1>
        <button
          className="flex items-center px-4 py-2 bg-purple-800 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors text-sm sm:text-base"
          onClick={handleNewContent}
        >
          {/* Placeholder for Plus icon if not using LucideReact in this component */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Content
        </button>
      </header>

    
    </>
  );
};

export default ContentDashboardHeader;

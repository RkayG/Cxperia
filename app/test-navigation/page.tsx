'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useNavigationProgressContext } from '@/contexts/NavigationProgressContext';

const TestNavigationPage: React.FC = () => {
  const router = useRouter();
  const { startLoading, finishLoading, updateProgress, stopLoading } = useNavigationProgressContext();

  const simulateLoading = async () => {
    startLoading();
    
    // Simulate progress updates
    for (let i = 0; i <= 100; i += 10) {
      updateProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    finishLoading();
  };

  const simulateError = () => {
    startLoading();
    updateProgress(50);
    setTimeout(() => {
      stopLoading();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Navigation Progress Test
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={simulateLoading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Simulate Successful Loading
          </button>
          
          <button
            onClick={simulateError}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Simulate Loading Error
          </button>
          
          <button
            onClick={() => router.push('/dashboard/products')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Navigate to Products (Auto Progress)
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">How it works:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• The progress bar appears automatically on route changes</li>
            <li>• You can manually control it with the context hooks</li>
            <li>• It shows a beautiful shimmer animation</li>
            <li>• It automatically hides when loading completes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestNavigationPage;

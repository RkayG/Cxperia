'use client';
import { RefreshCw } from 'lucide-react';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigationProgressWithQuery } from '@/hooks/useNavigationProgressWithQuery';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { 
  useFeedbackMessages, 
  useFeedbackLoading, 
  useFeedbackError, 
  useFeedbackActions,
  useFilteredMessages,
  useProductOptions
} from '@/store/feedback/useFeedbackStore';
import ProfessionalInboxHeader from './components/ProfessionalInboxHeader';
import MessageList from './components/MessageList';
import { useIsMobile } from '@/hooks/brands/use-mobile';

const FeedbackPage: React.FC = () => {
  // Add render tracking
  
  const isMobile = useIsMobile();
  
  // Get brand from store
  const brand = useExperienceStore((state) => state.brand);
  const brandId = brand?.id;

  // Subscribe to store state (no hooks, pure subscription)
  const messages = useFeedbackMessages();
  const isLoading = useFeedbackLoading();
  const error = useFeedbackError();
  
  // Use navigation progress with loading state
  useNavigationProgressWithQuery(isLoading, !!error);
  const filteredMessages = useFilteredMessages();
  const productOptions = useProductOptions();
  
  // Get actions from store
  const { fetchFeedbacks, setSearchQuery, markAsRead, clearError } = useFeedbackActions();

  // Initialize data fetching
  useEffect(() => {
    if (brandId) {
      fetchFeedbacks(brandId);
    }
  }, [brandId, fetchFeedbacks]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!brandId) return;
    
    const interval = setInterval(() => {
      fetchFeedbacks(brandId);
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [brandId, fetchFeedbacks]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    if (brandId) {
      fetchFeedbacks(brandId);
    }
  };

  const handleSelectMessage = (id: string) => {
    markAsRead(id);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <h2 className="text-2xl text-left font-bold text-gray-900 mb-2 tracking-tight">Commentaires</h2>
        <p className="text-left text-gray-600 mb-6 max-w-2xl">
          Surveillez et analysez les commentaires des clients pour vos produits cosmétiques
        </p>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start p-4 border-b border-gray-200 mb-3">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-7 w-7 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="w-2.5 h-2.5 rounded-full ml-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-left font-bold text-gray-900 tracking-tight">Commentaires</h2>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 transition-colors hover:text-blue-700"
            title="Réessayer de charger les commentaires"
          >
            <RefreshCw size={16} />
            {isMobile ? '' : 'Réessayer'}
          </button>
        </div>
        
        {/* Professional Error State */}
        <div className="max-w-2xl mx-auto">
          <div className="p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            {/* Error Message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Impossible de charger les commentaires
            </h3>
           
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <RefreshCw size={16} className="mr-2" />
                Réessayer
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Actualiser la page
              </button>
            </div>
            
            {/* Help Text */}
           
          </div>
      
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-left font-bold text-gray-900 tracking-tight">Commentaires</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Actualiser les commentaires"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isMobile ? '' : 'Actualiser'}
        </button>
      </div>
      <p className="text-left text-gray-600 mb-6 max-w-2xl">
        Surveillez et analysez les commentaires des clients pour vos produits cosmétiques ({messages.length} total)
      </p>
      
      {/* Professional Inbox Header with Search and Filters */}
      <ProfessionalInboxHeader onSearch={handleSearch} productOptions={productOptions} />
      <MessageList messages={filteredMessages} onSelectMessage={handleSelectMessage} />
    </div>
  );
};

export default FeedbackPage;

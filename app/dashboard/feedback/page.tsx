'use client';
import { RefreshCw } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeedbacks } from '@/hooks/brands/useFeedbackApi';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import ProfessionalInboxHeader from './components/ProfessionalInboxHeader';
import type { Message } from './components/inboxTypes';
import MessageList from './components/MessageList';
import { useIsMobile }   from '@/hooks/brands/use-mobile';

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

const InboxPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();
  // Get brand from store
  const brand = useExperienceStore((state) => state.brand);
  const brandId = brand?.id;

  // Fetch real feedback data
  const { data: feedbacksData, isLoading, error, refetch } = useFeedbacks(brandId);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!brandId) return;
    
    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [brandId, refetch]);

  // Transform feedback data to Message format
  const messages: Message[] = useMemo(() => {
    const data = feedbacksData as any;
    if (!data || !data.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data.map((feedback: any) => {
      // Generate avatar with initials
      const customerName = feedback.customer_name || 'Anonymous';
      const initials = customerName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
      const avatarColors = [
        'FFDDC1/8B4513', 'CCE0FF/000080', 'D4EDDA/28A745', 
        'FFD8D8/FF0000', 'E6E6FA/4B0082', 'FFF2CC/DAA520'
      ];
      const colorIndex = feedback.id?.charCodeAt(0) % avatarColors.length || 0;
      
      // Format time
      const timeAgo = formatTimeAgo(feedback.created_at);
      
      // Get product name from experience
      const productName = feedback.experiences?.products?.name || 'Product';

      return {
        id: feedback.id,
        subject: `Feedback for ${productName}`,
        sender: {
          name: customerName,
          avatar: `https://placehold.co/40x40/${avatarColors[colorIndex]}?text=${initials}`
        },
        preview: feedback.comment || 'No comment provided',
        time: timeAgo,
        read: readMessages.has(feedback.id),
        rating: feedback.overall_rating || 5,
        images: feedback.images || [],
        productName: productName,
        experienceId: feedback.experience_id,
      };
    });
  }, [feedbacksData, readMessages]);

  // Extract unique product names for filtering
  const productOptions = useMemo(() => {
    const products = new Set(['']); // Start with empty option for "All Products"
    messages.forEach(message => {
      if (message.productName) {
        products.add(message.productName);
      }
    });
    return Array.from(products);
  }, [messages]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSelectMessage = (id: string) => {
    console.log(`Feedback with ID ${id} selected.`);
    // Mark as read
    setReadMessages(prev => new Set([...prev, id]));
  };

  const filteredMessages = useMemo(() => {
    if (!searchQuery) {
      return messages;
    }
    
    // Parse search query if it's JSON (from filters)
    let filters: any = {};
    try {
      filters = JSON.parse(searchQuery);
      console.log('Applied filters:', filters); // Debug log
    } catch {
      // If not JSON, treat as simple text search
      const lowerCaseQuery = searchQuery.toLowerCase();
      return messages.filter(
        (message) =>
          message.subject.toLowerCase().includes(lowerCaseQuery) ||
          message.sender.name.toLowerCase().includes(lowerCaseQuery) ||
          message.preview.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply filters
    return messages.filter((message) => {
      const { searchQuery: textQuery, rating, product } = filters;
      
      // Text search
      if (textQuery) {
        const lowerCaseQuery = textQuery.toLowerCase();
        const matchesText = 
          message.subject.toLowerCase().includes(lowerCaseQuery) ||
          message.sender.name.toLowerCase().includes(lowerCaseQuery) ||
          message.preview.toLowerCase().includes(lowerCaseQuery);
        if (!matchesText) return false;
      }
      
      // Rating filter
      if (rating) {
        let expectedRating;
        if (rating.match(/^\d+$/)) {
          // If rating is a number (e.g., "1", "2", "3")
          expectedRating = parseInt(rating);
        } else {
          // If rating is a label (e.g., "Poor", "Fair")
          const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];
          expectedRating = ratingLabels.indexOf(rating) + 1;
        }
        console.log(`Rating filter: looking for ${expectedRating}, message has ${message.rating}`); // Debug log
        if (message.rating !== expectedRating) return false;
      }
      
      // Product filter
      if (product && message.productName !== product) {
        return false;
      }
      
      return true;
    });
  }, [messages, searchQuery]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <h2 className="text-2xl text-left  font-bold text-gray-900 mb-2 tracking-tight">Customer Feedbacks</h2>
        <p className="text-left text-gray-600 mb-6 max-w-2xl">
          Monitor and analyze customer reviews for your cosmetic products
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
          <h2 className="text-2xl text-left font-bold text-gray-900 tracking-tight">Customer Feedbacks</h2>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 transition-colors hover:text-blue-700"
            title="Retry loading feedbacks"
          >
            <RefreshCw size={16} />
            {isMobile ? '' : 'Retry'}
          </button>
        </div>
        
        {/* Professional Error State */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            {/* Error Message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Unable to Load Customer Feedbacks
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're having trouble retrieving your customer feedback data. This could be due to a temporary network issue or server problem.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
            
            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If the problem persists, please check your internet connection or contact support.
              </p>
            </div>
          </div>
          
          {/* Additional Help Section */}
          <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h4 className="text-lg font-medium text-blue-900 mb-3">Need Help?</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Ensure you have an active internet connection</p>
              <p>• Try refreshing the page</p>
              {/* <p>• Check if other parts of the dashboard are working</p>
              
              <p>• Contact support if the issue continues</p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 ">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-left  font-bold text-gray-900 tracking-tight">Customer Feedbacks</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2  text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh feedbacks"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          {isMobile ? '' : 'Refresh'}
        </button>
      </div>
      <p className="text-left text-gray-600 mb-6 max-w-2xl">
        Monitor and analyze customer reviews for your cosmetic products ({messages.length} total)
      </p>
      
      {/* Professional Inbox Header with Search and Filters */}
      <ProfessionalInboxHeader onSearch={handleSearch} productOptions={productOptions} />
      <MessageList messages={filteredMessages} onSelectMessage={handleSelectMessage} />
    </div>
  );
};

export default InboxPage;

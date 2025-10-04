import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useFeedbacks } from '@/hooks/brands/useFeedbackApi';

export interface Message {
  id: string;
  subject: string;
  sender: {
    name: string;
    avatar: string;
  };
  preview: string;
  time: string;
  read: boolean;
  rating: number;
  images: string[];
  productName: string;
  experienceId: string;
}

interface FeedbackState {
  // Data
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  // UI State
  searchQuery: string;
  readMessages: Set<string>;
  
  // Actions
  fetchFeedbacks: (brandId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  markAsRead: (messageId: string) => void;
  markAllAsRead: () => void;
  clearError: () => void;
}

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

// Data transformation function
const transformFeedbackToMessage = (feedback: any, readMessages: Set<string>): Message => {
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
};

export const useFeedbackStore = create<FeedbackState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    messages: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    readMessages: new Set<string>(),

    // Actions
    fetchFeedbacks: async (brandId: string) => {
      if (!brandId) return;
      
      set({ isLoading: true, error: null });
      
      try {
        // Use the existing hook internally
        const { data: feedbacksData } = useFeedbacks(brandId);
        
        if (feedbacksData && feedbacksData.data && Array.isArray(feedbacksData.data)) {
          const { readMessages } = get();
          const messages = feedbacksData.data.map((feedback: any) => 
            transformFeedbackToMessage(feedback, readMessages)
          );
          
          set({ messages, isLoading: false });
        } else {
          set({ messages: [], isLoading: false });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch feedbacks',
          isLoading: false 
        });
      }
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    markAsRead: (messageId: string) => {
      const { readMessages } = get();
      const newReadMessages = new Set([...readMessages, messageId]);
      set({ readMessages: newReadMessages });
    },

    markAllAsRead: () => {
      const { messages } = get();
      const allMessageIds = new Set(messages.map(m => m.id));
      set({ readMessages: allMessageIds });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Selector hooks for specific data
export const useFeedbackMessages = () => useFeedbackStore(state => state.messages);
export const useFeedbackLoading = () => useFeedbackStore(state => state.isLoading);
export const useFeedbackError = () => useFeedbackStore(state => state.error);
export const useFeedbackSearchQuery = () => useFeedbackStore(state => state.searchQuery);
export const useFeedbackReadMessages = () => useFeedbackStore(state => state.readMessages);

// Action hooks
export const useFeedbackActions = () => useFeedbackStore(state => ({
  fetchFeedbacks: state.fetchFeedbacks,
  setSearchQuery: state.setSearchQuery,
  markAsRead: state.markAsRead,
  markAllAsRead: state.markAllAsRead,
  clearError: state.clearError,
}));

// Computed selectors
export const useFilteredMessages = () => {
  const messages = useFeedbackMessages();
  const searchQuery = useFeedbackSearchQuery();
  
  return useFeedbackStore(state => {
    if (!state.searchQuery) return state.messages;
    
    // Parse search query if it's JSON (from filters)
    let filters: any = {};
    try {
      filters = JSON.parse(state.searchQuery);
    } catch {
      // If not JSON, treat as simple text search
      const lowerCaseQuery = state.searchQuery.toLowerCase();
      return state.messages.filter(
        (message) =>
          message.subject.toLowerCase().includes(lowerCaseQuery) ||
          message.sender.name.toLowerCase().includes(lowerCaseQuery) ||
          message.preview.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Apply filters
    return state.messages.filter((message) => {
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
          expectedRating = parseInt(rating);
        } else {
          const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'];
          expectedRating = ratingLabels.indexOf(rating) + 1;
        }
        if (message.rating !== expectedRating) return false;
      }
      
      // Product filter
      if (product && message.productName !== product) {
        return false;
      }
      
      return true;
    });
  });
};

export const useProductOptions = () => {
  return useFeedbackStore(state => {
    const products = new Set(['']); // Start with empty option for "All Products"
    state.messages.forEach(message => {
      if (message.productName) {
        products.add(message.productName);
      }
    });
    return Array.from(products);
  });
};

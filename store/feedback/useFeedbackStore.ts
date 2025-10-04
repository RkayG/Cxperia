import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
  
  // Computed state (cached to prevent infinite loops)
  filteredMessages: Message[];
  productOptions: string[];
  
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

// Helper functions for computed state
const computeFilteredMessages = (messages: Message[], searchQuery: string): Message[] => {
  if (!searchQuery) return messages;
  
  // Parse search query if it's JSON (from filters)
  let filters: any = {};
  try {
    filters = JSON.parse(searchQuery);
  } catch {
    // If not JSON, treat as simple text search
    const lowerCaseQuery = searchQuery.toLowerCase();
    return messages.filter(
      (message) =>
        message.subject.toLowerCase().includes(lowerCaseQuery) ||
        message.sender.name.toLowerCase().includes(lowerCaseQuery) ||
        message.content.toLowerCase().includes(lowerCaseQuery) ||
        message.productName.toLowerCase().includes(lowerCaseQuery)
    );
  }

  return messages.filter((message) => {
    // Product filter
    if (filters.product && filters.product !== '' && message.productName !== filters.product) {
      return false;
    }
    return true;
  });
};

const computeProductOptions = (messages: Message[]): string[] => {
  const products = new Set(['']); // Start with empty option for "All Products"
  messages.forEach(message => {
    if (message.productName) {
      products.add(message.productName);
    }
  });
  return Array.from(products);
};

export const useFeedbackStore = create<FeedbackState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    messages: [],
    isLoading: false,
    error: null,
    searchQuery: '',
    readMessages: new Set<string>(),
    filteredMessages: [],
    productOptions: [''],

    // Actions
    fetchFeedbacks: async (brandId: string) => {
      console.log('📡 FeedbackStore: fetchFeedbacks called', { brandId, timestamp: new Date().toISOString() });
      
      if (!brandId) return;
      
      set({ isLoading: true, error: null });
      
      try {
        // Fetch data directly from API instead of using hooks
        const feedbacksResponse = await fetch(`/api/feedbacks?brand_id=${brandId}`);
        const feedbacksData = await feedbacksResponse.json();
        
        if (feedbacksData && feedbacksData.data && Array.isArray(feedbacksData.data)) {
          const { readMessages, searchQuery } = get();
          const messages = feedbacksData.data.map((feedback: any) => 
            transformFeedbackToMessage(feedback, readMessages)
          );
          
          const filteredMessages = computeFilteredMessages(messages, searchQuery);
          const productOptions = computeProductOptions(messages);
          
          set({ messages, filteredMessages, productOptions, isLoading: false });
        } else {
          set({ messages: [], filteredMessages: [], productOptions: [''], isLoading: false });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Failed to fetch feedbacks',
          isLoading: false 
        });
      }
    },

    setSearchQuery: (query: string) => {
      const { messages } = get();
      const filteredMessages = computeFilteredMessages(messages, query);
      set({ searchQuery: query, filteredMessages });
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

// Action hooks - individual selectors to prevent infinite loops
export const useFeedbackFetchFeedbacks = () => useFeedbackStore(state => state.fetchFeedbacks);
export const useFeedbackSetSearchQuery = () => useFeedbackStore(state => state.setSearchQuery);
export const useFeedbackMarkAsRead = () => useFeedbackStore(state => state.markAsRead);
export const useFeedbackMarkAllAsRead = () => useFeedbackStore(state => state.markAllAsRead);
export const useFeedbackClearError = () => useFeedbackStore(state => state.clearError);

export const useFeedbackActions = () => {
  const fetchFeedbacks = useFeedbackFetchFeedbacks();
  const setSearchQuery = useFeedbackSetSearchQuery();
  const markAsRead = useFeedbackMarkAsRead();
  const markAllAsRead = useFeedbackMarkAllAsRead();
  const clearError = useFeedbackClearError();
  
  return {
    fetchFeedbacks,
    setSearchQuery,
    markAsRead,
    markAllAsRead,
    clearError,
  };
};

// Computed selectors - now using cached values from store
export const useFilteredMessages = () => useFeedbackStore(state => state.filteredMessages);
export const useProductOptions = () => useFeedbackStore(state => state.productOptions);

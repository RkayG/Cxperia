import {  useMutation,  } from '@tanstack/react-query';
import config from '@/config/api';
const endpoint = config.endpoints

// Public feedback submission (for customers)
export function useCreatePublicFeedback(slug: string) {
    return useMutation({
      mutationFn: async (feedbackData: {
        customer_name?: string;
        customer_email?: string;
        overall_rating?: number;
        product_rating?: number;
        packaging_rating?: number;
        delivery_rating?: number;
        comment?: string;
        images?: string[];
      }) => {
        const response = await fetch(endpoint.PUBLIC.FEEDBACK.CREATE(slug), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          
          // Handle rate limiting specifically
          if (response.status === 429) {
            const retryAfter = (errorData as any).retryAfter;
            const retryMinutes = retryAfter ? Math.ceil(retryAfter / 60) : 15;
            throw new Error(`Too many feedback submissions. Please wait ${retryMinutes} minutes before trying again.`);
          }
          
          // Handle other errors
          throw new Error((errorData as any).error || 'Failed to submit feedback');
        }
  
        return await response.json();
      },
    });
  }
  
  // Public image upload (for customers)
  export function usePublicImageUpload() {
    return useMutation({
      mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'customer_feedback');
  
        const response = await fetch(endpoint.PUBLIC.UPLOAD.IMAGE, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error((errorData as any).error || 'Failed to upload image');
        }
  
        return await response.json();
      },
    });
  }
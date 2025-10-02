// src/App.tsx
'use client'
import { useParams } from 'next/navigation';
import React, { useRef, useState } from 'react';

// INTERNAL IMPORTS
import CurvedBottomNav from '@/components/public/CurvedBottomNav';
import SectionHeader from '@/components/public/ThemeAwareSectionHeader';
import { useCreatePublicFeedback } from '@/hooks/public/usePublicFeedbackApi';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import { showToast } from '@/utils/toast';
import FeedbackForm from './components/FeedbackForm';
import ImageUpload from './components/ImageUpload';
import RatingSection from './components/RatingSection';
import ThankYouModal from './components/ThankYouModal';
import PublicLoading from '../components/PublicLoading';

const FeedbackPage: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;
  const feedbackFormRef = useRef<HTMLTextAreaElement>(null);
  const { color, isLoading } = usePublicExpStore();
  const createFeedbackMutation = useCreatePublicFeedback(slug);
  
  // Form state
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  // Modal state
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  
  // Smooth scroll utility function
  const smoothScrollToElement = (element: HTMLElement) => {
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
    
    // Check if browser supports smooth scrolling
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsNativeSmoothScroll) {
      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      });
    } else {
      // Fallback: Custom smooth scroll animation for older browsers
      const startPosition = window.pageYOffset;
      const distance = middle - startPosition;
      const duration = 800; // 800ms duration
      let start: number | null = null;
      
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        // Easing function for smooth animation
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        const easedPercentage = easeInOutCubic(percentage);
        
        window.scrollTo(0, startPosition + distance * easedPercentage);
        
        if (progress < duration) {
          requestAnimationFrame(step);
        }
      };
      
      requestAnimationFrame(step);
    }
  };

  // Callback to scroll and focus feedback form
  const handleRatingSelected = (selectedRating: number) => {
    setRating(selectedRating);
    
    // Use setTimeout to ensure the rating state is updated first
    setTimeout(() => {
      if (feedbackFormRef.current) {
        // Use our custom smooth scroll function
        smoothScrollToElement(feedbackFormRef.current);
        
        // Focus after scroll completes
        setTimeout(() => {
          if (feedbackFormRef.current) {
            feedbackFormRef.current.focus();
          }
        }, 600); // Increased delay to ensure scroll completes
      }
    }, 150); // Slightly longer delay for state update
  };

  const handleSubmit = async () => {
    if (!slug) {
      showToast.error('Experience not found');
      return;
    }

    // Enhanced validation - require at least one meaningful input
    const hasRating = rating !== null && rating > 0;
    const hasComment = feedback.trim().length > 0;
    const hasName = customerName.trim().length > 0;
    const hasEmail = customerEmail.trim().length > 0;
    const hasImages = images.length > 0;

    // Check if user provided any meaningful feedback
    if (!hasRating && !hasComment && !hasImages) {
      showToast.error('Please provide a rating, comment, or upload an image to submit feedback');
      
      // Focus on the first empty required field
      if (!hasRating) {
        // Scroll to rating section
        const ratingSection = document.querySelector('[data-rating-section]');
        if (ratingSection) {
          ratingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (!hasComment && feedbackFormRef.current) {
        // Focus on feedback textarea
        smoothScrollToElement(feedbackFormRef.current);
        setTimeout(() => {
          feedbackFormRef.current?.focus();
        }, 600);
      }
      return;
    }

    // Optional: Warn if only minimal feedback is provided
    if (hasRating && !hasComment && !hasImages && !hasName && !hasEmail) {
      // User only provided a rating - that's okay, but we could encourage more feedback
      console.log('User provided minimal feedback (rating only)');
    }

    try {
      const result = await createFeedbackMutation.mutateAsync({
        customer_name: customerName.trim() || undefined,
        customer_email: customerEmail.trim() || undefined,
        overall_rating: rating || undefined,
        comment: feedback.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      });

      // Show thank you modal instead of toast
      setShowThankYouModal(true);
      
      // Reset form
      setRating(null);
      setFeedback('');
      setCustomerName('');
      setCustomerEmail('');
      setImages([]);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.';
      showToast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <PublicLoading />;
  }
  return (
    <div className="min-h-screen font-sans flex justify-center scroll-smooth" style={{ backgroundColor: color }}>
      <div className="max-w-xl mx-auto pb-12 w-full bg-white shadow-lg overflow-hidden">
        <SectionHeader title="Feedback" subtitle="Share your thoughts and help us improve your experience." />
        <main className="p-4 space-y-6 rounded-tl-3xl bg-gray-50 " style={{top: '72px', left: 0, right: 0, bottom: 0}}>
          <div data-rating-section>
            <RatingSection 
              onRatingSelected={handleRatingSelected}
              selectedRating={rating}
            />
          </div>
          <FeedbackForm 
            feedbackFormRef={feedbackFormRef}
            feedback={feedback}
            onFeedbackChange={setFeedback}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            customerEmail={customerEmail}
            onCustomerEmailChange={setCustomerEmail}
          />
          <ImageUpload 
            images={images}
            onImagesChange={setImages}
          />
          <button
            onClick={handleSubmit}
            disabled={createFeedbackMutation.status === 'pending'}
            className="w-full py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:shadow-xl transform hover:-translate-y-0.5"
            style={{ backgroundColor: color }}
          >
            {createFeedbackMutation.status === 'pending' ? (
              <>
                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
        </main>
      </div>
      <CurvedBottomNav />
      
      {/* Thank You Modal */}
      <ThankYouModal 
        isOpen={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
        customerName={customerName}
        slug={slug}
      />
    </div>
  );
};

export default FeedbackPage;

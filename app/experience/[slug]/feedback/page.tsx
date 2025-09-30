// src/App.tsx
'use client'
import React, { useRef } from 'react';

// INTERNAL IMPORTS
import SectionHeader from '@/components/public/ThemeAwareSectionHeader';
import RatingSection from './components/RatingSection';
import FeedbackForm from './components/FeedbackForm';
import ImageUpload from './components/ImageUpload';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';
import CurvedBottomNav from '@/components/public/CurvedBottomNav';

const FeedbackPage: React.FC = () => {
  const feedbackFormRef = useRef<HTMLTextAreaElement>(null);
  const { color } = usePublicExpStore();
  // Callback to scroll and focus feedback form
  const handleRatingSelected = () => {
    if (feedbackFormRef.current) {
      feedbackFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      feedbackFormRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen  font-sans flex justify-center" style={{ backgroundColor: color }}>
      <div className="max-w-xl mx-auto pb-12 w-full bg-white shadow-lg overflow-hidden">
        <SectionHeader title="Feedback" subtitle="Share your thoughts and help us improve your experience." />
        <main className="p-4 space-y-6 rounded-tl-3xl bg-gray-50 " style={{top: '72px', left: 0, right: 0, bottom: 0}}>
          <RatingSection onRatingSelected={handleRatingSelected} />
          <FeedbackForm feedbackFormRef={feedbackFormRef} />
          <ImageUpload />
          <button
            className="w-full py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-200"
            style={{ backgroundColor: color }}
          >
            Submit Feedback
          </button>
        </main>
      </div>
      <CurvedBottomNav />
    </div>
  );
};

export default FeedbackPage;

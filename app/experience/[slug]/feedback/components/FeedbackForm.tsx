// src/components/FeedbackForm.tsx
import React, { useState } from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

interface FeedbackFormProps {
  feedbackFormRef?: React.RefObject<HTMLTextAreaElement | null>;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ feedbackFormRef }) => {
  const [feedback, setFeedback] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars) {
      setFeedback(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log('Feedback submitted:', feedback);
      // Handle feedback submission here
      setFeedback('');
      setCharCount(0);
    }
  };

  const { color } = usePublicExpStore();
  return (
    <div className="max-w-2xl mx-auto p-6 px-3">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900" style={{ color }}>
            Care to share more?
          </h2>
          <p className="text-gray-600 text-sm text-black">
            Your thoughts help us improve and create better experiences
          </p>
        </div>

        {/* Feedback Input Section */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              id="feedback"
              ref={feedbackFormRef}
              value={feedback}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none transition-all duration-200 resize-none min-h-[120px] text-gray-800 placeholder-gray-400"
              style={{ boxShadow: `0 0 0 2px ${color}33`, borderColor: color }}
              placeholder="Tell us what's on your mind..."
              rows={5}
            />
            {/* Character Counter */}
            <div className="absolute bottom-3 right-3 text-xs text-gray-800">
              {charCount}/{maxChars}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setFeedback('');
              setCharCount(0);
            }}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 order-2 sm:order-1"
          >
            Clear
          </button>
          {/* <button
            type="submit"
            disabled={!feedback.trim()}
            className="px-8 py-2.5 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
            style={{ backgroundColor: color, borderColor: color }}
          >
            Submit Feedback
          </button> */}
        </div>

      </form>
    </div>
  );
};

export default FeedbackForm;
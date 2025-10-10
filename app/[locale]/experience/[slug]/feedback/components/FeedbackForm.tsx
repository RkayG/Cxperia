// src/components/FeedbackForm.tsx
import React, { useState } from 'react';
import { usePublicExpStore } from '@/store/public/usePublicExpStore';

interface FeedbackFormProps {
  feedbackFormRef?: React.RefObject<HTMLTextAreaElement | null>;
  feedback?: string;
  onFeedbackChange?: (feedback: string) => void;
  customerName?: string;
  onCustomerNameChange?: (name: string) => void;
  customerEmail?: string;
  onCustomerEmailChange?: (email: string) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  feedbackFormRef, 
  feedback = '', 
  onFeedbackChange,
  customerName = '',
  onCustomerNameChange,
  customerEmail = '',
  onCustomerEmailChange
}) => {
  const maxChars = 500;
  const charCount = feedback.length;

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxChars && onFeedbackChange) {
      onFeedbackChange(value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCustomerNameChange) {
      onCustomerNameChange(e.target.value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCustomerEmailChange) {
      onCustomerEmailChange(e.target.value);
    }
  };

  const { color } = usePublicExpStore();
  return (
    <div className="max-w-2xl mx-auto p-6 px-3">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900" style={{ color }}>
            Care to share more?
          </h2>
          <p className="text-gray-600 text-sm text-black">
            Your thoughts help us improve and create better experiences
          </p>
        </div>

        {/* Customer Info Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Name (Optional)
              </label>
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={handleNameChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                style={{ boxShadow: `0 0 0 2px ${color}33`, borderColor: color }}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={handleEmailChange}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                style={{ boxShadow: `0 0 0 2px ${color}33`, borderColor: color }}
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Feedback Input Section */}
        <div className="space-y-3">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
            Your Feedback
          </label>
          <div className="relative">
            <textarea
              id="feedback"
              ref={feedbackFormRef}
              value={feedback}
              onChange={handleFeedbackChange}
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

        {/* Clear Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (onFeedbackChange) onFeedbackChange('');
              if (onCustomerNameChange) onCustomerNameChange('');
              if (onCustomerEmailChange) onCustomerEmailChange('');
            }}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
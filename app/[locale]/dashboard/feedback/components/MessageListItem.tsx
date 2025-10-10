'use client';
import { Image as ImageIcon, Star } from 'lucide-react';
import React, { useState } from 'react';
import FeedbackImageModal from './FeedbackImageModal';
import type { MessageListItemProps } from './inboxTypes';

const MessageListItem: React.FC<MessageListItemProps> = ({ message: feedback, onSelectMessage }) => {
  const [showImages, setShowImages] = useState(false);
  // Assume message.rating is a number 1-5, fallback to 5 if not present
  // Choose smiley based on rating
    // Rating data with emojis and descriptive text
    const ratings = [
      { emoji: '😠', label: 'Poor', color: 'from-red-500 to-red-600' },
      { emoji: '😞', label: 'Fair', color: 'from-orange-500 to-orange-600' },
      { emoji: '😐', label: 'Good', color: 'from-yellow-500 to-yellow-600' },
      { emoji: '😊', label: 'Great', color: 'from-blue-500 to-blue-600' },
      { emoji: '😍', label: 'Excellent', color: 'from-purple-500 to-pink-500' }
    ];
    // Clamp rating to 1-5
  const rating = Math.min(5, Math.max(1, typeof feedback.rating === 'number' ? feedback.rating : 5));
  const ratingData = ratings[rating - 1] || ratings[4]; // Fallback to 'Excellent' if undefined

  return (
    <>
      <div
        className="flex items-start p-4 border-b border-gray-200 mb-3"
        onClick={() => onSelectMessage(feedback.id)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center w-5 h-5 rounded bg-green-700 ${i < rating ? '' : 'opacity-30'}`}
                >
                  <Star size={16} className="text-white" fill={i < rating ? 'white' : 'none'} />
                </span>
              ))}
            </div>
            {/* Emoji with gradient background */}
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-lg shadow`}
              title={ratingData?.label || 'Rating'}
            >
              {ratingData?.emoji || '😊'}
            </span>
            {/* Image trigger button */}
            {Array.isArray(feedback.images) && feedback.images.length > 0 && (
              <button
                type="button"
                className="ml-2 flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded text-purple-700 text-xs font-medium border border-purple-200"
                onClick={e => { e.stopPropagation(); setShowImages(true); }}
                title="View attached images"
              >
                <ImageIcon size={16} />
                {feedback.images.length}
              </button>
            )}
          </div>
          <div className='flex justify-between gap-2 mb-1'>
            <p className='text-sm font-bold text-gray-900 mb-1 text-left border-b border-purple-300 w-fit'>
              {feedback.productName || 'Product'}
            </p>
          </div>
          <div className='flex justify-between items-center'>
          <p className="text-sm  font-bold text-gray-600 mb-1 max-w-2xl text-left"
            style={{ fontFamily: 'Frank Ruhl Libre, sans-serif' }}>{feedback.preview}</p>
          <p className="text-sm text-black text-right">{feedback.time}</p>
        </div>
        </div>
        {!feedback.read && (
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full ml-4 flex-shrink-0" aria-label="Unread message"></span>
        )}
      </div>
      {/* Image Modal */}
      {Array.isArray(feedback.images) && feedback.images.length > 0 && (
        <FeedbackImageModal
          images={feedback.images}
          open={showImages}
          onClose={() => setShowImages(false)}
        />
      )}
    </>
  );
};

export default MessageListItem;

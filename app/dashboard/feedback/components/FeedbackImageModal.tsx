import React from 'react';

interface FeedbackImageModalProps {
  images: string[];
  open: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const FeedbackImageModal: React.FC<FeedbackImageModalProps> = ({ images, open, onClose, initialIndex = 0 }) => {
  const [current, setCurrent] = React.useState(initialIndex);

  React.useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  if (!open || images.length === 0) return null;

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full p-4 flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex items-center justify-center w-full h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            src={images[current]}
            alt={`Feedback attachment ${current + 1}`}
            className="object-contain max-h-full max-w-full"
          />
        </div>
        {images.length > 1 && (
          <div className="flex justify-between w-full mb-2">
            <button
              className="px-4 py-2 bg-purple-100 rounded hover:bg-purple-200"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="px-4 py-2 bg-purple-100 rounded hover:bg-purple-200"
              onClick={handleNext}
              aria-label="Next image"
            >
              ›
            </button>
          </div>
        )}
        <div className="text-xs text-gray-500">{current + 1} / {images.length}</div>
      </div>
    </div>
  );
};

export default FeedbackImageModal;

import { CheckCircle, X } from 'lucide-react';
import React from 'react';

interface ResponseModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  nextQuestion?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  isOpen,
  message,
  onClose,
  nextQuestion = "What would you like to do next?",
  primaryActionLabel = "Continue to Experience",
  onPrimaryAction,
  secondaryActionLabel = "Create more products/tutorials",
  onSecondaryAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 min-w-xs lg:min-w-xl rounded-2xl shadow-2xl max-w-md w-full relative border border-purple-200 flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-400 hover:text-purple-700 transition-colors duration-200 p-1 rounded-full hover:bg-purple-100"
        >
          <X className="h-6 w-6" />
        </button>
        <CheckCircle className="h-16 w-16 text-purple-800 mb-4" />
        <p className="text-purple-900 text-lg font-semibold text-center mb-4">{message}</p>
        <div className="w-full border-t border-gray-200 my-4"></div>
        <p className="text-gray-900 text-base text-center mb-4">{nextQuestion}</p>
        <div className="flex flex-col lg:flex-row gap-3 w-full">
          <button
            onClick={onPrimaryAction}
            className="flex-1 px-6 py-3 rounded-xl bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
          >
            {primaryActionLabel}
          </button>
          <button
            onClick={onSecondaryAction}
            className="flex-1 px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-blue-700 transition"
          >
            {secondaryActionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;
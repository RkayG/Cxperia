// ModalHeader.tsx
import { X } from "lucide-react";
import React from "react";

interface ModalHeaderProps {
  productName?: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ productName, onClose }) => (
  <div className="flex items-center bg-gray-50 justify-between px-4 lg:px-8 py-3 text-purple-900 sticky top-0 z-20 border-b border-gray-200">
    <div className="flex items-center space-x-3 flex-1 pr-4">
      <div>
        <h2 className="text-lg lg:text-xl font-bold text-black">
          {productName} Usage Instructions
        </h2>
        <p className="text-gray-500 text-left text-xs lg:text-sm">
          Describe how users should apply and use {productName}.
        </p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2 rounded-xl hover:bg-purple-600 transition-all duration-200 group hover:text-white flex-shrink-0"
      aria-label="Close modal"
    >
      <X
        size={20}
        className="group-hover:rotate-90 transition-transform duration-200"
      />
    </button>
  </div>
);

export default ModalHeader;
// ModalFooter.tsx
import { Eye, Loader2 } from "lucide-react";
import React from "react";

interface ModalFooterProps {
  isSaving: boolean;
  handlePreview: () => void;
  handleSave: () => void;
  onClose: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  isSaving,
  handlePreview,
  handleSave,
  onClose,
}) => (
  <div className="flex items-center bg-gray-50 justify-between border-t border-gray-200 px-4 lg:px-8 py-4 fixed w-full bottom-0 z-20">
    <div className="flex items-center space-x-3">
      {/* <button
        onClick={handlePreview}
        className="flex items-center px-4 py-2 text-purple-800 bg-white border border-gray-300 rounded-xl hover:bg-purple-50 transition-all duration-200"
      >
        <Eye className="w-4 h-4 mr-2" />
        Preview
      </button> */}
    </div>
    <div className="flex items-center space-x-2 lg:space-x-3">
      <button
        onClick={onClose}
        disabled={isSaving}
        className="px-4 lg:px-6 py-2 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm lg:text-base"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 lg:px-6 py-2 bg-purple-800 text-white font-medium rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm lg:text-base"
      >
        {isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </div>
  </div>
);

export default ModalFooter;
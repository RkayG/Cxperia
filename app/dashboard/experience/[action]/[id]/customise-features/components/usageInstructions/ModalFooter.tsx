// ModalFooter.tsx
import React from "react";
import { Eye } from "lucide-react";

interface ModalFooterProps {
  isSaving: boolean;
  handlePreview: () => void;
  handleSave: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  isSaving,
  handlePreview,
  handleSave,
}) => (
  <div className="flex items-center absolute bottom-0 bg-gray-50 justify-end border-t border-gray-200 px-8 py-4 sticky bottom-0 z-20">
    <div className="flex items-center w-full sm:w-auto space-x-3">
      {/* <button
        onClick={handlePreview}
        className="flex items-center px-4 py-2 text-purple-800 bg-white border border-gray-300 rounded-xl hover:bg-purple-50 transition-all duration-200"
      >
        <Eye className="w-4 h-4 mr-2" />
        Preview
      </button> */}
      <button
        onClick={handleSave}
        className="flex items-center w-full  sm:w-auto justify-center px-6 py-2 bg-purple-800 text-white font-medium rounded-md hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save All"}
      </button>
    </div>
  </div>
);

export default ModalFooter;
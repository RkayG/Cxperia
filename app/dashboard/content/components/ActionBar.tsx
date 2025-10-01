import { Edit, EyeOff, Trash2 } from 'lucide-react'; 
import React from 'react';

interface ActionBarProps {
  selectedCount: number;
  onEdit?: () => void;
  onUnpublish?: () => void;
  onDelete?: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ selectedCount, onEdit, onUnpublish, onDelete }) => {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-6 w-full max-w-xs sm:max-w-md md:max-w-xl bg-purple-800 text-white p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-center shadow-lg rounded-xl z-30">
      <span className="text-sm pt-1 md:pt-0 font-medium mb-2 sm:mb-0">
        {selectedCount} article{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-2 sm:gap-4">
        {selectedCount === 1 && (
          <button
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 transition-colors text-xs sm:text-sm"
            onClick={onEdit}
          >
            <Edit size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
            Edit
          </button>
        )}
        <button 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 transition-colors text-xs sm:text-sm"
          onClick={onUnpublish}
        >
          <EyeOff size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
          Unpublish
        </button>
        <button 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/20 transition-colors text-xs sm:text-sm"
          onClick={onDelete}
        >
          <Trash2 size={14} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActionBar;

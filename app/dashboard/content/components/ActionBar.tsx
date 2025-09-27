import { Edit, EyeOff, Trash2 } from 'lucide-react'; 
import React from 'react';

interface ActionBarProps {
  selectedCount: number;
  onEdit?: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ selectedCount, onEdit }) => {
  return (
    <div className="fixed max-w-xs mx-auto mr-8 md:max-w-xl mb-16 md:mb-0 justify-center left-2/3 -translate-x-1/2 bottom-6 w-full bg-purple-800 text-white md:p-4 flex flex-col sm:flex-row justify-between items-center shadow-lg md:rounded-xl z-30">
      <span className="text-sm pt-1 md:pt-0 font-medium mb-2 sm:mb-0">
        {selectedCount} article{selectedCount > 1 ? 's' : ''} selected
      </span>
      <div className="flex gap-4">
        {selectedCount === 1 && (
          <button
            className="flex items-center gap-2 md:px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm"
            onClick={onEdit}
          >
            <Edit size={16} />
            Edit
          </button>
        )}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm">
          <EyeOff size={16} />
          Unpublish
        </button>
        <button className="flex items-center  gap-2 md:px-3 mr-6  md:mr-0 py-2 rounded-lg hover:bg-white/20 transition-colors text-sm">
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActionBar;

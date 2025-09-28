import React from 'react';
import { Eye, Save } from 'lucide-react';

interface ChatbotHeaderProps {
  onSave: () => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ onSave }) => (
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">FAQ Chatbot Manager</h1>
        <p className="text-gray-600 mt-1">Configure your product-aware customer support bot</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Eye size={18} />
          Preview
        </button>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default ChatbotHeader;

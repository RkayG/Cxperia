import { Eye } from 'lucide-react';
import React from 'react';

interface Article {
  id: string | number;
  image: string;
  title: string;
  status: string;
  date: string;
  views: number;
  userImage: string;
}

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: (id: string | number, isSelected: boolean) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSelected, onSelect }) => {
  return (
    <div className={`flex items-center w-full max-w-xs sm:max-w-full mx-auto gap-2 sm:gap-4 p-2 sm:p-3 transition-all duration-50
      ${isSelected ? 'bg-purple-50 border-2 rounded-xl border-purple-800 shadow-md' : ' border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-sm'}`}
      onClick={() => onSelect(article.id, !isSelected)}
      >
      
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(article.id, e.target.checked)}
        className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-purple-600 rounded focus:ring-purple-500"
      />

      {/* Article Image */}
      <img
        src={article.image}
        alt={article.title}
        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
        onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80/cccccc/333333?text=Img"; }}
      />

      {/* Article Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base md:text-lg text-left font-semibold text-gray-800 max-w-xs sm:max-w-sm md:max-w-md truncate mb-1">{article.title}</h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full font-medium text-xs sm:text-sm ${
            article.status.toUpperCase() === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {article.status}
          </span>
       
        </div>
        <div className="text-xs text-left sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{article.date}</div>
        {/* Views: show below details on mobile, hide on md+ */}
        <div className="flex items-center text-gray-600 mt-1 sm:mt-2 md:hidden">
          <Eye size={12} className="mr-1 sm:mr-2 w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-xs sm:text-sm">{article.views} views</span>
        </div>
      </div>

      {/* Views: show in sidebar on md+ */}
      <div className="hidden md:flex md:flex-col md:items-end gap-1 md:gap-2 text-xs sm:text-sm md:flex-shrink-0">
        <div className="flex items-center text-gray-600">
          <Eye size={12} className="mr-1 w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="text-xs sm:text-sm">{article.views} views</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

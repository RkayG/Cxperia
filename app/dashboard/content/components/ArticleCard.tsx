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
    <div className={`flex items-center max-w-xs sm:max-w-full  gap-4 p-3 transition-all duration-100
      ${isSelected ? 'bg-purple-50 border-2 rounded-xl border-purple-800 shadow-md' : ' hover:shadow-sm'}`}>
      
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(article.id, e.target.checked)}
        className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
      />

      {/* Article Image */}
      <img
        src={article.image}
        alt={article.title}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
        onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80/cccccc/333333?text=Img"; }}
      />

      {/* Article Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-lg text-left font-semibold text-gray-800  max-w-xs sm:max-w-sm md:max-w-md truncate mb-1">{article.title}</h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className={`px-2 py-0.5 rounded-full font-medium ${
            article.status.toUpperCase() === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {article.status}
          </span>
       
        </div>
        <div className="text-xs text-left  sm:text-sm text-gray-500 mt-1">{article.date}</div>
        {/* Views: show below details on mobile, hide on md+ */}
        <div className="flex items-center text-gray-600 mt-2 md:hidden">
          <Eye size={14} className="mr-2" />
          <span>{article.views} views</span>
        </div>
      </div>

      {/* Views: show in sidebar on md+ */}
      <div className="hidden md:flex md:flex-col md:items-end gap-2 text-xs sm:text-sm md:flex-shrink-0">
        <div className="flex items-center text-gray-600">
          <Eye size={14} className="mr-1" />
          <span>{article.views} views</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

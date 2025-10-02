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
    <>
      {/* Mobile Layout - Card with prominent image */}
      <div className={`sm:hidden w-full max-w-xs mx-auto transition-all duration-50
        ${isSelected ? 'bg-purple-50 border-2 rounded-xl border-purple-800 shadow-md' : 'border border-gray-200 bg-white rounded-xl shadow-md hover:shadow-sm'}`}
        onClick={() => onSelect(article.id, !isSelected)}
      >
        {/* Checkbox positioned absolutely */}
        <div className="relative">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(article.id, e.target.checked)}
            className="absolute top-2 left-2 z-10 form-checkbox h-4 w-4 text-purple-600 rounded focus:ring-purple-500"
          />
          
          {/* Prominent Article Image */}
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-32 object-cover rounded-t-xl"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/300x128/cccccc/333333?text=Img"; }}
          />
        </div>

        {/* Article Details below image */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">{article.title}</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full font-medium text-xs ${
              article.status.toUpperCase() === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {article.status}
            </span>
            
            <div className="flex items-center text-gray-600">
              <Eye size={12} className="mr-1 w-3 h-3" />
              <span className="text-xs">{article.views} views</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">{article.date}</div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal card */}
      <div className={`hidden sm:flex items-center w-full max-w-full mx-auto gap-4 p-3 transition-all duration-50
        ${isSelected ? 'bg-purple-50 border-2 rounded-xl border-purple-800 shadow-md' : 'border border-gray-200 bg-white rounded-xl'}`}
        onClick={() => onSelect(article.id, !isSelected)}
      >
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
          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80/cccccc/333333?text=Img"; }}
        />

        {/* Article Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 truncate">{article.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-2 py-0.5 rounded-full font-medium text-sm ${
              article.status.toUpperCase() === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {article.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">{article.date}</div>
        </div>

        {/* Views: show in sidebar on desktop */}
        <div className="flex flex-col items-end gap-2 text-sm flex-shrink-0">
          <div className="flex items-center text-gray-600">
            <Eye size={12} className="mr-1 w-3.5 h-3.5" />
            <span className="text-sm">{article.views} views</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleCard;

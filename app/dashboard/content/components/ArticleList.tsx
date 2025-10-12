import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ArticleCard from './ArticleCard';

interface Article {
  id: string | number;
  image: string;
  title: string;
  status: string;
  date: string;
  views: number;
  userImage: string;
}

interface ArticleListProps {
  articles: Article[];
  selectedArticles: Set<string | number>;
  onSelectArticle: (id: string | number, isSelected: boolean) => void;
  isLoading?: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, selectedArticles, onSelectArticle, isLoading = false }) => {
  // Skeleton component for loading state
  const ArticleSkeleton = () => (
    <div className="flex items-center w-full gap-4 p-3">
      {/* Checkbox skeleton */}
      <Skeleton className="h-5 w-5 rounded" />
      
      {/* Image skeleton */}
      <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex-shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        
        {/* Status skeleton */}
        <Skeleton className="h-4 w-16 mb-1" />
        
        {/* Date skeleton */}
        <Skeleton className="h-3 w-20 mb-2" />
        
        {/* Views skeleton (mobile) */}
        <div className="md:hidden">
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      
      {/* Views skeleton (desktop) */}
      <div className="hidden md:flex md:flex-col md:items-end gap-2 md:flex-shrink-0">
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 px-6 pb-48 md:pb-32">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 px-6 pb-48 md:pb-32 ">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          isSelected={selectedArticles.has(article.id)}
          onSelect={onSelectArticle}
        />
      ))}
    </div>
  );
};

export default ArticleList;

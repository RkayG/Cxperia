import React from 'react';
import ArticleCard from './ArticleCard';

interface Article {
  id: number;
  image: string;
  title: string;
  status: string;
  date: string;
  views: number;
  userImage: string;
}

interface ArticleListProps {
  articles: Article[];
  selectedArticles: Set<number>;
  onSelectArticle: (id: number, isSelected: boolean) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, selectedArticles, onSelectArticle }) => {
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

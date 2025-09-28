"use client";
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTutorials } from '@/hooks/brands/useFeatureApi';
import ActionBar from './components/ActionBar';
import ArticleFilter from './components/ContentFilter';
import ArticleList from './components/ArticleList';
import Header from './components/Header';

const ContentDashboardPage: React.FC = () => {

  // State to track selected articles (for the action bar)
  const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());

  // Filter state
  const [activeTab, setActiveTab] = useState('all');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  // Fetch tutorials using the useTutorials hook
  const { data: tutorialsRaw, isLoading: isLoadingTutorials } = useTutorials();
  // Normalize tutorials data and map to article shape expected by ArticleList
  function formatDateFriendly(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  }

  const articles = React.useMemo(() => {
    let arr: any[] = [];
    if (!tutorialsRaw) return arr;
    if (tutorialsRaw.error || (tutorialsRaw.data && !Array.isArray(tutorialsRaw.data))) {
      return arr;
    }
    if (Array.isArray(tutorialsRaw)) arr = tutorialsRaw;
    else if (Array.isArray(tutorialsRaw.data)) arr = tutorialsRaw.data;
    // Map to article shape expected by ArticleList
    const placeholderImg = 'https://placehold.co/600x400/EEE/31343C?text=No+Image';
    return arr.map((tut: any) => ({
      ...tut,
      date: formatDateFriendly(tut.created_at || tut.createdAt),
      image: tut.featured_image_url || tut.featured_image || placeholderImg,
      status: tut.is_published ? 'PUBLISHED' : 'DRAFT',
    }));
  }, [tutorialsRaw]);

  // Filtering logic
  const filteredArticles = articles.filter(article => {
    // Tab filter (status)
    if (activeTab === 'published' && String(article.status).toLowerCase() !== 'published') return false;
    if (activeTab === 'draft' && String(article.status).toLowerCase() !== 'draft') return false;
    // Type filter: Video = has featured_video_url, Article = does not have featured_video_url
    if (selectedType === 'Video' && !article.featured_video_url) return false;
    if (selectedType === 'Article' && article.featured_video_url) return false;
    // Category filter
    if (selectedCategory && selectedCategory !== 'All Categories' && article.category !== selectedCategory) return false;
    // Search filter
    if (search && !String(article.title).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Handler for selecting/deselecting articles
  const handleSelectArticle = (id: number, isSelected: boolean) => {
    setSelectedArticles(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (isSelected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return newSelected;
    });
  };

  const router = useRouter();

  // Handler for edit action
  const handleEdit = () => {
    if (selectedArticles.size === 1) {
      const id = Array.from(selectedArticles)[0];
      router.push(`/tutorial/${id}?mode=edit`);
    }
  };

  return (
    <div className="font-sans bg-gray-50 relative h-screen flex justify-center p-0 ">
      <div className="w-full overflow-hidden flex flex-col">
        <Header />
        <ScrollArea className="flex-1 overflow-y-auto">
          {/* Add top padding to prevent content from being hidden behind the fixed header and filter */}
          <div className='w-full '>
            <ArticleFilter
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              search={search}
              setSearch={setSearch}
              count={filteredArticles.length}
            />
            {isLoadingTutorials ? (
              <div className="text-center text-gray-500 py-8">Loading tutorials...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center bg-gray-50 justify-center pb-24">
                <Sparkles className="w-20 h-20 text-yellow-400 mb-6" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Nothing to see here yet</h2>
                <p className="text-gray-500 mb-6">Create your first tutorial to get started.</p>
                <button
                  onClick={() => router.push('/dashboard/tutorial?mode=create')}
                  className="px-8 py-3 bg-purple-700 text-white font-medium rounded-xl hover:bg-purple-800 transition-colors shadow-lg"
                >
                  Create Tutorial
                </button>
              </div>
            ) : (
              <ArticleList articles={filteredArticles} selectedArticles={selectedArticles} onSelectArticle={handleSelectArticle} />
            )}
          </div>
        </ScrollArea>

        {selectedArticles.size > 0 && (
          <div className="md:pr-12">
          <ActionBar selectedCount={selectedArticles.size} onEdit={handleEdit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDashboardPage;

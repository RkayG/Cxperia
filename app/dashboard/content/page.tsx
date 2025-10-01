"use client";
import { Book, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTutorials, useDeleteTutorial, useUnpublishTutorial } from '@/hooks/brands/useFeatureApi';
import { showToast } from '@/utils/toast';
import Modal from '@/components/Modal';
import ActionBar from './components/ActionBar';
import ArticleFilter from './components/ContentFilter';
import ArticleList from './components/ArticleList';
import Header from './components/Header';

const ContentDashboardPage: React.FC = () => {

  // State to track selected articles (for the action bar)
  const [selectedArticles, setSelectedArticles] = useState<Set<string | number>>(new Set());

  // Filter state
  const [activeTab, setActiveTab] = useState('all');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch tutorials using the useTutorials hook
  const { data: tutorialsRaw, isLoading: isLoadingTutorials } = useTutorials();
  
  // Mutation hooks for actions
  const deleteTutorialMutation = useDeleteTutorial();
  const unpublishTutorialMutation = useUnpublishTutorial();
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
    
    console.log('Raw tutorials data:', tutorialsRaw);
    console.log('Processed tutorials array:', arr);
    
    // Map to article shape expected by ArticleList
    const placeholderImg = 'https://placehold.co/600x400/EEE/31343C?text=No+Image';
    return arr.map((tut: any, index: number) => ({
      ...tut,
      id: tut.id || `tutorial-${index}`, // Ensure ID is present
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
  const handleSelectArticle = (id: string | number, isSelected: boolean) => {
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
      router.push(`/dashboard/content/tutorial/${id}?mode=edit`);
    }
  };

  // Handler for unpublish action
  const handleUnpublish = async () => {
    if (selectedArticles.size === 0) return;
    
    const selectedIds = Array.from(selectedArticles);
    const count = selectedIds.length;
    
    try {
      // Unpublish all selected tutorials
      await Promise.all(
        selectedIds.map(id => {
          const tutorialId = typeof id === 'string' ? id : id.toString();
          return unpublishTutorialMutation.mutateAsync(tutorialId);
        })
      );
      
      showToast.success(`${count} tutorial${count > 1 ? 's' : ''} unpublished successfully!`);
      setSelectedArticles(new Set()); // Clear selection
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to unpublish tutorials');
    }
  };

  // Handler for delete action - shows confirmation modal
  const handleDelete = () => {
    if (selectedArticles.size === 0) return;
    setShowDeleteModal(true);
  };

  // Handler for confirmed deletion
  const handleConfirmDelete = async () => {
    const selectedIds = Array.from(selectedArticles);
    const count = selectedIds.length;
    
    console.log('Attempting to delete tutorials with IDs:', selectedIds);
    
    try {
      // Delete all selected tutorials
      await Promise.all(
        selectedIds.map(async (id) => {
          console.log(`Deleting tutorial with ID: ${id}`);
          // Convert to string for API call
          const tutorialId = typeof id === 'string' ? id : id.toString();
          return deleteTutorialMutation.mutateAsync(tutorialId);
        })
      );
      
      showToast.success(`${count} tutorial${count > 1 ? 's' : ''} deleted successfully!`);
      setSelectedArticles(new Set()); // Clear selection
      setShowDeleteModal(false); // Close modal
    } catch (error: any) {
      console.error('Delete error:', error);
      showToast.error(error?.message || 'Failed to delete tutorials');
    }
  };

  // Handler for canceling deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
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
              <ArticleList 
                articles={[]} 
                selectedArticles={selectedArticles} 
                onSelectArticle={handleSelectArticle}
                isLoading={true}
              />
            ) : filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center bg-gray-50 justify-center pb-24">
                <Book className="w-12 h-12  text-yellow-400 mb-6" />
                <h2 className="text-lg md:text-2xl font-bold text-gray-700 mb-2">Nothing to see here yet</h2>
                <p className="text-gray-500 mb-6">Create your first tutorial to get started.</p>
                <button
                  onClick={() => router.push('/dashboard/content/tutorial?mode=create')}
                  className="px-8 flex items-center justify-center md:py-3 py-2 bg-gray-500 text-white font-medium rounded-xl hover:bg-purple-800 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tutorial
                </button>
              </div>
            ) : (
              <ArticleList 
                articles={filteredArticles} 
                selectedArticles={selectedArticles} 
                onSelectArticle={handleSelectArticle}
                isLoading={false}
              />
            )}
          </div>
        </ScrollArea>

        {selectedArticles.size > 0 && (
          <div className="md:pr-12">
          <ActionBar 
            selectedCount={selectedArticles.size} 
            onEdit={handleEdit}
            onUnpublish={handleUnpublish}
            onDelete={handleDelete}
          />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        title="Delete Tutorials"
        description={`Are you sure you want to delete ${selectedArticles.size} tutorial${selectedArticles.size > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        color="red"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default ContentDashboardPage;

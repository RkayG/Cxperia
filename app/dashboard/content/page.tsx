"use client";
import { Book, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { useDeleteTutorial, useUnpublishTutorial } from '@/hooks/brands/useFeatureApi';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { 
  useContentFilteredArticles, 
  useContentSelectedArticles, 
  useContentFilters, 
  useContentLoading, 
  useContentActions 
} from '@/store/content/useContentStore';
import { showToast } from '@/utils/toast';
import ActionBar from './components/ActionBar';
import ArticleList from './components/ArticleList';
import ArticleFilter from './components/ContentFilter';
import ContentDashboardHeader from './components/Header';

const ContentDashboardPage: React.FC = () => {
  // Add render tracking
  console.log('🔄 ContentPage rendering', { timestamp: new Date().toISOString() });
  
  // Get brand from store
  const brand = useExperienceStore((state) => state.brand);
  const brandId = brand?.id;

  // Subscribe to store state (no hooks, pure subscription)
  const filteredArticles = useContentFilteredArticles();
  const selectedArticles = useContentSelectedArticles();
  const { activeTab, selectedType, selectedCategory, search } = useContentFilters();
  const isLoading = useContentLoading();
  
  // Get actions from store
  const { 
    fetchContentData, 
    invalidateCache,
    setActiveTab, 
    setSelectedType, 
    setSelectedCategory, 
    setSearch, 
    selectArticle, 
    selectAllArticles, 
    clearSelection 
  } = useContentActions();

  // Local UI state (modals)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  
  // Mutation hooks for actions
  const deleteTutorialMutation = useDeleteTutorial();
  const unpublishTutorialMutation = useUnpublishTutorial();

  const router = useRouter();

  // Initialize data fetching
  useEffect(() => {
    if (brandId) {
      fetchContentData(brandId);
    }
  }, [brandId, fetchContentData]);

  // Handler for edit action
  const handleEdit = () => {
    if (selectedArticles.size === 1) {
      const id = Array.from(selectedArticles)[0];
      router.push(`/dashboard/content/tutorial/${id}?mode=edit`);
    }
  };

  // Handler for unpublish action - shows confirmation modal
  const handleUnpublish = () => {
    if (selectedArticles.size === 0) return;
    setShowUnpublishModal(true);
  };

  // Handler for confirmed unpublish
  const handleConfirmUnpublish = async () => {
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
      clearSelection(); // Clear selection using store action
      invalidateCache(); // Invalidate cache to refresh data
      setShowUnpublishModal(false); // Close modal
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to unpublish tutorials');
    }
  };

  // Handler for canceling unpublish
  const handleCancelUnpublish = () => {
    setShowUnpublishModal(false);
  };

  // Handler for dismissing action bar
  const handleDismissActionBar = () => {
    clearSelection(); // Use store action
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
    
    //console.log('Attempting to delete tutorials with IDs:', selectedIds);
    
    try {
      // Delete all selected tutorials
      await Promise.all(
        selectedIds.map(async (id) => {
          //console.log(`Deleting tutorial with ID: ${id}`);
          // Convert to string for API call
          const tutorialId = typeof id === 'string' ? id : id.toString();
          return deleteTutorialMutation.mutateAsync(tutorialId);
        })
      );
      
      showToast.success(`${count} tutorial${count > 1 ? 's' : ''} deleted successfully!`);
      clearSelection(); // Clear selection using store action
      invalidateCache(); // Invalidate cache to refresh data
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
    <div className="font-sans min-h-screen">
      <div className="w-full">
        <ContentDashboardHeader />
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
        {selectedArticles.size > 0 && (
          <ActionBar
            selectedCount={selectedArticles.size}
            onEdit={handleEdit}
            onUnpublish={handleUnpublish}
            onDelete={handleDelete}
            onDismiss={handleDismissActionBar}
          />
        )}
        <ArticleList
          articles={filteredArticles}
          onSelectArticle={selectArticle}
          selectedArticles={selectedArticles}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteModal}
        title="Delete Tutorials"
        description={`Are you sure you want to delete ${selectedArticles.size} tutorial${selectedArticles.size > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        color="red"
      />

      {/* Unpublish Confirmation Modal */}
      <Modal
        open={showUnpublishModal}
        title="Unpublish Tutorials"
        description={`Are you sure you want to unpublish ${selectedArticles.size} tutorial${selectedArticles.size > 1 ? 's' : ''}? They will no longer be visible to customers.`}
        confirmText="Unpublish"
        cancelText="Cancel"
        onConfirm={handleConfirmUnpublish}
        onCancel={handleCancelUnpublish}
        color="orange"
      />
    </div>
  );
};

export default ContentDashboardPage;
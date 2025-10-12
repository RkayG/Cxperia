"use client";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { useDeleteTutorial, useUnpublishTutorial } from '@/hooks/brands/useFeatureApi';
import { useNavigationProgressWithQuery } from '@/hooks/useNavigationProgressWithQuery';
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
 
  // Get brand from store
  const brand = useExperienceStore((state) => state.brand);
  const brandId = brand?.id;

  // Subscribe to store state (no hooks, pure subscription)
  const filteredArticles = useContentFilteredArticles();
  const selectedArticles = useContentSelectedArticles();
  const { activeTab, selectedType, selectedCategory, search } = useContentFilters();
  const isLoading = useContentLoading();
  
  // Use navigation progress with loading state
  useNavigationProgressWithQuery(isLoading, false);
  
  // Get actions from store
  const { 
    fetchContentData, 
    invalidateCache,
    refreshData,
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  
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
    
    setIsUnpublishing(true);
    
    try {
      // Unpublish all selected tutorials
      await Promise.all(
        selectedIds.map(id => {
          const tutorialId = typeof id === 'string' ? id : id.toString();
          return unpublishTutorialMutation.mutateAsync(tutorialId);
        })
      );
      
      showToast.success(`${count} tutoriel${count > 1 ? 's' : ''} dépublié${count > 1 ? 's' : ''} avec succès !`);
      clearSelection(); // Clear selection using store action
      await refreshData(brandId!); // Force refresh data
      setShowUnpublishModal(false); // Close modal
    } catch (error: any) {
      showToast.error(error?.message || 'Échec de la dépublication des tutoriels');
    } finally {
      setIsUnpublishing(false);
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
    
    setIsDeleting(true);
    
    try {
      // Delete all selected tutorials
      await Promise.all(
        selectedIds.map(async (id) => {
          // Convert to string for API call
          const tutorialId = typeof id === 'string' ? id : id.toString();
          const result = await deleteTutorialMutation.mutateAsync(tutorialId);
          return result;
        })
      );
      
      showToast.success(`${count} tutoriel${count > 1 ? 's' : ''} supprimé${count > 1 ? 's' : ''} avec succès !`);
      clearSelection(); // Clear selection using store action
      await refreshData(brandId!); // Force refresh data
      setShowDeleteModal(false); // Close modal
    } catch (error: any) {
      showToast.error(error?.message || 'Échec de la suppression des tutoriels');
    } finally {
      setIsDeleting(false);
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
        title="Supprimer les tutoriels"
        description={`Êtes-vous sûr de vouloir supprimer ${selectedArticles.size} tutoriel${selectedArticles.size > 1 ? 's' : ''} ? Cette action ne peut pas être annulée.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        color="red"
        disabled={isDeleting}
      />

      {/* Unpublish Confirmation Modal */}
      <Modal
        open={showUnpublishModal}
        title="Dépublier les tutoriels"
        description={`Êtes-vous sûr de vouloir dépublier ${selectedArticles.size} tutoriel${selectedArticles.size > 1 ? 's' : ''} ? Ils ne seront plus visibles pour les clients.`}
        confirmText={isUnpublishing ? "Dépublication..." : "Dépublier"}
        cancelText="Annuler"
        onConfirm={handleConfirmUnpublish}
        onCancel={handleCancelUnpublish}
        color="orange"
        disabled={isUnpublishing}
      />
    </div>
  );
};

export default ContentDashboardPage;
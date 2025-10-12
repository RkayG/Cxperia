//import React, { useRef, useState } from 'react';
//import { getVideoType, getYouTubeEmbedUrl, getVimeoEmbedUrl } from './videoUtils';
//import { X, Plus, Check, PencilIcon, Play, Pause, Clock, Eye } from 'lucide-react';
//import type { Tutorial } from './tutorialTypes';
//import { Toaster, toast } from 'react-hot-toast';
//import { useExperienceContext } from '../../../context/ExperienceContext';
//import { useNavigate } from 'react-router-dom';
//import { useModalContext } from '../../../context/ModalContext';
//import { useTutorials, useLinkTutorialsToExperience, useTutorialIdsLinkedToExperience } from '../../../hooks/useFeatureApi';
//
//interface TutorialSelectionModalProps {
//  tutorials?: Tutorial[]; // optional: if omitted, will use tutorials from ExperienceContext
//  onSelect: (selected: Tutorial[]) => void;
//  onAddNew: () => void;
//  onEdit?: (tutorial: Tutorial) => void;
//  // When true, show a loading state instead of the empty-state message
//  isLoading?: boolean;
//}
//
//const TutorialSelectionModal: React.FC<TutorialSelectionModalProps> = ({
//  tutorials,
//  onSelect,
//
//  isLoading = false,
//}) => {
//  const { isTutorialModalOpen, closeTutorialModal } = useModalContext();
//  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
//   const navigate = useNavigate();
//  const { experienceId } = useExperienceContext();
//  const [shouldRefresh, setShouldRefresh] = useState(false);
//
//  console.log('[TutorialSelectionModal] experienceId=', experienceId);
//
//  // Fetch linked tutorial IDs for the current experience
//  const { data: linkedIdsData} = useTutorialIdsLinkedToExperience(experienceId || '');
//  console.log('linked tutorials', linkedIdsData)
//  React.useEffect(() => {
//    if (experienceId && Array.isArray(linkedIdsData?.data)) {
//      // linkedIdsData.data is an array of tutorial objects; extract their IDs
//      setSelectedIds(linkedIdsData.data.map((tut: any) => String(tut.id)));
//    }
//  }, [experienceId, linkedIdsData]);
// 
//
//
//  // Fetch tutorials if not provided via prop
//  const { data: tutorialsRaw, isLoading: _isLoadingTutorials } = useTutorials();
//  // Use backend payload directly (no normalization) to debug raw URL behavior
//  const tutorialsFromHook = React.useMemo(() => {
//    if (!tutorialsRaw) return [];
//    if (tutorialsRaw.error || (tutorialsRaw.data && !Array.isArray(tutorialsRaw.data))) {
//      console.warn('[TutorialSelectionModal] Bad tutorials response', tutorialsRaw);
//      return [];
//    }
//    if (Array.isArray(tutorialsRaw)) return tutorialsRaw;
//    if (Array.isArray(tutorialsRaw.data)) return tutorialsRaw.data;
//    return [];
//  }, [tutorialsRaw]);
//
//  // Local additions for optimistic UI (optional, can be extended)
//  const [localAdds, _setLocalAdds] = React.useState<any[]>([]);
//  // Merge server tutorials and local additions, deduping by id/url
//  const effectiveTutorials = React.useMemo(() => {
//    const base = Array.isArray(tutorials) ? tutorials : tutorialsFromHook;
//    return [
//      ...base,
//      ...localAdds.filter((a) => !base.some((t: any) => String(t.id) === String(a.id) || (t.videoData?.url && t.videoData.url === a.videoData?.url)))
//    ];
//  }, [tutorials, tutorialsFromHook, localAdds]);
//  console.log('[TutorialSelectionModal] effectiveTutorials count=', effectiveTutorials);
//
//  // Refs to video elements so play overlay can control playback
//  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
//  const [playingId, setPlayingId] = useState<string | number | null>(null);
//
//  // Debug: log a concise summary when the modal opens or the tutorials count changes.
//  // Avoid depending on the full array reference which may be recreated each render
//  // and cause noisy logs (and appears like a loop in dev/StrictMode).
//  React.useEffect(() => {
//    const count = Array.isArray(tutorials) ? tutorials.length : 0;
//    console.debug('[TutorialSelectionModal] isOpen=', isTutorialModalOpen, 'tutorialsCount=', count);
//    if (isTutorialModalOpen && count > 0) {
//      try {
//        const ids = (tutorials as any[]).map((t) => t.id).slice(0, 10);
//        console.debug('[TutorialSelectionModal] tutorialIds(sample)=', ids);
//      } catch (e) {
//        console.debug('[TutorialSelectionModal] failed to read tutorial ids', e);
//      }
//    }
//    // Intentionally only watch modal open state and the tutorials length to avoid re-logs when
//    // the parent recreates the same list object on every render.
//  }, [isTutorialModalOpen, Array.isArray(tutorials) ? tutorials.length : 0]);
//
//  const handleSelect = (id: string) => {
//    setSelectedIds((prev) =>
//      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
//    );
//  };
//
//  const linkTutorialsMutation = useLinkTutorialsToExperience();
//  const handleAddSelected = async () => {
//    const selected = effectiveTutorials.filter((t: any) => selectedIds.includes(t.id));
//    if (!experienceId) {
//      toast.error('No experience selected.');
//      return;
//    }
//    if (selected.length === 0) return;
//    try {
//      await linkTutorialsMutation.mutateAsync({ experienceId: String(experienceId), tutorialIds: selected.map((t: any) => String(t.id)) });
//      toast.success('Tutorials linked to experience!');
//      onSelect(selected);
//      closeTutorialModal();
//    } catch (err) {
//      toast.error('Failed to link tutorials.');
//    }
//  };
//
//  const handleSelectAll = () => {
//    if (selectedIds.length === effectiveTutorials.length) {
//      setSelectedIds([]);
//    } else {
//      setSelectedIds(effectiveTutorials.map((t: any) => t.id));
//    }
//  };
//
//  // Modal-side: Navigate to TutorialCreator with callback state
//  const handleAddNewTutorial = () => {
//    navigate('/tutorial?mode=create', {
//      state: { fromModal: true }
//    });
//  };
//
//  // Listen for navigation back from TutorialCreator
//  React.useEffect(() => {
//    // If we should refresh after returning from TutorialCreator
//    if (shouldRefresh) {
//      // Optionally trigger a refresh or selection logic here
//      // For example, refetch tutorials or select the newly created one
//      // You may want to call a prop or context method here
//      setShouldRefresh(false);
//      toast.success('Tutorial created!');
//      // Optionally, you can refetch or update the tutorials list here
//    }
//  }, [shouldRefresh]);
//
//  // Disable background scroll when modal is open
//  React.useEffect(() => {
//    if (isTutorialModalOpen) {
//      document.body.classList.add('overflow-hidden');
//    } else {
//      document.body.classList.remove('overflow-hidden');
//    }
//    return () => {
//      document.body.classList.remove('overflow-hidden');
//    };
//  }, [isTutorialModalOpen]);
//
//  // Invalidate any locally cached video tutorials when the modal opens
//  React.useEffect(() => {
//    if (isTutorialModalOpen && typeof window !== 'undefined' && window.localStorage) {
//      // Remove the legacy localStorage key used by VideoTutorialManagerWithSelection
//      const key = 'stepTwo_videoTutorials';
//      if (localStorage.getItem(key)) {
//        console.debug('[TutorialSelectionModal] clearing localStorage', key);
//        localStorage.removeItem(key);
//      }
//    }
//  }, [isTutorialModalOpen]);
//
//  if (!isTutorialModalOpen) return null;
//
//  return (
//    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/40 backdrop-blur-sm">
//      <Toaster />
//      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl min-h-[90vh] max-h-[90vh] flex flex-col relative">
//        <button
//          onClick={closeTutorialModal}
//          className="absolute -right-15 -top-2 p-1.5 lg:p-2 mr-2 mt-2 rounded-full bg-white text-gray-600 hover:bg-purple-600 hover:text-white transition-all duration-200 group z-10 shadow-md"
//          aria-label="Close modal"
//        >
//          <X size={20} className='group-hover:rotate-90 transition-transform duration-200' />
//        </button>
//        
//        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//          <h2 className="text-2xl font-bold text-gray-800">Select Tutorial</h2>
//          <div className="flex gap-4 items-center">
//            <button
//              onClick={handleSelectAll}
//              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-all duration-200 shadow-sm"
//            >
//              {selectedIds.length === effectiveTutorials.length ? 'Unselect All' : 'Select All'}
//            </button>
//            <button
//              onClick={handleAddNewTutorial}
//              className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
//            >
//              <Plus size={18} /> Add New Tutorial
//            </button>
//          </div>
//        </div>
//        
//        <div className="flex-1 p-6 overflow-y-auto">
//          {isLoading ? (
//            <div className="w-full">
//              <p className="text-sm text-gray-500 mb-4">Loading video tutorials...</p>
//              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                {Array.from({ length: 8 }).map((_, idx) => (
//                  <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
//                    <div className="aspect-video bg-gray-200" />
//                    <div className="p-4">
//                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
//                      <div className="h-3 bg-gray-200 rounded w-5/6" />
//                    </div>
//                  </div>
//                ))}
//              </div>
//            </div>
//          ) : effectiveTutorials.length === 0 ? (
//            <div className="flex flex-col items-center justify-center h-full text-center py-12">
//              <div className="mb-6">
//                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 80 80">
//                  <rect width="80" height="80" rx="20" fill="#ede8f3"/>
//                  <path d="M28 26c-2.21 0-4 1.79-4 4v20c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4v-4.382l7.447 4.468A2 2 0 0 0 56 48.382V31.618a2 2 0 0 0-3.553-1.686L45 34.382V30c0-2.21-1.79-4-4-4H28Z" fill="#a78bfa"/>
//                </svg>
//              </div>
//              <p className="text-lg text-gray-600 mb-4">No video tutorials found.</p>
//              <button
//                onClick={handleAddNewTutorial}
//                className="bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-purple-800 transition-colors flex items-center"
//              >
//                <Plus size={20} className="mr-2" /> Create New Video Tutorial
//              </button>
//            </div>
//          ) : (
//            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//              {effectiveTutorials.map((tutorial: any) => {
//                const isSelected = selectedIds.includes(tutorial.id);
//                // Thumbnail/preview logic
//                const featuredImage = tutorial.featured_image || tutorial.featuredImage || tutorial.thumbnail_url || tutorial.thumbnailUrl || '';
//                const featuredVideoUrl = tutorial.featured_video_url || tutorial.featuredVideoUrl || '';
//                const videoUrl = tutorial.video_url || tutorial.videoUrl || '';
//                return (
//                  <div
//                    key={tutorial.id}
//                    className={`relative bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl group ${
//                      isSelected 
//                        ? 'border-2 border-purple-600 ring-4 ring-purple-200 shadow-xl transform scale-105' 
//                        : 'border border-gray-200'
//                    }`}
//                    onClick={() => handleSelect(tutorial.id)}
//                    tabIndex={0}
//                  >
//                    {/* Selection Overlay */}
//                    {isSelected && (
//                      <div className="absolute inset-0 bg-purple-600/10 z-10 pointer-events-none" />
//                    )}
//                    {/* Checkbox */}
//                    <div className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 z-20 shadow-sm ${
//                      isSelected 
//                        ? 'bg-purple-600 border-purple-600 scale-110' 
//                        : 'bg-white border-gray-300 group-hover:border-purple-400'
//                    }`}>
//                      {isSelected && <Check size={16} className="text-white" />}
//                    </div>
//                    {/* Edit Button */}
//                    <button
//                      type="button"
//                      className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg z-20 transition-all duration-200 opacity-0 group-hover:opacity-100"
//                      onClick={e => {
//                        e.stopPropagation();
//                        // Navigate to /create-tutorial with id param
//                        navigate(`/create-tutorial?id=${tutorial.id}`);
//                      }}
//                      title="Edit Tutorial"
//                    >
//                      <PencilIcon size={16} className="text-gray-600 hover:text-purple-600 transition-colors" />
//                    </button>
//                    {/* Preview Container */}
//                    <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
//                      {featuredImage ? (
//                        <div className="relative w-full h-full">
//                          <img 
//                            src={featuredImage} 
//                            alt={tutorial.title} 
//                            className="w-full h-full object-cover" 
//                          />
//                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
//                              <Eye size={24} className="text-purple-600" />
//                            </div>
//                          </div>
//                        </div>
//                      ) : featuredVideoUrl ? (
//                        (() => {
//                          const videoType = getVideoType(featuredVideoUrl);
//                          if (videoType === 'youtube') {
//                            const embedUrl = getYouTubeEmbedUrl(featuredVideoUrl);
//                            return (
//                              <iframe
//                                src={embedUrl}
//                                className="w-full h-full"
//                                frameBorder="0"
//                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                allowFullScreen
//                              />
//                            );
//                          }
//                          if (videoType === 'vimeo') {
//                            const embedUrl = getVimeoEmbedUrl(featuredVideoUrl);
//                            return (
//                              <iframe
//                                src={embedUrl}
//                                className="w-full h-full"
//                                frameBorder="0"
//                                allow="autoplay; fullscreen; picture-in-picture"
//                                allowFullScreen
//                              />
//                            );
//                          }
//                          // Direct video files
//                          return (
//                            <div className="relative w-full h-full">
//                              <video
//                                key={featuredVideoUrl}
//                                ref={(el) => { videoRefs.current[String(tutorial.id)] = el; }}
//                                src={featuredVideoUrl}
//                                className="w-full h-full object-cover"
//                                preload="metadata"
//                                controls={playingId === tutorial.id}
//                                crossOrigin="anonymous"
//                                onLoadedMetadata={() => console.log('[TutorialSelectionModal] video loaded', tutorial.id, featuredVideoUrl)}
//                                onError={(e) => console.error('[TutorialSelectionModal] video error', tutorial.id, featuredVideoUrl, e)}
//                                onClick={(e) => { e.stopPropagation(); }}
//                                onEnded={() => { if (playingId === tutorial.id) setPlayingId(null); }}
//                              />
//                              {/* Play Overlay */}
//                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                <div
//                                  className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
//                                  onClick={(e) => {
//                                    e.stopPropagation();
//                                    const key = String(tutorial.id);
//                                    const current = videoRefs.current[key];
//                                    // Pause other playing video
//                                    if (playingId && String(playingId) !== key) {
//                                      const prev = videoRefs.current[String(playingId)];
//                                      try { prev?.pause(); } catch (err) { /* ignore */ }
//                                    }
//                                    if (!current) return;
//                                    if (playingId === tutorial.id) {
//                                      current.pause();
//                                      setPlayingId(null);
//                                    } else {
//                                      current.play().then(() => setPlayingId(tutorial.id)).catch((err) => console.warn('Play failed', err));
//                                    }
//                                  }}
//                                  role="button"
//                                  tabIndex={0}
//                                >
//                                  {playingId === tutorial.id ? <Pause size={24} className="text-purple-600" /> : <Play size={24} className="text-purple-600 ml-1" />}
//                                </div>
//                              </div>
//                            </div>
//                          );
//                        })()
//                      ) : videoUrl ? (
//                        (() => {
//                          const videoType = getVideoType(videoUrl);
//                          if (videoType === 'youtube') {
//                            const embedUrl = getYouTubeEmbedUrl(videoUrl);
//                            return (
//                              <iframe
//                                src={embedUrl}
//                                className="w-full h-full"
//                                frameBorder="0"
//                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                allowFullScreen
//                              />
//                            );
//                          }
//                          if (videoType === 'vimeo') {
//                            const embedUrl = getVimeoEmbedUrl(videoUrl);
//                            return (
//                              <iframe
//                                src={embedUrl}
//                                className="w-full h-full"
//                                frameBorder="0"
//                                allow="autoplay; fullscreen; picture-in-picture"
//                                allowFullScreen
//                              />
//                            );
//                          }
//                          // Direct video files
//                          return (
//                            <div className="relative w-full h-full">
//                              <video
//                                key={videoUrl}
//                                ref={(el) => { videoRefs.current[String(tutorial.id)] = el; }}
//                                src={videoUrl}
//                                className="w-full h-full object-cover"
//                                preload="metadata"
//                                controls={playingId === tutorial.id}
//                                crossOrigin="anonymous"
//                                onLoadedMetadata={() => console.log('[TutorialSelectionModal] video loaded', tutorial.id, videoUrl)}
//                                onError={(e) => console.error('[TutorialSelectionModal] video error', tutorial.id, videoUrl, e)}
//                                onClick={(e) => { e.stopPropagation(); }}
//                                onEnded={() => { if (playingId === tutorial.id) setPlayingId(null); }}
//                              />
//                              {/* Play Overlay */}
//                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
//                                <div
//                                  className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
//                                  onClick={(e) => {
//                                    e.stopPropagation();
//                                    const key = String(tutorial.id);
//                                    const current = videoRefs.current[key];
//                                    // Pause other playing video
//                                    if (playingId && String(playingId) !== key) {
//                                      const prev = videoRefs.current[String(playingId)];
//                                      try { prev?.pause(); } catch (err) { /* ignore */ }
//                                    }
//                                    if (!current) return;
//                                    if (playingId === tutorial.id) {
//                                      current.pause();
//                                      setPlayingId(null);
//                                    } else {
//                                      current.play().then(() => setPlayingId(tutorial.id)).catch((err) => console.warn('Play failed', err));
//                                    }
//                                  }}
//                                  role="button"
//                                  tabIndex={0}
//                                >
//                                  {playingId === tutorial.id ? <Pause size={24} className="text-purple-600" /> : <Play size={24} className="text-purple-600 ml-1" />}
//                                </div>
//                              </div>
//                            </div>
//                          );
//                        })()
//                      ) : (
//                        <div className="w-full h-full flex items-center justify-center">
//                          <div className="text-center">
//                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" className="mx-auto mb-2 opacity-60">
//                              <rect width="48" height="48" rx="12" fill="#ede8f3"/>
//                              <path d="M18 16c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h8c1.105 0 2-.895 2-2v-2.629l4.468 2.68A1 1 0 0 0 34 29.191V18.809a1 1 0 0 0-1.553-.843L28 20.629V18c0-1.105-.895-2-2-2h-8Z" fill="#a78bfa"/>
//                            </svg>
//                            <p className="text-xs text-gray-500">No preview</p>
//                          </div>
//                        </div>
//                      )}
//                    </div>
//                    {/* Content */}
//                    <div className="p-4 space-y-2">
//                      <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors">
//                        {tutorial.title}
//                      </h3>
//                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
//                        {tutorial.description}
//                      </p>
//                      {/* Metadata */}
//                      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
//                        <div className="flex items-center gap-1">
//                          <Clock size={12} />
//                          <span>5 min</span>
//                        </div>
//                      </div>
//                    </div>
//                    {/* Selected Indicator */}
//                    {isSelected && (
//                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600" />
//                    )}
//                  </div>
//                );
//              })}
//            </div>
//          )}
//        </div>
//        
//        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50/50">
//          <p className="text-sm text-gray-600">
//            {selectedIds.length > 0 ? `${selectedIds.length} tutorial${selectedIds.length === 1 ? '' : 's'} selected` : 'Select tutorials to add'}
//          </p>
//          <div className="flex gap-3">
//            <button
//              onClick={closeTutorialModal}
//              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//            >
//              Cancel
//            </button>
//            <button
//              onClick={handleAddSelected}
//              disabled={selectedIds.length === 0}
//              className={`px-6 py-2 font-semibold rounded-lg shadow-md transition-all duration-200 ${
//                selectedIds.length === 0 
//                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
//                  : 'bg-purple-700 text-white hover:bg-purple-800 hover:shadow-lg'
//              }`}
//            >
//              Add Selected ({selectedIds.length})
//            </button>
//          </div>
//        </div>
//      </div>
//    </div>
//  );
//};
//
//export default TutorialSelectionModal;
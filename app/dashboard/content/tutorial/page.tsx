"use client";
import {
  Calendar,
  Clock,
  Edit3,
  Eye,
  Minus,
  Play,
  Plus,
  Save,
  Upload,
  Users,
} from "lucide-react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import DropdownSelect from "@/components/DropdownSelect";
import ResponseModal from "@/components/ResponseModal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddTutorial,
  useTutorial,
  useUpdateTutorial,
} from "@/hooks/brands/useFeatureApi";
import { useEnableFeature } from "@/hooks/brands/useEnableDisableFeatures";
import { useExperienceStore } from "@/store/brands/useExperienceStore";
import { uploadFile } from "@/services/brands/uploadService";
import { showToast } from "@/utils/toast";
import ProductUsedCard from "./ProductsUsedCard";
import TutorialPreviewPage from "./TutorialPreview";
import { validateTutorial } from "./TutorialValidation";

interface TutorialStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  products: Product[];
  imageUrl?: string;
  videoUrl?: string;
  tips: string[];
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  shade?: string;
  amount?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalDuration: string;
  skinTypes: string[];
  occasion: string[];
  tags: string[];
  steps: TutorialStep[];
  featuredImage?: string;
  videoUrl?: string; // Added for featured video URL
  videoThumbnail?: string;
}

const TUTORIAL_DRAFT_KEY = "tutorial_draft";

const TutorialCreatorContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "steps" | "products" | "preview"
  >("overview");
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  
  // Determine mode from search params
  const mode = searchParams.get('mode') === 'edit' ? 'edit' : 'create';
  
  // Detect if navigation originated from TutorialSelectionModal
  // In Next.js, we can't access location.state directly, so we'll use URL params instead
  const fromModal = searchParams.get("fromModal") === "true";
  
  // Detect if user came from experience step 2 (callback)
  const fromExperience =
    searchParams.get("from") === "experience" &&
    searchParams.get("step") === "2";

  // Get experience ID for callback navigation
  const experienceId = searchParams.get("experienceId");

  // Extract tutorial ID from URL params (for dynamic routes) or search params (for legacy)
  const tutorialId = params.id as string || searchParams.get("id");

  // Fetch tutorial if editing
  const { data: fetchedTutorial, isLoading: isFetchingTutorial } = useTutorial(
    tutorialId || undefined
  );
  const updateTutorialMutation = useUpdateTutorial();

  // Backend mutation hook
  const addTutorialMutation = useAddTutorial();
  const enableFeatureMutation = useEnableFeature();
  
  // Zustand store for updating local state
  const { setFeaturesForExperience, getFeaturesForExperience } = useExperienceStore();

  // Load draft from localStorage if present (only in create mode)
  const getInitialTutorial = (): Tutorial => {
    if (mode === "create") {
      try {
        const draft = localStorage.getItem(TUTORIAL_DRAFT_KEY);
        if (draft) {
          return JSON.parse(draft) as Tutorial;
        }
      } catch (e) {
        // ignore
      }
    }
    return {
      id: Date.now().toString(),
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      totalDuration: "",
      skinTypes: [],
      occasion: [],
      tags: [],
      steps: [
        {
          id: "1",
          stepNumber: 1,
          title: "",
          description: "",
          duration: "",
          products: [],
          tips: [""],
        },
      ],
      featuredImage: "",
      videoUrl: "",
    };
  };

  const [tutorial, setTutorial] = useState<Tutorial>(getInitialTutorial);
  // Response modal state for callback flow
  const [showResponseModal, setShowResponseModal] = useState(false);
  // Pre-fill form if editing
  useEffect(() => {
    if (
      mode === "edit" &&
      tutorialId &&
      fetchedTutorial &&
      (fetchedTutorial as any).data
    ) {
      // Map backend fields to frontend fields
      const t = (fetchedTutorial as any).data;
      setTutorial({
        id: t.id,
        title: t.title || "",
        description: t.description || "",
        category: t.category || "",
        difficulty: t.difficulty || "Beginner",
        totalDuration: t.total_duration || t.totalDuration || "",
        skinTypes: t.skin_types || t.skinTypes || [],
        occasion: t.occasions || t.occasion || [],
        tags: t.tags || [],
        steps:
          typeof t.steps === "string" ? JSON.parse(t.steps) : t.steps || [],
        featuredImage: t.featured_image || t.featuredImage || "",
        videoUrl: t.video_url || t.videoUrl || "",
        videoThumbnail: t.video_thumbnail || t.videoThumbnail || "",
      });
    }
  }, [mode, tutorialId, fetchedTutorial]);

  // Persist draft to localStorage on change (only in create mode)
  useEffect(() => {
    if (mode === "create") {
      try {
        localStorage.setItem(TUTORIAL_DRAFT_KEY, JSON.stringify(tutorial));
      } catch (e) {
        // ignore
      }
    }
  }, [tutorial, mode]);

  const categories = [
    "Skincare",
    "Makeup",
    "Haircare",
    "Evening Look",
    "Day Look",
    "Special Occasion",
    "Anti-Aging",
    "Acne Care",
    "Hydration",
    "Cleansing",
    "Brightening",
    "Contouring",
    "Fragrance",
  ];

  // const difficulties = ["Beginner", "Intermediate", "Advanced", "Professional"];

  const skinTypes = [
    "Normal",
    "Dry",
    "Oily",
    "Combination",
    "Sensitive",
    "Mature",
  ];

  const occasions = [
    "Daily",
    "Work",
    "Evening",
    "Party",
    "Wedding",
    "Date Night",
    "Travel",
    "Summer",
    "Winter",
    "Special Event",
  ];

  // const productCategories = [ ... ];

  // Step Management Functions
  const addStep = () => {
    const newStep: TutorialStep = {
      id: Date.now().toString(),
      stepNumber: 1,
      title: "",
      description: "",
      duration: "",
      products: [],
      tips: [""],
    };
    // Insert new step at the top, then re-number all steps
    const newSteps = [newStep, ...tutorial.steps].map((step, idx) => ({
      ...step,
      stepNumber: idx + 1,
    }));
    setTutorial({
      ...tutorial,
      steps: newSteps,
    });
  };

  const removeStep = (stepId: string) => {
    if (tutorial.steps.length > 1) {
      const filteredSteps = tutorial.steps
        .filter((step) => step.id !== stepId)
        .map((step, index) => ({ ...step, stepNumber: index + 1 }));

      setTutorial({
        ...tutorial,
        steps: filteredSteps,
      });
    }
  };

  const updateStep = (
    stepId: string,
    field: keyof TutorialStep,
    value: any
  ) => {
    setTutorial({
      ...tutorial,
      steps: tutorial.steps.map((step) =>
        step.id === stepId ? { ...step, [field]: value } : step
      ),
    });
  };

  // Product Management Functions
  /* const addProductToStep = (stepId: string) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      brand: "",
      category: "",
      shade: "",
      amount: "",
    };

    const updatedSteps = tutorial.steps.map((step) =>
      step.id === stepId
        ? { ...step, products: [...step.products, newProduct] }
        : step
    );

    setTutorial({ ...tutorial, steps: updatedSteps });
  };
 */
  const removeProductFromStep = (stepId: string, productId: string) => {
    const updatedSteps = tutorial.steps.map((step) =>
      step.id === stepId
        ? { ...step, products: step.products.filter((p) => p.id !== productId) }
        : step
    );

    setTutorial({ ...tutorial, steps: updatedSteps });
  };

  const updateProduct = (
    stepId: string,
    productId: string,
    field: keyof Product,
    value: string
  ) => {
    const updatedSteps = tutorial.steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            products: step.products.map((product) =>
              product.id === productId
                ? { ...product, [field]: value }
                : product
            ),
          }
        : step
    );

    setTutorial({ ...tutorial, steps: updatedSteps });
  };

  // Tip Management Functions
  const addTipToStep = (stepId: string) => {
    const updatedSteps = tutorial.steps.map((step) =>
      step.id === stepId ? { ...step, tips: [...step.tips, ""] } : step
    );

    setTutorial({ ...tutorial, steps: updatedSteps });
  };

  const removeTipFromStep = (stepId: string, tipIndex: number) => {
    const updatedSteps = tutorial.steps.map((step) =>
      step.id === stepId
        ? { ...step, tips: step.tips.filter((_, index) => index !== tipIndex) }
        : step
    );

    setTutorial({ ...tutorial, steps: updatedSteps });
  };

  const updateTip = (stepId: string, tipIndex: number, value: string) => {
    const updatedSteps = tutorial.steps.map((step) =>
      step.id === stepId
        ? {
            ...step,
            tips: step.tips.map((tip, index) =>
              index === tipIndex ? value : tip
            ),
          }
        : step
    );

    setTutorial({ ...tutorial, steps: updatedSteps });
  };

  // Tag and Array Management Functions
  const toggleArrayItem = (
    field: "skinTypes" | "occasion" | "tags",
    item: string
  ) => {
    const currentArray = tutorial[field];
    const isSelected = currentArray.includes(item);

    if (isSelected) {
      setTutorial({
        ...tutorial,
        [field]: currentArray.filter((i) => i !== item),
      });
    } else {
      setTutorial({
        ...tutorial,
        [field]: [...currentArray, item],
      });
    }
  };

  // const addCustomTag = (tag: string) => { ... };

  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };
  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);
    // Use shared validation function (tags not required, videoUrl not required)
    const validation = validateTutorial(tutorial);
    setValidationErrors(validation.errors);
    if (validation.allFieldsFilledButStepsIncomplete) {
      showToast.error("Please complete all steps before saving.");
      return;
    } else if (!validation.valid) {
      showToast.error("Please fix the errors before saving.");
      return;
    }
    // Prepare payload for backend (no experience_id)
    const payload = {
      ...tutorial,
    };
    try {
      if (mode === "edit" && tutorialId) {
        // Update: use updateTutorialMutation with { tutorialId, data }
        await updateTutorialMutation.mutateAsync({ tutorialId, data: payload });
        showToast.success("Tutorial updated successfully!");
      } else {
        // Create
        await addTutorialMutation.mutateAsync(payload);
        showToast.success("Tutorial created successfully!");
        
        // Enable tutorials feature if user came from experience creation
        if (fromExperience && experienceId) {
          try {
            await enableFeatureMutation.mutateAsync({
              experienceId: experienceId,
              featureName: "tutorialsRoutines"
            });
            
            // Update the local store to keep UI in sync
            const currentFeatures = getFeaturesForExperience(experienceId) || {
              tutorialsRoutines: false,
              ingredientList: false,
              loyaltyPoints: false,
              skinRecommendations: false,
              chatbot: false,
              feedbackForm: true,
              customerService: false,
              productUsage: false,
            };
            
            setFeaturesForExperience(experienceId, {
              ...currentFeatures,
              tutorialsRoutines: true
            });
            
            showToast.success("Tutorials & Routines feature has been enabled!");
          } catch (error) {
            console.error("Failed to enable tutorials feature:", error);
            showToast.error("Tutorial created, but failed to enable feature. Please enable it manually.");
          }
        }
        
        // Clear draft from localStorage after successful save
        try {
          localStorage.removeItem(TUTORIAL_DRAFT_KEY);
        } catch (e) {}
        
        if (fromExperience) {
          setShowResponseModal(true);
          return;
        }
        router.back(); // Go back to previous page after creation
      }
      // If navigated from modal, go back after save
      if (fromModal) {
        router.back(); // Go back to modal
      }
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save tutorial.");
      showToast.error(err?.message || "Failed to save tutorial.");
    }
  };

  // Handler for "Continue to Experience" in response modal
  const handleContinueToExperience = () => {
    setShowResponseModal(false);
    // Go back to the experience editing page step 2 (customise-features)
    if (fromExperience && experienceId) {
      router.push(`/dashboard/experience/edit/${experienceId}?step=customise-features`);
    } else if (fromExperience) {
      // Fallback to the create experience page
      router.push("/dashboard/experience/create?step=customise-features");
    } else {
      // Default behavior for non-experience flows
      router.push("/dashboard/content");
    }
  };

  // Handler for "Create more" in response modal
  const handleCreateMore = () => {
    setShowResponseModal(false);
    // Reset form for new tutorial
    setTutorial({
      id: Date.now().toString(),
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      totalDuration: "",
      skinTypes: [],
      occasion: [],
      tags: [],
      steps: [
        {
          id: "1",
          stepNumber: 1,
          title: "",
          description: "",
          duration: "",
          products: [],
          tips: [""],
        },
      ],
      featuredImage: "",
      videoUrl: "",
    });
  };

  // Skeleton component for loading state
  const TutorialFormSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header Skeleton */}
      <div className=" px-6 sticky top-0 z-10  ">
        <div className="sm:max-w-7xl max-w-sm mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-3 lg:block hidden">
              <div className="flex justify-between gap-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-6 py-6">
        {/* Navigation Tabs Skeleton */}
        <div className="mb-6 px-2">
          <nav className="flex space-x-8 border-b border-gray-200">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-16" />
          </nav>
        </div>

        {/* Form Content Skeleton */}
        <div className="md:bg-white px-1 md:rounded-lg md:shadow">
          <div className="md:p-6 px-2">
            <Skeleton className="h-6 w-48 mb-6" />
            
            {/* Basic Information Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="md:col-span-2">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            {/* Featured Image and Video Skeleton */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            {/* Skin Types Skeleton */}
            <div className="mb-6">
              <Skeleton className="h-4 w-40 mb-3" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20" />
                ))}
              </div>
            </div>

            {/* Occasions Skeleton */}
            <div className="mb-18">
              <Skeleton className="h-4 w-36 mb-3" />
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-16" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar Skeleton */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="flex-1 h-10" />
        </div>
      </div>
    </div>
  );

  // Show skeleton while fetching tutorial data in edit mode
  if (mode === "edit" && isFetchingTutorial) {
    return <TutorialFormSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Header */}
      <div className=" px-6 sticky top-0 z-10">
        <div className="sm:max-w-7xl max-w-sm mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Tutorial & Routine
            </h1>
            <div className="flex gap-3 lg:block hidden">
              <div className="flex justify-between gap-3">
              <button
                onClick={handlePreview}
                className="flex items-center px-4 py-2 text-purple-800 bg-white border border-purple-300 rounded-xl hover:bg-purple-50 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-purple-800 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={
                  isFetchingTutorial ||
                  addTutorialMutation.status === "pending" ||
                  updateTutorialMutation.status === "pending"
                }
              >
                {(addTutorialMutation.status === "pending" || updateTutorialMutation.status === "pending") ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {tutorialId ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {tutorialId ? "Update Tutorial" : "Publish Tutorial"}
                  </>
                )}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-6 py-6">
        {/* Save feedback */}
        {saveError && (
          <div className="mb-4 absolute top-2 mx-auto justify-center p-3 bg-red-100 text-red-700 rounded">
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Tutorial saved successfully!
          </div>
        )}
        {/* Loading state handled by status === 'pending' above */}
        {/* Navigation Tabs */}
        <div className="mb-6 px-2">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: "overview", label: "Overview", icon: Edit3 },
              { id: "steps", label: "Steps", icon: Play },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-2 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-800 text-purple-800"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="md:bg-white px-1 md:rounded-lg md:shadow">
          {activeTab === "overview" && (
            <div className="md:p-6 px-2">
              <h2 className="text-xl text-purple-800 font-semibold mb-6">
                Tutorial Overview
              </h2>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                    Tutorial Title *
                  </label>
                  <input
                    type="text"
                    value={tutorial.title}
                    onChange={(e) =>
                      setTutorial({ ...tutorial, title: e.target.value })
                    }
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                      validationErrors.some((e) =>
                        e.toLowerCase().includes("tutorial title")
                      )
                        ? "border-red-500 bg-red-50"
                        : "border-purple-900"
                    } ${tutorial.title ? "bg-[#ede8f3]" : ""}`}
                    placeholder="e.g., Ultimate Skincare Routine"
                  />
                  {validationErrors
                    .filter((e) => e.toLowerCase().includes("tutorial title"))
                    .map((err, idx) => (
                      <div key={idx} className="text-xs text-red-600 mt-1">
                        {err}
                      </div>
                    ))}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={tutorial.description}
                    onChange={(e) =>
                      setTutorial({ ...tutorial, description: e.target.value })
                    }
                    rows={3}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${
                      validationErrors.some((e) =>
                        e.toLowerCase().includes("tutorial description")
                      )
                        ? "border-red-500 bg-red-50"
                        : "border-purple-900"
                    } ${tutorial.description ? "bg-[#ede8f3]" : ""}`}
                    placeholder="Describe what this tutorial covers..."
                  ></textarea>
                  {validationErrors
                    .filter((e) =>
                      e.toLowerCase().includes("tutorial description")
                    )
                    .map((err, idx) => (
                      <div key={idx} className="text-xs text-red-600 mt-1">
                        {err}
                      </div>
                    ))}
                </div>

                <div>
                  <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                    Category
                  </label>
                  <DropdownSelect
                    value={tutorial.category}
                    onChange={(val) =>
                      setTutorial({ ...tutorial, category: val })
                    }
                    options={categories}
                    placeholder="Select category"
                    className={
                      validationErrors.some((e) =>
                        e.toLowerCase().includes("category")
                      )
                        ? "border-red-500 bg-red-50"
                        : ""
                    }
                  />
                  {validationErrors
                    .filter((e) => e.toLowerCase().includes("category"))
                    .map((err, idx) => (
                      <div key={idx} className="text-xs text-red-600 mt-1">
                        {err}
                      </div>
                    ))}
                </div>

                <div>
                  <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Total Duration
                  </label>
                  <input
                    type="text"
                    value={tutorial.totalDuration}
                    onChange={(e) =>
                      setTutorial({
                        ...tutorial,
                        totalDuration: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                      validationErrors.some((e) =>
                        e.toLowerCase().includes("total duration")
                      )
                        ? "border-red-500 bg-red-50"
                        : "border-purple-900"
                    }`}
                    placeholder="e.g., 15 minutes"
                  />
                  {validationErrors
                    .filter((e) => e.toLowerCase().includes("total duration"))
                    .map((err, idx) => (
                      <div key={idx} className="text-xs text-red-600 mt-1">
                        {err}
                      </div>
                    ))}
                </div>

                {/* Featured Image and Video Side by Side */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                      Featured Image
                    </label>
                    <div
                      className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center hover:border-purple-400 transition-colors cursor-pointer bg-[#f6f2fa] relative"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ minHeight: 120 }}
                    >
                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                          <span className="text-purple-700">Uploading...</span>
                        </div>
                      )}
                      {tutorial.featuredImage ? (
                        <img
                          src={tutorial.featuredImage}
                          alt="Featured"
                          className="mx-auto mb-2 rounded-lg object-cover max-h-32"
                          style={{ maxWidth: "100%" }}
                        />
                      ) : (
                        <Upload className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                      )}
                      <span className="text-sm text-purple-700">
                        {tutorial.featuredImage
                          ? "Change image"
                          : "Upload tutorial image"}
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          setUploadError(null);
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploadingImage(true);
                          try {
                            const result = await uploadFile(
                              file,
                              "tutorial_images"
                            );
                            console.log("Image upload response:", result);
                            if (result && result.url) {
                              setTutorial((prev) => ({
                                ...prev,
                                featuredImage: result.url!,
                              }));
                            } else {
                              setUploadError("Upload failed.");
                            }
                          } catch (err: any) {
                            setUploadError(err?.message || "Upload failed.");
                          } finally {
                            setUploadingImage(false);
                          }
                        }}
                      />
                    </div>
                    {uploadError && (
                      <div className="text-red-600 text-xs mt-2">
                        {uploadError}
                      </div>
                    )}
                    {validationErrors
                      .filter((e) => e.toLowerCase().includes("featured image"))
                      .map((err, idx) => (
                        <div key={idx} className="text-xs text-red-600 mt-1">
                          {err}
                        </div>
                      ))}
                  </div>
                  <div>
                    <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                      Featured Video (YouTube, Vimeo, etc.)
                    </label>
                    <input
                      type="url"
                      value={tutorial.videoUrl || ""}
                      onChange={(e) =>
                        setTutorial({ ...tutorial, videoUrl: e.target.value })
                      }
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        validationErrors.some((e) =>
                          e.toLowerCase().includes("video")
                        )
                          ? "border-red-500 bg-red-50"
                          : "border-purple-900"
                      }`}
                      placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                    />
                  </div>
                </div>
              </div>

              {/* Skin Types */}
              <div className="mb-6">
                <label className="block text-left text-purple-800 text-sm font-semibold mb-3">
                  <Users className="w-4 h-4 inline mr-1" />
                  Suitable for Skin Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {skinTypes.map((type) => {
                    const checked = tutorial.skinTypes.includes(type);
                    return (
                      <label
                        key={type}
                        className="flex items-center cursor-pointer select-none"
                      >
                        <span
                          className={`w-5 h-5 mr-2 flex items-center justify-center rounded border-2 transition-colors duration-150 ${
                            checked
                              ? "bg-purple-700 border-purple-700"
                              : "bg-white border-purple-300"
                          } shadow-sm`}
                          style={{ minWidth: 20 }}
                        >
                          {checked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayItem("skinTypes", type)}
                          className="hidden"
                        />
                        <span className="text-sm text-purple-900">{type}</span>
                      </label>
                    );
                  })}
                  {validationErrors
                    .filter((e) => e.toLowerCase().includes("skin type"))
                    .map((err, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-red-600 mt-1 col-span-2"
                      >
                        {err}
                      </div>
                    ))}
                </div>
              </div>

              {/* Occasions */}
              <div className="mb-18">
                <label className="block text-left text-purple-800 text-sm font-semibold mb-3">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Perfect for Occasions
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {occasions.map((occasion) => {
                    const checked = tutorial.occasion.includes(occasion);
                    return (
                      <label
                        key={occasion}
                        className="flex items-center cursor-pointer select-none"
                      >
                        <span
                          className={`w-5 h-5 mr-2 flex items-center justify-center rounded border-2 transition-colors duration-150 ${
                            checked
                              ? "bg-purple-700 border-purple-700"
                              : "bg-white border-purple-300"
                          } shadow-sm`}
                          style={{ minWidth: 20 }}
                        >
                          {checked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayItem("occasion", occasion)}
                          className="hidden"
                        />
                        <span className="text-sm text-purple-900">
                          {occasion}
                        </span>
                      </label>
                    );
                  })}
                  {validationErrors
                    .filter((e) => e.toLowerCase().includes("occasion"))
                    .map((err, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-red-600 mt-1 col-span-3"
                      >
                        {err}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="md:p-6  mx-auto">
              <div className="flex px-2 md:px-0 items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl text-purple-800 font-semibold">
                  Tutorial Steps
                </h2>
                <button
                  onClick={addStep}
                  className="flex items-center px-3 md:px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>

              <div className="space-y-6 mb-18 ">
                {tutorial.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="border border-purple-200 rounded-2xl py-6 px-3 md:p-6 bg-[#f9f7fb]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-purple-900">
                        Step {step.stepNumber}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingStep(
                              editingStep === step.id ? null : step.id
                            )
                          }
                          className="p-2 text-purple-800 hover:bg-purple-100 rounded-xl"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                          disabled={tutorial.steps.length === 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                          Step Title
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) =>
                            updateStep(step.id, "title", e.target.value)
                          }
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                            validationErrors.some(
                              (e) =>
                                e.toLowerCase().includes("step") &&
                                e.toLowerCase().includes("title") &&
                                e.includes(`${index + 1}`)
                            )
                              ? "border-red-500 bg-red-50"
                              : "border-purple-900"
                          } ${step.title ? "bg-[#ede8f3]" : ""}`}
                          placeholder="e.g., Apply cleanser"
                        ></input>
                        {validationErrors
                          .filter(
                            (e) =>
                              e.toLowerCase().includes("step") &&
                              e.toLowerCase().includes("title") &&
                              e.includes(`${index + 1}`)
                          )
                          .map((err, idx2) => (
                            <div
                              key={idx2}
                              className="text-xs text-red-600 mt-1"
                            >
                              {err}
                            </div>
                          ))}
                      </div>
                      <div>
                        <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={step.duration}
                          onChange={(e) =>
                            updateStep(step.id, "duration", e.target.value)
                          }
                          className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus-border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                            validationErrors.some(
                              (e) =>
                                e.toLowerCase().includes("step") &&
                                e.toLowerCase().includes("duration") &&
                                e.includes(`${index + 1}`)
                            )
                              ? "border-red-500 bg-red-50"
                              : "border-purple-900"
                          }`}
                          placeholder="e.g., 2 minutes"
                        ></input>
                        {validationErrors
                          .filter(
                            (e) =>
                              e.toLowerCase().includes("step") &&
                              e.toLowerCase().includes("duration") &&
                              e.includes(`${index + 1}`)
                          )
                          .map((err, idx2) => (
                            <div
                              key={idx2}
                              className="text-xs text-red-600 mt-1"
                            >
                              {err}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                        Description
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) =>
                          updateStep(step.id, "description", e.target.value)
                        }
                        rows={3}
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-2 focus-ring-purple-500 focus-border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${
                          validationErrors.some(
                            (e) =>
                              e.toLowerCase().includes("step") &&
                              e.toLowerCase().includes("description") &&
                              e.includes(`${index + 1}`)
                          )
                            ? "border-red-500 bg-red-50"
                            : "border-purple-900"
                        } ${step.description ? "bg-[#ede8f3]" : ""}`}
                        placeholder="Detailed instructions for this step..."
                      ></textarea>
                      {validationErrors
                        .filter(
                          (e) =>
                            e.toLowerCase().includes("step") &&
                            e.toLowerCase().includes("description") &&
                            e.includes(`${index + 1}`)
                        )
                        .map((err, idx2) => (
                          <div key={idx2} className="text-xs text-red-600 mt-1">
                            {err}
                          </div>
                        ))}
                    </div>

                    {/* Products for this step */}
                    <div className="mb-4">
                     {/*  <div className="flex items-center justify-between mb-3">
                        <label className="block text-left text-purple-800 text-sm font-semibold">
                          Products Used
                        </label>
                        <button
                          onClick={() => addProductToStep(step.id)}
                          className="text-sm text-purple-800 hover:text-purple-900 font-semibold"
                        >
                          + Add Product
                        </button>
                      </div> */}

                      {step.products.map((product) => (
                        <div
                          key={product.id}
                          className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-3 bg-[#ede8f3] rounded-xl"
                        >
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) =>
                              updateProduct(
                                step.id,
                                product.id,
                                "name",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border-1 border-purple-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Product name"
                          />
                          <input
                            type="text"
                            value={product.brand}
                            onChange={(e) =>
                              updateProduct(
                                step.id,
                                product.id,
                                "brand",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border-1 border-purple-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Brand"
                          />
                          <input
                            type="text"
                            value={product.shade || ""}
                            onChange={(e) =>
                              updateProduct(
                                step.id,
                                product.id,
                                "shade",
                                e.target.value
                              )
                            }
                            className="px-3 py-2 border-1 border-purple-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Shade/Color"
                          />
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={product.amount || ""}
                              onChange={(e) =>
                                updateProduct(
                                  step.id,
                                  product.id,
                                  "amount",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border-1 border-purple-300 rounded-xl text-sm flex-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                              placeholder="Amount"
                            />
                            <button
                              onClick={() =>
                                removeProductFromStep(step.id, product.id)
                              }
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-xl text-sm"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips for this step */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-left text-purple-800 text-sm font-semibold">
                          Pro Tips
                        </label>
                        <button
                          onClick={() => addTipToStep(step.id)}
                          className="text-sm text-green-700 hover:text-green-900 font-semibold"
                        >
                          + Add Tip
                        </button>
                      </div>

                      {step.tips.map((tip, tIndex) => (
                        <div key={tIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tip}
                            onChange={(e) =>
                              updateTip(step.id, tIndex, e.target.value)
                            }
                            className="flex-1 px-4 py-3.5 border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                            placeholder={`Tip ${tIndex + 1}...`}
                          />
                          <button
                            onClick={() => removeTipFromStep(step.id, tIndex)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl"
                            disabled={step.tips.length === 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Media Upload */}
                    {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-left text-purple-800 text-sm font-semibold mb-2">
                          Step Image
                        </label>
                        <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center hover:border-purple-400 transition-colors cursor-pointer bg-[#f6f2fa]">
                          <Upload className="w-5 h-5 mx-auto text-purple-400 mb-1" />
                          <span className="text-xs text-purple-700">
                            Upload image
                          </span>
                        </div>
                      </div>
      
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Product Overview</h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  This section shows all products used across your tutorial
                  steps. Products are automatically gathered from individual
                  steps.
                </p>
              </div>

              <div className="space-y-4">
                {tutorial.steps.map(
                  (step) =>
                    step.products.length > 0 && (
                      <div
                        key={step.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Step {step.stepNumber}:{" "}
                          {step.title || "Untitled Step"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {step.products.map((product) => (
                            <ProductUsedCard
                              key={product.id}
                              product={product}
                            />
                          ))}
                        </div>
                      </div>
                    )
                )}

                {tutorial.steps.every((step) => step.products.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No products added yet. Add products to your tutorial steps
                    to see them here.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom action bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center px-2 md:px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center px-2 md:px-4 py-2 bg-purple-800 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isFetchingTutorial ||
              addTutorialMutation.status === "pending" ||
              updateTutorialMutation.status === "pending"
            }
          >
            {(addTutorialMutation.status === "pending" || updateTutorialMutation.status === "pending") ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {tutorialId ? "Updating..." : "Publishing..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {tutorialId ? "Update" : "Publish"}
              </>
            )}
          </button>
        </div>
      </div>
      {/* Response Modal for callback flow */}
      <ResponseModal
        isOpen={showResponseModal}
        message="Tutorial created successfully!"
        onClose={() => setShowResponseModal(false)}
        primaryActionLabel="Continue to Experience"
        onPrimaryAction={handleContinueToExperience}
        secondaryActionLabel="Create more tutorials"
        onSecondaryAction={handleCreateMore}
      />

      {/* Tutorial Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">Preview Tutorial</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <TutorialPreviewPage tutorial={tutorial} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TutorialCreator: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorial creator...</p>
        </div>
      </div>
    }>
      <TutorialCreatorContent />
    </Suspense>
  );
};

export default TutorialCreator;

'use client';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import ProductForm from "./ProductForm";
import MediaUpload from "./MediaUpload";
import { useExperienceStore, initialExperienceData } from "@/store/brands/useExperienceStore";
import { useExperienceOperations } from "@/hooks/brands/useExperienceOperations";
import { validateStepOne, scrollToError } from "@/utils/validation";
import type { ValidationErrors } from "@/utils/validation";
import { hasFormChanges, isExperienceDataEqual } from "@/utils/compare";
import ScrollToTop from "@/components/ScrollToTop";
import SavingOverlay from "@/components/SavingOverlay";
import type { UploadedImage, Experience } from "@/types/productExperience";

interface StepOneProps {
  onNext?: () => void;
  onSubmit?: (data: Experience) => Promise<void>;
  isNew?: boolean;
  buttonLabel?: string;
  isSubmitting?: boolean;
}

const StepOne: React.FC<StepOneProps> = ({
  onNext,
  onSubmit,
  isNew: isNewProp = false,
  buttonLabel = "Next",
  isSubmitting = false,
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Zustand store
  const { experienceData, setExperienceData, setIds, isLoading, setLoading } = useExperienceStore();
  const { createExperience } = useExperienceOperations();

  // Local state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [initialFormData, setInitialFormData] = useState<Experience>(initialExperienceData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get stable experience ID - FIXED: Handle both string and array params
  const experienceId = params?.id 
    ? (Array.isArray(params.id) ? params.id[0] : params.id)
    : null;
  
  // Determine if this is new experience - FIXED: Use prop if provided, otherwise derive from ID
  const isNew = isNewProp || !experienceId || experienceId === 'new';
  
  console.log('StepOne debug:', { 
    experienceId, 
    isNew, 
    isInitialized,
    hasStoreData: !!experienceData?.experienceId 
  });

  // Helper to map API/state data to form data
  const mapToFormData = useCallback((exp: any): Experience => {
    console.log("mapToFormData: exp.features", exp.features);

    let images: UploadedImage[] = [];
    const imageUrls = exp.product_image_url || exp.product?.product_image_url;
    if (Array.isArray(imageUrls)) {
      images = imageUrls.map((url: string, index: number) => ({
        id: `img-${index}-${Date.now()}`,
        url: url,
        file: undefined,
      }));
    } else if (typeof imageUrls === "string") {
      images = [
        {
          id: `img-0-${Date.now()}`,
          url: imageUrls,
          file: undefined,
        },
      ];
    }

    // Map backend features array to FeatureSettings object
    const defaultFeatures = {
      tutorialsRoutines: false,
      ingredientList: false,
      loyaltyPoints: false,
      skinRecommendations: false,
      chatbot: false,
      feedbackForm: true,
      customerService: false,
      productUsage: false,
    };
    let featuresObj = { ...defaultFeatures };
    if (Array.isArray(exp.features)) {
      exp.features.forEach((f: any) => {
        if (
          f.feature_name &&
          typeof f.is_enabled === "boolean" &&
          Object.prototype.hasOwnProperty.call(defaultFeatures, f.feature_name)
        ) {
          (featuresObj as any)[f.feature_name] = f.is_enabled;
        }
      });
    } else if (exp.features) {
      featuresObj = { ...featuresObj, ...exp.features };
    } else if (exp.product?.features) {
      featuresObj = { ...featuresObj, ...exp.product.features };
    }

    console.log("mapToFormData: mapped featuresObj", featuresObj);

    return {
      experienceId: exp.id || exp.experienceId || null,
      name: exp.name || exp.product?.name || "",
      tagline: exp.tagline || exp.product?.tagline || "",
      description: exp.description || exp.product?.description || "",
      category: exp.category || exp.product?.category || "",
      storeLink: exp.store_link || exp.product?.store_link || "",
      product_image_url: images,
      logo_url: exp.logo_url || exp.product?.logo_url || "",
      netContent: exp.net_content ?? exp.product?.net_content ?? null,
      originalPrice: exp.original_price ?? exp.product?.original_price ?? null,
      discountedPrice: exp.discounted_price ?? exp.product?.discounted_price ?? null,
      estimatedDurationDays: exp.estimated_usage_duration_days ?? exp.product?.estimated_usage_duration_days ?? 30,
      skinType: exp.skin_type || exp.product?.skin_type || "",
      features: featuresObj,
    };
  }, []);

  // SINGLE INITIALIZATION EFFECT - FIXED: Much simpler and more reliable
  useEffect(() => {
    // Skip if already initialized
    if (isInitialized) {
      console.log('Already initialized, skipping');
      return;
    }

    const initializeForm = async () => {
      console.log("Initializing form:", { isNew, experienceId });

      if (isNew) {
        // For new experiences, set empty data but preserve any existing state
        const currentData = experienceData as Experience;
        const shouldReset = !currentData?.experienceId || 
                           currentData.experienceId === 'new' || 
                           JSON.stringify(currentData) === JSON.stringify(initialExperienceData);
        
        if (shouldReset) {
          console.log('Setting new experience data');
          setExperienceData(initialExperienceData);
          setInitialFormData(initialExperienceData);
        } else {
          console.log('Preserving existing new experience data');
          setInitialFormData(currentData);
        }

        // Clean up URL if needed
        const paramsObj = new URLSearchParams(searchParams.toString());
        if (paramsObj.has("new")) {
          paramsObj.delete("new");
          const newUrl = `${window.location.pathname}${paramsObj.toString() ? `?${paramsObj.toString()}` : ""}`;
          router.replace(newUrl);
        }
      } else if (experienceId) {
        // For editing existing experiences
        console.log('Editing existing experience:', experienceId);
        
        const currentExpData = experienceData as Experience;
        
        // If store data matches the experience we're editing, use it
        if (currentExpData?.experienceId === experienceId) {
          console.log('Using existing store data for editing');
          const mapped = mapToFormData(currentExpData);
          setInitialFormData(mapped);
          // Don't reset experienceData here - preserve the current state
        } else {
          // TODO: Fetch experience data if not in store
          console.log('Need to fetch experience data for:', experienceId);
          // You would add your data fetching logic here
        }
      }

      setIsInitialized(true);
    };

    initializeForm();
  }, [isNew, experienceId, isInitialized]); // Only depend on these

  // Separate effect for handling store persistence
  useEffect(() => {
    if (!isInitialized) return;

    // When editing and we have valid data, ensure it's persisted
    if (!isNew && experienceId && experienceData?.experienceId === experienceId) {
      console.log('Ensuring edit data is persisted');
      const mapped = mapToFormData(experienceData);
      setInitialFormData(mapped);
    }
  }, [isInitialized, isNew, experienceId, experienceData, mapToFormData]);

  const validateForm = (): boolean => {
    const validationErrors = validateStepOne(experienceData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      scrollToError(validationErrors);
      return false;
    }

    return true;
  };

  const handleFormUpdate = (data: Partial<Experience>) => {
    setExperienceData(data);

    // Clear error for updated field
    const key = Object.keys(data)[0];
    if (errors[key as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [key as keyof ValidationErrors]: undefined }));
    }
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    // If onSubmit is provided (CreateProductPage), call it and do not navigate
    if (onSubmit) {
      await onSubmit(experienceData as Experience);
      return;
    }

    const currentExpData = experienceData as Experience;

    console.log("checking experience data:", currentExpData);
    console.log("initial form data:", initialFormData);

    // Check if form is unchanged using the utility function
    const unchanged = isExperienceDataEqual(initialFormData, currentExpData);

    if (unchanged && currentExpData?.experienceId) {
      // No changes, just navigate - FIXED: Use Next.js navigation
      const action = params?.action || "edit";
      router.push(`/dashboard/experience/${action}/${currentExpData.experienceId}?step=customise-features`);
      if (onNext) onNext();
      return;
    }

    // Otherwise, continue with experience creation/update flow
    setLoading(true);
    try {
      let imageUrls: string[] = [];
      const productImages = currentExpData.product_image_url;
      if (Array.isArray(productImages) && productImages.length > 0) {
        imageUrls = productImages.map((img: any) => img.url || img).filter(Boolean);
      }

      // Wrap all product fields in a product object for backend compatibility
      const product = {
        name: currentExpData.name || "",
        tagline: currentExpData.tagline || "",
        skin_type: currentExpData.skinType || null,
        description: currentExpData.description || null,
        category: currentExpData.category || "",
        store_link: currentExpData.storeLink || "",
        product_image_url: imageUrls.length > 0 ? imageUrls : null,
        logo_url: currentExpData.logo_url || null,
        original_price: currentExpData.originalPrice || null,
        discounted_price: currentExpData.discountedPrice || null,
        net_content: currentExpData.netContent || null,
        estimated_usage_duration_days: currentExpData.estimatedDurationDays ?? 30,
      };

      console.log("Prepared product data for submission:", product);

      const payload: any = { product };
      // If we have an experience id, include it for update
      if (currentExpData.experienceId && currentExpData.experienceId !== 'new') {
        payload.experience_id = currentExpData.experienceId;
      }

      const res = await createExperience(payload, currentExpData);
      console.log("CreateExperience response:", res);

      if (res?.data) {
        // Map backend features to FeatureSettings object
        const defaultFeatures = {
          tutorialsRoutines: false,
          ingredientList: false,
          loyaltyPoints: false,
          skinRecommendations: false,
          chatbot: false,
          feedbackForm: true,
          customerService: false,
          productUsage: false,
        };
        let featuresObj = { ...defaultFeatures };
        if (Array.isArray(res.data.features)) {
          res.data.features.forEach((f: any) => {
            if (
              f.feature_name &&
              typeof f.is_enabled === "boolean" &&
              Object.prototype.hasOwnProperty.call(defaultFeatures, f.feature_name)
            ) {
              (featuresObj as any)[f.feature_name] = f.is_enabled;
            }
          });
        }

        // Update experienceData in store with mapped features
        const updatedData = { 
          ...currentExpData, 
          experienceId: res.data.id,
          features: featuresObj 
        };
        setExperienceData(updatedData);
        setIds(res.data.id || null, res.data.productId || null);
        console.log("Created experience ID:", res.data.id);
        
        // Update initial form data to prevent future unnecessary saves
        setInitialFormData(updatedData);

        // Navigate to step 2 with experience id - FIXED: Use Next.js navigation
        const action = params?.action || "edit";
        router.push(`/dashboard/experience/${action}/${res.data.id}?step=customise-features`);
        if (onNext) onNext();
      }
    } catch (err) {
      // Error handling is done in the createExperience function
      console.error("Error creating experience:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debug info
  const hasChanges = hasFormChanges(initialFormData, experienceData);
  const canSkipApiCall = !hasChanges && (experienceData as Experience)?.experienceId;
  const showSavingOverlay = (isLoading || isSubmitting) && !canSkipApiCall;

  console.log("StepOne render:", {
    isInitialized,
    hasChanges,
    canSkipApiCall,
    showSavingOverlay,
    experienceId: (experienceData as Experience)?.experienceId,
  });

  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto mb-32 h-screen py-4 ">
      <ScrollToTop />
      {showSavingOverlay && <SavingOverlay visible={true} message="Saving your progress..." />}

      <div className="mx-auto">
        <div className="rounded-2xl border-gray-200 bg-white px-4 shadow-sm sm:border sm:px-6">
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
              <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
              <div>Has changes: {hasChanges ? 'Yes' : 'No'}</div>
              <div>Experience ID: {(experienceData as Experience)?.experienceId || 'None'}</div>
              <div>Mode: {isNew ? 'New' : 'Edit'}</div>
            </div>
          )}

          {/* Product Form Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-semibold text-gray-900 md:mt-4">Describe your product</h2>
              <p className="text-md text-gray-600">
                Provide essential details about your product, including its name and a comprehensive description.
              </p>
            </div>

            <ProductForm data={experienceData as Experience} onUpdate={handleFormUpdate} errors={errors} />
          </div>

          {/* Media Upload Section */}
          <div className="mb-8">
            <MediaUpload
              images={(experienceData as Experience)?.product_image_url || []}
              onImagesUpdate={(images: UploadedImage[]) => handleFormUpdate({ product_image_url: images })}
              errors={errors}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="float-right mt-12 mr-8 flex flex-col justify-end gap-3 pt-6 pb-32 sm:flex-row sm:gap-4">
          <button
            onClick={handleNext}
            disabled={isLoading || isSubmitting}
            className="order-1 w-fit rounded-xl bg-purple-800 px-8 py-3.5 font-medium text-white transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-400 sm:order-2 sm:w-auto"
          >
            {isLoading || isSubmitting ? "Saving..." : buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
'use client';
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Loading from "@/components/Loading";
import SavingOverlay from "@/components/SavingOverlay";
import ScrollToTop from "@/components/ScrollToTop";
import { useExperienceOperations } from "@/hooks/brands/useExperienceOperations";
import { initialExperienceData, useExperienceStore } from "@/store/brands/useExperienceStore";
import type { Experience, UploadedImage } from "@/types/productExperience";
import { hasFormChanges, isExperienceDataEqual } from "@/utils/compare";
import { scrollToError, validateStepOne } from "@/utils/validation";
import MediaUpload from "./MediaUpload";
import ProductForm from "./ProductForm";
import type { ValidationErrors } from "@/utils/validation";
import { showToast } from "@/utils/toast";

interface StepOneProps {
  onNext?: (experienceId?: string) => void;
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
  const { experienceData, setExperienceData, setIds, isLoading, setLoading, clearExperienceData, resetAll, fetchExperienceData } = useExperienceStore();
  const { createExperience } = useExperienceOperations();

  // Local state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [initialFormData, setInitialFormData] = useState<Experience>(initialExperienceData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get stable experience ID - FIXED: Handle both string and array params
  const experienceId = params?.id 
    ? (Array.isArray(params.id) ? params.id[0] : params.id)
    : null;
  
  // Check if new=true is in search params
  const isNewParam = searchParams.get('new') === 'true';
  
  // Determine if this is new experience - FIXED: Prioritize valid experience ID over action
  // If we have a valid experience ID (not 'new' or empty), it's an existing experience
  const isNew = (!experienceId || experienceId === 'new' || isNewParam) && isNewProp;
  
  console.log('StepOne debug:', { 
    experienceId, 
    isNew, 
    isNewParam,
    isNewProp,
    isInitialized,
    hasStoreData: !!experienceData?.experienceId 
  });

  // Helper to map API/state data to form data
  const mapToFormData = useCallback((exp: any): Experience => {
    let images: UploadedImage[] = [];
    const imageUrls = exp.product_image_url || exp.product?.product_image_url;
    
    if (Array.isArray(imageUrls)) {
      // Check if it's already UploadedImage objects or string URLs
      if (imageUrls.length > 0 && typeof imageUrls[0] === 'object' && 'url' in imageUrls[0]) {
        // Already UploadedImage objects, use them directly
        images = imageUrls as UploadedImage[];
      } else {
        // String URLs, convert to UploadedImage objects
        images = imageUrls.map((url: unknown, index: number) => ({
          id: `img-${index}-${Date.now()}`,
          url: typeof url === 'string' ? url : '',
          file: undefined,
        }));
      }
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

    const mappedData = {
      experienceId: exp.id || exp.experienceId || null,
      name: exp.name || exp.product?.name || "",
      tagline: exp.tagline || exp.product?.tagline || "",
      description: exp.description || exp.product?.description || "",
      category: exp.category || exp.product?.category || "",
      storeLink: exp.storeLink || exp.store_link || exp.product?.storeLink || exp.product?.store_link || "",
      product_image_url: images,
      logo_url: exp.logo_url || exp.product?.logo_url || "",
      netContent: exp.netContent || exp.net_content || exp.product?.netContent || exp.product?.net_content || null,
      originalPrice: exp.originalPrice ?? exp.original_price ?? exp.product?.originalPrice ?? exp.product?.original_price ?? null,
      discountedPrice: exp.discountedPrice ?? exp.discounted_price ?? exp.product?.discountedPrice ?? exp.product?.discounted_price ?? null,
      estimatedDurationDays: exp.estimatedDurationDays ?? exp.estimated_usage_duration_days ?? exp.product?.estimatedDurationDays ?? exp.product?.estimated_usage_duration_days ?? 30,
      skinType: exp.skinType || exp.skin_type || exp.product?.skinType || exp.product?.skin_type || "",
      features: featuresObj,
    };

    return mappedData;
  }, []);

  // Clean URL by removing new=true parameter
  const cleanUrl = useCallback(() => {
    const paramsObj = new URLSearchParams(searchParams.toString());
    if (paramsObj.has("new")) {
      paramsObj.delete("new");
      const newUrl = `${window.location.pathname}${paramsObj.toString() ? `?${paramsObj.toString()}` : ""}`;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  // IMMEDIATE EFFECT: Handle new=true parameter detection and store reset
  useEffect(() => {
    if (isNewParam) {
      //console.log('Detected new=true parameter - immediately resetting store and cleaning URL');
      // Immediately reset the store when new=true is detected
      clearExperienceData();
      // Clean the URL immediately
      cleanUrl();
    }
  }, [isNewParam, clearExperienceData, cleanUrl]);

  // SINGLE INITIALIZATION EFFECT - FIXED: Handle new=true parameter and existing experience data
  useEffect(() => {
    // Skip if already initialized
    if (isInitialized) {
      //console.log('Already initialized, skipping');
      return;
    }

    const initializeForm = async () => {
      //console.log("Initializing form:", { isNew, experienceId, isNewParam });

      if (isNew) {
        // For new experiences (including when new=true is in URL)
        //console.log('Setting up new experience form');
        
        // CRITICAL: Always reset to initial data for new experiences
        // This ensures that any previous data is cleared
        clearExperienceData(); // Reset the entire store
        setInitialFormData(initialExperienceData);

        // Clean up URL immediately if new=true is present
        if (isNewParam) {
          //console.log('Cleaning URL - removing new=true parameter');
          cleanUrl();
        }
      } else if (experienceId) {
        // For editing existing experiences
        console.log('Editing existing experience:', experienceId);
        
        const currentExpData = experienceData as Experience;
        console.log('Current store data:', currentExpData);
        console.log('Store experienceId:', currentExpData?.experienceId);
        console.log('URL experienceId:', experienceId);
        console.log('IDs match:', currentExpData?.experienceId === experienceId);
        
        // If store data matches the experience we're editing, use it
        if (currentExpData?.experienceId === experienceId) {
          console.log('Using existing store data for editing');
          const mapped = mapToFormData(currentExpData);
          setInitialFormData(mapped);
          // Don't reset experienceData here - preserve the current state
        } else {
          // Clear store data if we're switching to a different experience
          if (currentExpData?.experienceId && currentExpData.experienceId !== experienceId) {
            console.log('Clearing store data for different experience');
            clearExperienceData();
            setLoading(false); // Ensure loading state is reset
          }
          
          // Fetch experience data if not in store
          console.log('Need to fetch experience data for:', experienceId);
          console.log('Store has different experience ID or no data');
          
          // Fetch the experience data from the backend
          const fetchData = async () => {
            try {
              const fetchedData = await fetchExperienceData(experienceId);
              if (fetchedData) {
                console.log('Fetched experience data:', fetchedData);
                const mapped = mapToFormData(fetchedData);
                console.log('Mapped data for initialFormData:', mapped);
                setInitialFormData(mapped);
                console.log('Set initialFormData with mapped data');
              } else {
                console.log('Failed to fetch experience data, using initial data');
                setInitialFormData(initialExperienceData);
              }
            } catch (error) {
              console.error('Error fetching experience data:', error);
          setInitialFormData(initialExperienceData);
            }
          };
          
          fetchData();
        }
      }

      setIsInitialized(true);
    };

    initializeForm();
  }, [isNew, experienceId, isNewParam, isInitialized, cleanUrl, mapToFormData, clearExperienceData]);

  // Separate effect for handling store persistence - REMOVED
  // This effect was causing the initialFormData to be updated after initialization,
  // which was causing the comparison to fail when storeLink changed from "" to actual value
  // The initialFormData should only be set once during initialization

  // Check if any images are currently uploading
  const hasUploadingImages = (): boolean => {
    const images = (experienceData as Experience)?.product_image_url || [];
    return images.some((img: UploadedImage) => img.uploading === true);
  };

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
    // Check if images are currently uploading
    if (hasUploadingImages()) {
      showToast.error("Please wait for images to finish uploading before proceeding.");
      return;
    }

    // If onSubmit is provided (CreateProductPage), call it and do not navigate
    if (onSubmit) {
      await onSubmit(experienceData as Experience);
      return;
    }

    const currentExpData = experienceData as Experience;

    // Debug logs removed to prevent rebuild loops

    // Only do comparison if form is initialized and we have valid initial data
    let unchanged = false;
    if (isInitialized && initialFormData && (initialFormData.experienceId || initialFormData.name || initialFormData.category)) {
      console.log("=== COMPARISON DEBUG ===");
      console.log("initialFormData:", initialFormData);
      console.log("currentExpData:", currentExpData);
      
      unchanged = isExperienceDataEqual(initialFormData, currentExpData);
      console.log("Form unchanged:", unchanged);
      
      // Debug: Show specific field comparisons
      console.log("=== FIELD COMPARISON DEBUG ===");
      console.log("name:", initialFormData?.name, "vs", currentExpData?.name, "equal:", initialFormData?.name === currentExpData?.name);
      console.log("category:", initialFormData?.category, "vs", currentExpData?.category, "equal:", initialFormData?.category === currentExpData?.category);
      console.log("skinType:", initialFormData?.skinType, "vs", currentExpData?.skinType, "equal:", initialFormData?.skinType === currentExpData?.skinType);
      console.log("tagline:", initialFormData?.tagline, "vs", currentExpData?.tagline, "equal:", initialFormData?.tagline === currentExpData?.tagline);
      console.log("description:", initialFormData?.description, "vs", currentExpData?.description, "equal:", initialFormData?.description === currentExpData?.description);
      console.log("storeLink:", initialFormData?.storeLink, "vs", currentExpData?.storeLink, "equal:", initialFormData?.storeLink === currentExpData?.storeLink);
      console.log("product_image_url length:", initialFormData?.product_image_url?.length, "vs", currentExpData?.product_image_url?.length);
      console.log("experienceId:", initialFormData?.experienceId, "vs", currentExpData?.experienceId, "equal:", initialFormData?.experienceId === currentExpData?.experienceId);
    } else {
      console.log("Form not properly initialized yet, skipping comparison");
    }

    // Use URL experience ID if store doesn't have it (for existing experiences)
    const expIdToUse = currentExpData?.experienceId || experienceId;
    console.log("Exp ID to use:", expIdToUse);
    if (unchanged && expIdToUse) {
      // No changes, just navigate - FIXED: Use Next.js navigation
      console.log("No changes detected, navigating without API call");
      const action = params?.action || "edit";
      if (onNext) {
        onNext(expIdToUse);
      } else {
        router.push(`/dashboard/experience/${action}/${expIdToUse}?step=customise-features`);
      }
      return;
    } else {
      console.log("Form has changes or no experience ID, proceeding with API call");
    }

    // Only validate form if we're proceeding with API call
    if (!validateForm()) {
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

      //console.log("Prepared product data for submission:", product);

      const payload: any = { product };
      // If we have an experience id, include it for update
      if (currentExpData.experienceId && currentExpData.experienceId !== 'new') {
        payload.experience_id = currentExpData.experienceId;
      }

      const res = await createExperience(payload, currentExpData);
     

      if (res && typeof res === 'object' && 'data' in res) {
        const responseData = (res as any).data;
   
        
        // Check if the response has the expected structure
        if (!responseData.id) {
         // console.error("Response data missing ID:", responseData);
          showToast.error("Failed to create experience - invalid response structure");
          return;
        }
        
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
        const featuresObj = { ...defaultFeatures };
        if (Array.isArray(responseData.features)) {
          responseData.features.forEach((f: any) => {
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
          experienceId: responseData.id,
          features: featuresObj 
        };
        setExperienceData(updatedData);
        setIds(responseData.id || null, responseData.productId || null);
        console.log("Created experience ID:", responseData.id);
        
        // Update initial form data to prevent future unnecessary saves
        setInitialFormData(updatedData);

        // Navigate to step 2 with experience id - FIXED: Use Next.js navigation
        if (responseData.id) {
        const action = params?.action || "edit";
          const targetUrl = `/dashboard/experience/${action}/${responseData.id}?step=customise-features`;
         
          
          // Navigate to step 2 with experience id
         // console.log("About to navigate with experience ID:", responseData.id);
          
          // Call onNext with the experience ID if provided (for [action]/page.tsx)
          // Otherwise, use router.push for [action]/[id]/page.tsx
          if (onNext) {
            // Pass the experience ID to onNext
            onNext(responseData.id);
          } else {
            // If onNext is not provided, navigate manually
            router.push(targetUrl);
          }
        } else {
         // console.error("No experience ID in response data:", responseData);
          showToast.error("Failed to create experience - no ID returned");
        }
      }
    } catch (err) {
      // Error handling is done in the createExperience function
     // console.error("Error creating experience:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debug info
  const hasChanges = hasFormChanges(initialFormData, experienceData);
  const canSkipApiCall = !hasChanges && (experienceData as Experience)?.experienceId;
  const showSavingOverlay = (isSubmitting && !canSkipApiCall) || isLoading;
  const isUploadingImages = hasUploadingImages();

 /*  console.log("StepOne render:", {
    isInitialized,
    hasChanges,
    canSkipApiCall,
    showSavingOverlay,
    experienceId: (experienceData as Experience)?.experienceId,
    isNewParam,
    isUploadingImages,
  }); */

  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative mx-auto mb-32 md:px-8 h-screen py-4 ">
      <ScrollToTop />
      {showSavingOverlay && <SavingOverlay visible={true} message="Saving your progress..." />}

      <div className="mx-auto">
        <div className="rounded-2xl border-gray-200 bg-white px-4 shadow-sm sm:border sm:px-6">
          {/* Debug info - remove in production */}
       {/*    {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
              <div>Initialized: {isInitialized ? 'Yes' : 'No'}</div>
              <div>Has changes: {hasChanges ? 'Yes' : 'No'}</div>
              <div>Experience ID: {(experienceData as Experience)?.experienceId || 'None'}</div>
              <div>Mode: {isNew ? 'New' : 'Edit'}</div>
              <div>New Param: {isNewParam ? 'Yes' : 'No'}</div>
            </div>
          )}
 */}
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
            disabled={isLoading || isSubmitting || isUploadingImages}
            className="order-1 w-fit rounded-xl bg-purple-800 px-8 py-3.5 font-medium text-white transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-400 sm:order-2 sm:w-auto"
          >
            {isLoading || isSubmitting ? "Saving..." : isUploadingImages ? "Uploading..." : buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
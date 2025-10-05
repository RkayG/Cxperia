'use client';
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import SavingOverlay from "@/components/SavingOverlay";
import ScrollToTop from "@/components/ScrollToTop";
import { useExperienceOperations } from "@/hooks/brands/useExperienceOperations";
import { initialExperienceData, useExperienceStore } from "@/store/brands/useExperienceStore";
import type { Experience, UploadedImage } from "@/types/productExperience";
import { isExperienceDataEqual } from "@/utils/compare";
import { validateStepOne } from "@/utils/validation";
import type { ValidationErrors } from "@/utils/validation";
import MediaUpload from "./MediaUpload";
import ProductForm from "./ProductForm";

interface EditExperienceStepProps {
  onNext?: (experienceId?: string) => void;
  onSubmit?: (data: Experience) => Promise<void>;
  buttonLabel?: string;
  isSubmitting?: boolean;
}

const EditExperienceStep: React.FC<EditExperienceStepProps> = ({
  onNext,
  onSubmit,
  buttonLabel = "Customise Features",
  isSubmitting = false,
}) => {
  const router = useRouter();
  const params = useParams();
  const { experienceData, setExperienceData, setIds, isLoading, setLoading, clearExperienceData, fetchExperienceData } = useExperienceStore();
  const { createExperience } = useExperienceOperations();

  // Local state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [initialFormData, setInitialFormData] = useState<Experience>(initialExperienceData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasFormChanged, setHasFormChanged] = useState(false);

  // Get stable experience ID
  const experienceId = params?.id 
    ? (Array.isArray(params.id) ? params.id[0] : params.id)
    : null;

  // Helper to map API/state data to form data
  const mapToFormData = useCallback((exp: any): Experience => {
    let images: UploadedImage[] = [];
    const imageUrls = exp.product_image_url || exp.product?.product_image_url;
    
    if (Array.isArray(imageUrls)) {
      if (imageUrls && imageUrls.length > 0 && imageUrls[0] && typeof imageUrls[0] === 'object' && 'url' in imageUrls[0]) {
        images = imageUrls as UploadedImage[];
      } else {
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

  // Initialize form data for existing experience
  useEffect(() => {
    if (isInitialized || !experienceId) return;

    const initializeForm = async () => {
      const currentExpData = experienceData as Experience;
      
      // If store data matches the experience we're editing, use it
      if (currentExpData?.experienceId === experienceId) {
        const mapped = mapToFormData(currentExpData);
        setInitialFormData(mapped);
      } else {
        // Clear store data if we're switching to a different experience
        if (currentExpData?.experienceId && currentExpData.experienceId !== experienceId) {
          clearExperienceData();
          setLoading(false);
        }
        
        // Fetch experience data from backend
        try {
          const fetchedData = await fetchExperienceData(experienceId);
          if (fetchedData) {
            const mapped = mapToFormData(fetchedData);
            setInitialFormData(mapped);
          } else {
            setInitialFormData(initialExperienceData);
          }
        } catch (error) {
          setInitialFormData(initialExperienceData);
        }
      }

      setIsInitialized(true);
    };

    initializeForm();
  }, [experienceId, isInitialized, experienceData, mapToFormData, clearExperienceData, fetchExperienceData, setLoading]);

  // Check if any images are currently uploading
  const hasUploadingImages = (): boolean => {
    const images = (experienceData as Experience)?.product_image_url || [];
    return images.some((img: UploadedImage) => img.uploading === true);
  };

  const validateForm = (): boolean => {
    const validationErrors = validateStepOne(experienceData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Map validation field names to actual form field names
      const fieldNameMap: Record<string, string> = {
        name: 'productName',
        category: 'category',
        skinType: 'skinType',
        tagline: 'tagline',
        description: 'description',
        storeLink: 'storeLink',
        images: 'images',
        estimatedDurationDays: 'estimatedDurationValue'
      };

      const firstErrorField = Object.keys(validationErrors)[0];
      const actualFieldName = fieldNameMap[firstErrorField] || firstErrorField;
      
      // Try multiple selectors to find the element
      let element = document.querySelector(`[name="${actualFieldName}"]`) ||
                   document.querySelector(`[id="${actualFieldName}"]`) ||
                   document.querySelector(`#${actualFieldName}`);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus the element if it's an input
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.focus();
        }
      }
      return false;
    }

    return true;
  };

  const handleFormUpdate = (data: Partial<Experience>) => {
    setExperienceData(data);
    setHasFormChanged(true); // Mark form as changed

    // Clear error for updated field
    const key = Object.keys(data)[0];
    if (errors[key as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [key as keyof ValidationErrors]: undefined }));
    }
  };

  const handleNext = async () => {
    // Check if images are currently uploading
    if (hasUploadingImages()) {
      return;
    }

    // If onSubmit is provided, call it and do not navigate
    if (onSubmit) {
      await onSubmit(experienceData as Experience);
      return;
    }

    const currentExpData = experienceData as Experience;
    const expIdToUse = currentExpData?.experienceId || experienceId;

    if (!hasFormChanged && expIdToUse) {
      // No changes, just navigate
      const action = params?.action || "edit";
      if (onNext) {
        onNext(expIdToUse);
      } else {
        router.push(`/dashboard/experience/${action}/${expIdToUse}?step=customise-features`);
      }
      return;
    }

    // Only validate form if we're proceeding with API call
    if (!validateForm()) {
      return;
    }

    // Update experience
    setLoading(true);
    try {
      let imageUrls: string[] = [];
      const productImages = currentExpData.product_image_url;
      if (Array.isArray(productImages) && productImages.length > 0) {
        imageUrls = productImages.map((img: any) => img.url || img).filter(Boolean);
      }

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

      const payload: any = { product };
      if (currentExpData.experienceId && currentExpData.experienceId !== 'new') {
        payload.experience_id = currentExpData.experienceId;
      }

      const res = await createExperience(payload, currentExpData);

      if (res && typeof res === 'object' && 'data' in res) {
        const responseData = (res as any).data;

        if (!responseData.id) {
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
        
        // Update initial form data to prevent future unnecessary saves
        setInitialFormData(updatedData);
        setHasFormChanged(false); // Reset form changed flag after successful save

        // Navigate to step 2 with experience id
        if (responseData.id) {
          const action = params?.action || "edit";
          const targetUrl = `/dashboard/experience/${action}/${responseData.id}?step=customise-features`;
          
          if (onNext) {
            onNext(responseData.id);
          } else {
            router.push(targetUrl);
          }
        }
      }
    } catch (err) {
      // Error handling is done in the createExperience function
    } finally {
      setLoading(false);
    }
  };

  const isUploadingImages = hasUploadingImages();
  const showSavingOverlay = (isSubmitting && !isSubmitting) || isLoading;

  // Show loading state until initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="relative mx-auto mb-32 px-1.5 md:px-8 h-screen py-4">
      <ScrollToTop />
      {showSavingOverlay && <SavingOverlay visible={true} message="Saving your progress..." />}

      <div className="mx-auto">
        <div className="rounded-2xl border-gray-200 bg-white px-4 shadow-sm sm:border sm:px-6">
          {/* Product Form Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 md:mt-4">Describe your product</h2>
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
            className="order-1 w-fit rounded-xl bg-purple-800 px-8 lg:py-3.5 py-3 font-medium text-white transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-400 sm:order-2 sm:w-auto"
          >
            {isLoading || isSubmitting ? "Saving..." : isUploadingImages ? "Uploading..." : buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExperienceStep;

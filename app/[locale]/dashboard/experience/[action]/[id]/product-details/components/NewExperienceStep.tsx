'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import SavingOverlay from "@/components/SavingOverlay";
import ScrollToTop from "@/components/ScrollToTop";
import { useExperienceOperations } from "@/hooks/brands/useExperienceOperations";
import { initialExperienceData, useExperienceStore } from "@/store/brands/useExperienceStore";
import type { Experience, UploadedImage } from "@/types/productExperience";
import { validateStepOne } from "@/utils/validation";
import type { ValidationErrors } from "@/utils/validation";
import MediaUpload from "./MediaUpload";
import ProductForm from "./ProductForm";

interface NewExperienceStepProps {
  onNext?: (experienceId?: string) => void;
  onSubmit?: (data: Experience) => Promise<void>;
  buttonLabel?: string;
  isSubmitting?: boolean;
}

const NewExperienceStep: React.FC<NewExperienceStepProps> = ({
  onNext,
  onSubmit,
  buttonLabel = "Features ->",
  isSubmitting = false,
}) => {
  const router = useRouter();
  const { experienceData, setExperienceData, setIds, isLoading, setLoading, clearExperienceData, clearIds } = useExperienceStore();
  const { createExperience } = useExperienceOperations();

  // Local state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasFormChanged, setHasFormChanged] = useState(false);

  // Clear experience data when component mounts for new experience
  React.useEffect(() => {
    clearExperienceData();
    clearIds();
  }, [clearExperienceData, clearIds]);

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

    // If onSubmit is provided (CreateProductPage), call it and do not navigate
    if (onSubmit) {
      await onSubmit(experienceData as Experience);
      return;
    }

    const currentExpData = experienceData as Experience;

    // Only validate form if we're proceeding with API call
    if (!validateForm()) {
      return;
    }

    // Create new experience
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

      const payload: any = { product };

      const res = await createExperience(payload, currentExpData);

      if (res && typeof res === 'object' && 'data' in res) {
        const responseData = (res as any).data;

        // Check if the response has the expected structure
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
        setHasFormChanged(false); // Reset form changed flag after successful creation

        // Navigate to step 2 with experience id
        if (responseData.id && onNext) {
          onNext(responseData.id);
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

export default NewExperienceStep;

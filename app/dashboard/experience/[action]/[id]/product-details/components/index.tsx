"use client"
import React, { useState, useEffect, useCallback } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import ProductForm from "./ProductForm"
import MediaUpload from "./MediaUpload"
import { useExperienceStore, initialExperienceData } from "@/store/brands/useExperienceStore"
import { useExperienceOperations } from "@/hooks/brands/useExperienceOperations"
import { validateStepOne, scrollToError } from "@/utils/validation"
import type { ValidationErrors } from "@/utils/validation"
import { hasFormChanges, isExperienceDataEqual } from "@/utils/compare"
import ScrollToTop from "@/components/ScrollToTop"

import SavingOverlay from "@/components/SavingOverlay"
import type { UploadedImage, Experience } from "@/types/productExperience"

interface StepOneProps {
  onNext?: () => void
  onSubmit?: (data: Experience) => Promise<void>
  isNew?: boolean
  buttonLabel?: string
  isSubmitting?: boolean
}

const StepOne: React.FC<StepOneProps> = ({
  onNext,
  onSubmit,
  isNew = false,
  buttonLabel = "Next",
  isSubmitting = false,
}) => {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  // Zustand store
  const { experienceData, setExperienceData, setIds, isLoading, setLoading } = useExperienceStore()

  const { createExperience } = useExperienceOperations()

  // Local state
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [initialFormData, setInitialFormData] = useState<Experience>(() => ({
    ...initialExperienceData,
    ...useExperienceStore.getState().experienceData,
  }))

  // Get action and experienceId from route params
  const action = params?.action || "create"
  const experienceId = params?.id || null

  // Fetch experience data if editing
  /* const { data: experienceData } = useExperience(
    !isNew && experienceId ? experienceId : ""
  );
  console.log('Experience Data:', experienceData); */

  // Helper to map API/state data to form data
  const mapToFormData = useCallback((exp: any): Experience => {
    // DEBUG: Log incoming exp.features
    console.log("mapToFormData: exp.features", exp.features)
    let images: UploadedImage[] = []
    const imageUrls = exp.product_image_url || exp.product?.product_image_url
    if (Array.isArray(imageUrls)) {
      images = imageUrls.map((url: string, index: number) => ({
        id: `img-${index}-${Date.now()}`,
        url: url,
        file: undefined,
      }))
    } else if (typeof imageUrls === "string") {
      images = [
        {
          id: `img-0-${Date.now()}`,
          url: imageUrls,
          file: undefined,
        },
      ]
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
    }
    let featuresObj = { ...defaultFeatures }
    if (Array.isArray(exp.features)) {
      exp.features.forEach((f: any) => {
        if (
          f.feature_name &&
          typeof f.is_enabled === "boolean" &&
          Object.prototype.hasOwnProperty.call(defaultFeatures, f.feature_name)
        ) {
          ;(featuresObj as any)[f.feature_name] = f.is_enabled
        }
      })
    } else if (exp.features) {
      featuresObj = { ...featuresObj, ...exp.features }
    } else if (exp.product?.features) {
      featuresObj = { ...featuresObj, ...exp.product.features }
    }

    // DEBUG: Log mapped featuresObj
    console.log("mapToFormData: mapped featuresObj", featuresObj)

    // Map all fields to Experience type
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
      // Add any additional fields from backend as needed
    }
  }, [])

  // Prefill data for create/edit
  useEffect(() => {
    if (isNew) {
      // Strip new=true from URL
      const paramsObj = new URLSearchParams(searchParams.toString())
      if (paramsObj.has("new")) {
        paramsObj.delete("new")
        router.replace(`${window.location.pathname}${paramsObj.toString() ? `?${paramsObj.toString()}` : ""}`)
      }

      // Clear experience/product IDs in store
      setIds(null, null)

      // Clear data for new experience (Experience type)
      const emptyData = { ...initialExperienceData }
      if (JSON.stringify(experienceData) !== JSON.stringify(emptyData)) {
        setExperienceData(emptyData)
      }
      setInitialFormData(emptyData)
      return
    }

    // If editing, always use API data for the current experienceId
    if (!isNew && experienceId && experienceData?.data) {
      const formData = mapToFormData(experienceData.data)
      // Only update if different
      if (JSON.stringify(formData) !== JSON.stringify(experienceData)) {
        setExperienceData(formData)
      }
      setInitialFormData(formData)
      return
    }

    // Prefill from navigation state if available (for quick navigation)
    // Next.js does not support location.state, so skip this part

    // If store data exists and matches the current experienceId, use it
    if (experienceData && (experienceData as Experience).id === experienceId) {
      setInitialFormData(experienceData as Experience)
      return
    }
  }, [isNew, experienceId, experienceData, searchParams, mapToFormData, setExperienceData, router])

  const validateForm = (): boolean => {
    const validationErrors = validateStepOne(experienceData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      scrollToError(validationErrors)

      // Show toast for image errors specifically
      /*  if (validationErrors.images && Object.keys(validationErrors).length === 1) {
        showToast.error("At least one image is required.");
      } */

      return false
    }

    return true
  }

  const handleFormUpdate = (data: Partial<Experience>) => {
    setExperienceData(data)

    // Clear error for updated field
    const key = Object.keys(data)[0]
    if (errors[key as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [key as keyof ValidationErrors]: undefined }))
    }
  }

  const handleNext = async () => {
    if (!validateForm()) {
      return
    }

    // If onSubmit is provided (CreateProductPage), call it and do not navigate
    if (onSubmit) {
      await onSubmit(experienceData as Experience)
      return
    }
    console.log("checking experience data:", experienceData)
    console.log("initial form data:", initialFormData)

    // Check if form is unchanged using the utility function
    const unchanged = isExperienceDataEqual(initialFormData, experienceData)
    if (unchanged && experienceData && (experienceData as Experience).experienceId) {
      // Always sync initialFormData to the latest experienceData after successful save
      setInitialFormData(experienceData as Experience)
      router.push(`/dashboard/experience/${action}/${(experienceData as Experience).experienceId}?step=customise-features`)
      if (onNext) onNext()
      return
    }

    // Otherwise, continue with experience creation flow
    setLoading(true)
    try {
      let imageUrls: string[] = []
      const productImages = (experienceData as Experience).product_image_url
      if (Array.isArray(productImages) && productImages.length > 0) {
        imageUrls = productImages.map((img: any) => img.url || img).filter(Boolean)
      }

      const payload = {
        name: (experienceData as Experience).name,
        tagline: (experienceData as Experience).tagline,
        skin_type: (experienceData as Experience).skin_type || null,
        description: (experienceData as Experience).description || null,
        category: (experienceData as Experience).category,
        store_link: (experienceData as Experience).store_link,
        product_image_url: imageUrls.length > 0 ? imageUrls : null,
        logo_url: null,
        original_price: (experienceData as Experience).original_price || null,
        discounted_price: (experienceData as Experience).discounted_price || null,
        net_content: (experienceData as Experience).net_content || null,
        estimated_usage_duration_days: (experienceData as Experience).estimated_usage_duration_days ?? 30,
        // Add any other fields needed for the API
      }

      // If we have an experience id, include it for update
      if ((experienceData as Experience).id) {
        ;(payload as any).experience_id = (experienceData as Experience).id
      }

      const res = await createExperience(payload, experienceData as Experience)
      console.log("CreateExperience response:", res)

      // Map backend features to Experience type after createExperience returns
      if (res?.data) {
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
        }
        let featuresObj = { ...defaultFeatures }
        if (Array.isArray(res.data.features)) {
          res.data.features.forEach((f: any) => {
            if (
              f.feature_name &&
              typeof f.is_enabled === "boolean" &&
              Object.prototype.hasOwnProperty.call(defaultFeatures, f.feature_name)
            ) {
              ;(featuresObj as any)[f.feature_name] = f.is_enabled
            }
          })
        } else if (res.data.features) {
          featuresObj = { ...featuresObj, ...res.data.features }
        }

        // Update experienceData in store with mapped features
        setExperienceData({ features: featuresObj })
        setIds(res.data.id || res.data.experienceId || null, res.data.productId || null)
        // After successful save, sync initialFormData to the new experienceData
        setInitialFormData({ ...experienceData, features: featuresObj })
        // Navigate to step 2 with experience id
        router.push(`/dashboard/experience/${action}/${res.data.id}?step=customise-features`)
        if (onNext) onNext()
      }
    } catch (err) {
      // Error handling is done in the createExperience function
    } finally {
      setLoading(false)
    }
  }

  // Add debug info to UI for testing
  const hasChanges = hasFormChanges(initialFormData, experienceData)
  const canSkipApiCall = !hasChanges && (experienceData as Experience)?.id

  // Only show SavingOverlay if actually saving (not skipping API)
  const showSavingOverlay = (isLoading || isSubmitting) && !canSkipApiCall

  return (
    <div className="relative mx-auto mb-32 h-screen py-4 sm:px-6 lg:px-8">
      <ScrollToTop />
      {showSavingOverlay && <SavingOverlay visible={true} message="Saving your progress..." />}

      <div className="mx-auto">
        <div className="rounded-2xl border-gray-200 bg-white p-6 shadow-sm sm:border sm:p-8">
          {/* Debug info - remove in production */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
              <div>Has changes: {hasChanges ? 'Yes' : 'No'}</div>
              <div>Can skip API: {canSkipApiCall ? 'Yes' : 'No'}</div>
              <div>Experience ID: {experienceData.experienceId || 'None'}</div>
            </div>
          )} */}

          {/* Product Form Section */}
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">Describe your product</h2>
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
  )
}

export default StepOne

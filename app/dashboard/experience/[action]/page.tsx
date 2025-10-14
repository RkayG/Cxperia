"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import { useIsMobile } from "@/hooks/brands/use-mobile";
import { useNavigationProgressContext } from '@/contexts/NavigationProgressContext';
import ProductDetailsStep from "./[id]/product-details/components";

// This page handles the initial step of creating a new experience,
// before an experience ID has been generated.
const CreateExperiencePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const action = params.action as string;
  const { startLoading, finishLoading } = useNavigationProgressContext();

  const isMobile = useIsMobile();
  
  // Trigger navigation progress on mount
  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      finishLoading();
    }, 300);
    return () => clearTimeout(timer);
  }, [startLoading, finishLoading]);
  const steps = [
    { number: 1, label: isMobile ? "Product" : "Product Details" },
    { number: 2, label: isMobile ? "Features" : "Customize Features" },
    { number: 3, label: "Preview" },
  ];

  // This handler is called after the first step is successfully completed.
  // It receives the new experience ID and navigates to the next step.
  const handleFirstStepComplete = (newExperienceId?: string) => {
    // Validate experience ID before proceeding
    const isValidId = newExperienceId && 
                     newExperienceId !== 'undefined' && 
                     newExperienceId !== 'null' && 
                     newExperienceId !== '' && 
                     typeof newExperienceId === 'string' && 
                     newExperienceId.trim().length > 0;
    
    if (!isValidId) {
      console.error('Invalid experience ID provided:', newExperienceId);
      // Show error toast to user
      import('@/utils/toast').then(({ showToast }) => {
        showToast.error('Erreur: ID d\'expérience invalide. Veuillez réessayer.');
      });
      return;
    }
    
    router.push(`/dashboard/experience/${action}/${newExperienceId}?step=customise-features`);
  };

  return (
    <div className="min-h-screen max-w-screen-xl mx-auto bg-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Product Experience
            </h1>
          </div>
          <p className="text-gray-600 -mt-2 text-left text-sm sm:text-base leading-relaxed">
            Design a tailored post-purchase journey for your product, from detailed info to engaging interactions.
          </p>
          {/* Step Indicator - always on step 1 here */}
          <div className="mt-8 ">
            <StepIndicator currentStep={1} steps={steps} />
          </div>
        </div>
        
        {/* Render only the first step */}
        <ProductDetailsStep onNext={handleFirstStepComplete} isNew={true} />
      </div>
    </div>
  );
};

export default CreateExperiencePage;

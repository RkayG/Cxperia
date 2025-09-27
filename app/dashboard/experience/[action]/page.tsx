"use client";
import React, { useState, useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import { useExperienceStore } from "@/store/brands/useExperienceStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import StepOne from "./product-details/page";
import StepTwo from "./customise-features/page";
import PreviewPage from "./preview/page";

interface CreateExperienceFlowProps {
  stepOverride?: number;
}

const CreateExperienceFlow: React.FC<CreateExperienceFlowProps> = ({
  stepOverride,
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Zustand store
  const { resetAll } = useExperienceStore();
  
  // Get action and experienceId from route params
  const action = params?.action as string;
  const experienceIdFromRoute = params?.id as string | undefined;

  // Validate experienceId for edit action
  const isEdit = action === "edit";
  const isMissingId = isEdit && !experienceIdFromRoute;

  // Read new param from query
  const isNew = searchParams.get("new") === "true";

  // Determine step from route and query
  const getStepFromRoute = () => {
    const stepParam = searchParams.get("step");
    if (stepParam === "product-details") return 1;
    if (stepParam === "customise-features") return 2;
    if (stepParam === "preview") return 3;
    return stepOverride ?? 1;
  };

  const [step, setStepState] = useState<number>(getStepFromRoute());

  // Reset store when creating new experience
  useEffect(() => {
    if (isNew) {
      resetAll();
    }
  }, [isNew, resetAll]);

  // Update step in state and URL
  const setStep = (newStep: number) => {
    setStepState(newStep);
    const stepLabels = ["product-details", "customise-features", "preview"];
    const stepLabel = stepLabels[newStep - 1] || "product-details";
    if (stepLabel === "product-details") {
      if (action === "create") {
        router.replace("/dashboard/experience/create?step=product-details&new=true");
      } else {
        router.replace(`/dashboard/experience/edit/${experienceIdFromRoute}?step=product-details`);
      }
      return;
    }
    if (!experienceIdFromRoute) return;
    if (stepLabel === "customise-features") {
      router.replace(`/dashboard/experience/${action}/${experienceIdFromRoute}?step=customise-features`);
      return;
    }
    if (stepLabel === "preview") {
      router.replace(`/dashboard/experience/${action}/${experienceIdFromRoute}?step=preview`);
      return;
    }
  };

  // Sync step with URL changes
  useEffect(() => {
    const newStep = getStepFromRoute();
    if (newStep !== step) {
      setStepState(newStep);
    }
  }, [searchParams]);

  // Step indicator configuration
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const stepParam = searchParams.get("step");
  const steps = [
    { key: "product-details", label: isMobile ? "Product" : "Product Details" },
    { key: "customise-features", label: isMobile ? "Features" : "Customize Features" },
    { key: "preview", label: "Preview" },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.key === stepParam);
  const indicatorSteps = steps.map((s, idx) => ({ 
    number: idx + 1, 
    label: s.label 
  }));

  const handleStepOneNext = () => {
    setStep(2);
  };

  const handleStepTwoNext = () => {
    setStep(3);
  };

  const handleStepTwoBack = () => {
    if (action === "create") {
      router.push("/dashboard/experience/create?step=product-details&new=true");
    } else {
      router.push(`/dashboard/experience/edit/${experienceIdFromRoute}?step=product-details`);
    }
  };

  if (isMissingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Experience ID</h1>
          <p className="text-gray-700 mb-6">No experience ID was provided for editing. Please select a valid experience to edit.</p>
          <button
            className="px-6 py-2 bg-purple-800 text-white rounded-full font-semibold shadow hover:bg-purple-700 transition-all"
            onClick={() => router.push("/dashboard/overview")}
          >
            Go to Overview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-white ">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {action === "edit" ? "Edit Product Experience" : "Create New Product Experience"}
          </h1>
          </div>
       
          <p className="text-gray-600 text-left text-sm sm:text-base leading-relaxed">
            Design a tailored post-purchase journey for your product, from
            detailed info to engaging interactions.
          </p>

          {/* Step Indicator */}
          <div className="mt-8">
            <StepIndicator 
              currentStep={currentStepIndex + 1} 
              steps={indicatorSteps} 
            />
          </div>
        </div>

        {/* Step rendering logic */}
        {step === 1 && (
          <StepOne 
            onNext={handleStepOneNext} 
            isNew={isNew}
          />
        )}

        {step === 2 && experienceIdFromRoute && (
          <StepTwo
            onNext={handleStepTwoNext}
            onBack={handleStepTwoBack}
          />
        )}

        {step === 3 && experienceIdFromRoute && (
          <PreviewPage
          />
        )}
      </div>
    </div>
  
  );
};

export default CreateExperienceFlow;
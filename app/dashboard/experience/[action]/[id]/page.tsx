"use client";
import React, { useState, useEffect } from "react";
import StepIndicator from "@/components/StepIndicator";
import { useExperienceStore } from "@/store/brands/useExperienceStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import StepOne from "../[id]/product-details/page";
import StepTwo from "./customise-features/page";
import PreviewPage from "./preview/page";

interface ExperienceFlowProps {
  stepOverride?: number;
}

const ExperienceFlow: React.FC<ExperienceFlowProps> = ({ stepOverride }) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // Zustand store
  const { resetAll } = useExperienceStore();

  // Get action and experienceId from route params
  const action = params?.action as string;
  const experienceId = params?.id as string | undefined;

  // Determine step from route and query
  const getStepFromRoute = () => {
    const stepParam = searchParams.get("step");
    if (stepParam === "product-details") return 1;
    if (stepParam === "customise-features") return 2;
    if (stepParam === "preview") return 3;
    return stepOverride ?? 1;
  };

  const [step, setStepState] = useState<number>(getStepFromRoute());

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

  const setStep = (newStep: number) => {
    setStepState(newStep);
    const stepLabels = ["product-details", "customise-features", "preview"];
    const stepLabel = stepLabels[newStep - 1] || "product-details";
    if (stepLabel === "product-details") {
      router.replace(`/dashboard/experience/${action}/${experienceId}?step=product-details`);
      return;
    }
    if (stepLabel === "customise-features") {
      router.replace(`/dashboard/experience/${action}/${experienceId}/customise-features?step=customise-features`);
      return;
    }
    if (stepLabel === "preview") {
      router.replace(`/dashboard/experience/${action}/${experienceId}/preview?step=preview`);
      return;
    }
  };

  const handleStepOneNext = () => {
    setStep(2);
  };

  const handleStepTwoNext = () => {
    setStep(3);
  };

  const handleStepTwoBack = () => {
    router.push(`/dashboard/experience/${action}/${experienceId}?step=product-details`);
  };

  return (
    <div className="min-h-screen bg-white ">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {action === "edit" ? "Edit Product Experience" : "Create New Product Experience"}
            </h1>
          </div>
          <p className="text-gray-600 text-left text-sm sm:text-base leading-relaxed">
            Design a tailored post-purchase journey for your product, from detailed info to engaging interactions.
          </p>
          {/* Step Indicator */}
          <div className="mt-8">
            <StepIndicator currentStep={currentStepIndex + 1} steps={indicatorSteps} />
          </div>
        </div>
        {/* Step rendering logic */}
        {step === 1 && (
          <StepOne onNext={handleStepOneNext} isNew={false} />
        )}
        {step === 2 && experienceId && (
          <StepTwo onNext={handleStepTwoNext} onBack={handleStepTwoBack} />
        )}
        {step === 3 && experienceId && (
          <PreviewPage />
        )}
      </div>
    </div>
  );
};

export default ExperienceFlow;

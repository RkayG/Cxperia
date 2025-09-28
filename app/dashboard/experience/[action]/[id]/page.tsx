"use client";
import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import StepIndicator from "@/components/StepIndicator";

// Import the step components
import ProductDetailsStep from "./product-details/components";
import CustomiseFeaturesStep from "./customise-features/components";
import PreviewStep from "./preview/components";

// This is the main flow controller for an experience that has an ID.
// It reads the `step` from the URL and renders the appropriate component.
const ExperienceFlowPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const action = params.action as string;
  const experienceId = params.id as string;
  const currentStepKey = searchParams.get("step") || "product-details";

  // Navigation handlers
  const navigateToStep = (stepKey: string) => {
    router.push(`/dashboard/experience/${action}/${experienceId}?step=${stepKey}`);
  };

  // Step configuration
  const steps = [
    { key: "product-details", label: "Product Details", component: ProductDetailsStep },
    { key: "customise-features", label: "Customize Features", component: CustomiseFeaturesStep },
    { key: "preview", label: "Preview", component: PreviewStep },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStepKey);
  const CurrentStepComponent = steps[currentStepIndex]?.component;

  const indicatorSteps = steps.map((s, idx) => ({
    number: idx + 1,
    label: s.label,
  }));

  return (
    <div className="min-h-screen bg-white">
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

        {/* Render the current step component */}
        <div className="p-8">
          {CurrentStepComponent && (
            <CurrentStepComponent
              experienceId={experienceId}
              onNext={() => navigateToStep(steps[currentStepIndex + 1]?.key)}
              onBack={() => navigateToStep(steps[currentStepIndex - 1]?.key)}
              isNew={action !== 'edit'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceFlowPage;

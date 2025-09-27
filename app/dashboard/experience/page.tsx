import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import StepOne from "./stepOne/page";
import StepTwo from "./stepTwo/page";
import PreviewPage from "./preview/page";
import StepIndicator from "../../components/common/StepIndicator";
import { useExperienceStore } from "../../store/useExperienceStore";

interface CreateExperienceFlowProps {
  stepOverride?: number;
}

const CreateExperienceFlow: React.FC<CreateExperienceFlowProps> = ({
  stepOverride,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Zustand store
  const { resetAll } = useExperienceStore();
  
  // Get experienceId from route params
  const experienceIdFromRoute = params.id;

  // Read new param from query
  const searchParams = new URLSearchParams(location.search);
  const isNew = searchParams.get("new") === "true";

  // Determine step from route and query
  const getStepFromRoute = () => {
    const params = new URLSearchParams(location.search);
    const stepParam = params.get("step");
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
      navigate("/create-experience?step=product-details", { replace: true });
      return;
    }
    
    if (!experienceIdFromRoute) return;
    
    if (stepLabel === "customise-features") {
      navigate(`/create-experience/${experienceIdFromRoute}?step=customise-features`, { 
        replace: true 
      });
      return;
    }
    
    if (stepLabel === "preview") {
      navigate(`/create-experience/${experienceIdFromRoute}?step=preview`, { 
        replace: true 
      });
      return;
    }
  };

  // Sync step with URL changes
  useEffect(() => {
    const newStep = getStepFromRoute();
    if (newStep !== step) {
      setStepState(newStep);
    }
  }, [location.pathname, location.search]);

  // Step indicator configuration
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const stepParam = new URLSearchParams(location.search).get("step");
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
    navigate("/create-experience?step=product-details");
  };

  return (
    <div className="min-h-screen  bg-white py-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="p-4 sm:p-8">
          <h1 className="text-left text-3xl font-bold text-gray-900 mb-2">
            Create New Product Experience
          </h1>
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
            experienceId={experienceIdFromRoute}
            onFinish={() => setStep(1)}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateExperienceFlow;
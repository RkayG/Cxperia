'use client';
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import EditExperienceStep from "./EditExperienceStep";
import NewExperienceStep from "./NewExperienceStep";

interface StepOneProps {
  onNext?: (experienceId?: string) => void;
  onSubmit?: (data: any) => Promise<void>;
  isNew?: boolean;
  buttonLabel?: string;
  isSubmitting?: boolean;
}

const StepOne: React.FC<StepOneProps> = ({
  onNext,
  onSubmit,
  isNew: isNewProp = false,
  buttonLabel = "Customise Features",
  isSubmitting = false,
}) => {
  const params = useParams();
  const searchParams = useSearchParams();

  // Get stable experience ID
  const experienceId = params?.id 
    ? (Array.isArray(params.id) ? params.id[0] : params.id)
    : null;
  
  // Check if new=true is in search params
  const isNewParam = searchParams.get('new') === 'true';
  
  // Determine if this is new experience
  const isNew = (!experienceId || experienceId === 'new' || isNewParam) && isNewProp;
  
  // Route to appropriate component based on whether it's new or editing
  if (isNew) {
    return (
      <NewExperienceStep
        onNext={onNext}
        onSubmit={onSubmit}
        buttonLabel={buttonLabel}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <EditExperienceStep
      onNext={onNext}
      onSubmit={onSubmit}
      buttonLabel={buttonLabel}
      isSubmitting={isSubmitting}
    />
  );
};

export default StepOne;
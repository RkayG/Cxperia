// InstructionsTab.tsx
import { Minus, Plus } from "lucide-react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicationStep, FormData } from "@/types/usageTypes";

interface InstructionsTabProps {
  formData: FormData;
  errors: any;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isLoading?: boolean;
}

const skinTypes = [
  "Normal",
  "Dry",
  "Oily",
  "Combination",
  "Sensitive",
  "Acne-prone",
];
const usageTimeOptions = [
  "Morning and Evening",
  "Morning",
  "Evening",
  "Anytime",
  "Other Times",
];

const InstructionsTab: React.FC<InstructionsTabProps> = ({
  formData,
  errors,
  updateFormData,
  setFormData,
  isLoading = false,
}) => {
  // Skeleton component for instructions form
  const InstructionsSkeleton = () => (
    <div>
      {/* Basic Information Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        
        <div className="mt-4">
          <Skeleton className="h-4 w-40 mb-2" />
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
          
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Instructions Skeleton */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="mb-6">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <div className="pb-32 lg:mb-12">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="mb-4 p-6 border border-purple-200 rounded-2xl bg-[#f9f7fb]">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  // Helper functions for Application Steps
  const addApplicationStep = () => {
    const newStep: ApplicationStep = {
      id: Date.now().toString(),
      step: "",
      description: "",
    };
    setFormData((prev) => ({
      ...prev,
      applicationSteps: [...prev.applicationSteps, newStep],
    }));
  };

  const removeApplicationStep = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      applicationSteps:
        prev.applicationSteps.length > 1
          ? prev.applicationSteps.filter((s) => s.id !== id)
          : prev.applicationSteps,
    }));
  };

  const updateApplicationStep = (
    id: string,
    field: "step" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      applicationSteps: prev.applicationSteps.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  const toggleSkinType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter((t) => t !== type)
        : [...prev.skinType, type],
    }));
  };

  const toggleUsageTimeType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      usageTimeType: prev.usageTimeType?.includes(type)
        ? prev.usageTimeType.filter((t) => t !== type)
        : [...(prev.usageTimeType || []), type],
    }));
  };

  const inputClass = (value: string | string[]) =>
    `w-full px-4 py-3 lg:py-2 border-2 lg:border-1 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-purple-900 ${
      (Array.isArray(value) ? value.length > 0 : value) ? "bg-[#ede8f3]" : ""
    }`;

  const checkboxIndicator = (checked: boolean) =>
    `w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors duration-200 mr-2 shadow-sm ${
      checked ? "bg-purple-700 border-purple-700" : "bg-white border-purple-300"
    }`;

  if (isLoading) {
    return <InstructionsSkeleton />;
  }

  return (
    <div>
      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-left text-purple-800 text-sm font-medium mb-2">
              Usage Frequency
            </label>
            <input
              type="text"
              value={formData.frequency}
              onChange={(e) => updateFormData("frequency", e.target.value)}
              className={inputClass(formData.frequency)}
              placeholder="e.g., Once daily, Twice weekly"
            />
            {errors.frequency && (
              <p className="text-xs text-red-600 mt-2">{errors.frequency}</p>
            )}
          </div>
          <div>
            <label className="block text-left text-purple-800 text-sm font-medium mb-2">
              Application Duration
            </label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => updateFormData("duration", e.target.value)}
              className={inputClass(formData.duration)}
              placeholder="e.g., Leave on overnight, Rinse after 10 minutes"
            />
            {errors.duration && (
              <p className="text-xs text-red-600 mt-2">{errors.duration}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          {/* Skin Types */}
          <label className="block text-left text-purple-800 text-sm font-medium mb-2">
            Suitable Skin Types
          </label>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {skinTypes.map((type) => {
              const checked = formData.skinType.includes(type);
              return (
                <label key={type} className="flex items-center cursor-pointer select-none">
                  <span className={checkboxIndicator(checked)} style={{ minWidth: 20 }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkinType(type)}
                      className="appearance-none w-5 h-5 absolute opacity-0 cursor-pointer"
                      style={{ zIndex: 2 }}
                    />
                    {checked && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-purple-900 font-medium">{type}</span>
                </label>
              );
            })}
          </div>
          {errors.skinType && <p className="text-xs text-red-600 mt-2">{errors.skinType}</p>}

          {/* Usage Time Type */}
          <label className="block text-left text-purple-800 text-sm font-medium mb-2">
            Usage Time Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {usageTimeOptions.map((option) => {
              const checked = formData.usageTimeType?.includes(option);
              return (
                <label key={option} className="flex items-center cursor-pointer select-none">
                  <span className={checkboxIndicator(checked)} style={{ minWidth: 20 }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleUsageTimeType(option)}
                      className="appearance-none w-5 h-5 absolute opacity-0 cursor-pointer"
                      style={{ zIndex: 2 }}
                    />
                    {checked && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-purple-900 font-medium">{option}</span>
                </label>
              );
            })}
          </div>
          {errors.usageTimeType && <p className="text-xs text-red-600 mt-2">{errors.usageTimeType}</p>}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">
          Usage Instructions
        </h3>
        
        {/* General How to Use */}
        <div className="mb-6">
          <label className="block text-left text-purple-800 text-sm font-medium mb-2">
            General How to Use
          </label>
          <textarea
            value={formData.howToUse}
            
            onChange={(e) => updateFormData("howToUse", e.target.value)}
            rows={4}
            className={inputClass(formData.howToUse)}
            placeholder="Describe the general usage instructions for this product..."
          />
          {errors.howToUse && (
            <p className="text-xs text-red-600 mt-2">{errors.howToUse}</p>
          )}
        </div>

        {/* Step-by-Step Application */}
        <div className="pb-32 lg:mb-12">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-left text-purple-800 text-sm font-medium">
              Step-by-Step Application
            </label>
            <button
              onClick={addApplicationStep}
              className="flex items-center px-4 py-2 text-sm bg-purple-800 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </button>
          </div>
          {formData.applicationSteps.map((step, index) => (
            <div
              key={step.id}
              className="mb-4 p-6 border border-purple-200 rounded-2xl bg-[#f9f7fb]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">
                  Step {index + 1}
                </span>
                <button
                  onClick={() => removeApplicationStep(step.id)}
                  className="p-1 text-purple-800 hover:bg-purple-100 rounded-xl"
                  disabled={formData.applicationSteps.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={step.step}
                  onChange={(e) =>
                    updateApplicationStep(step.id, "step", e.target.value)
                  }
                  className={inputClass(step.step)}
                  placeholder="Step title (e.g., Cleanse face)"
                />
                <textarea
                  value={step.description}
                  onChange={(e) =>
                    updateApplicationStep(step.id, "description", e.target.value)
                  }
                  className={inputClass(step.description)}
                  placeholder="Detailed description"
                />
              </div>
            </div>
          ))}
          {errors.applicationSteps && (
            <p className="text-xs text-red-600 mt-2">{errors.applicationSteps}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructionsTab;
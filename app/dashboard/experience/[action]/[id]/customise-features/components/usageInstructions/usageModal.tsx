// CosmeticProductModal.tsx
import React, { useCallback, useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useAddInstruction } from "@/hooks/brands/useFeatureApi";
import {
  ActiveTab,
  ApplicationStep,
  CosmeticProductModalProps,
  FormData,
} from "@/types/usageTypes";
import { showToast } from "@/utils/toast";
import { validateUsageInstructions } from "@/utils/validateUsageInstructions";

// Import new modular components
import InstructionsTab from "./InstructionsTab";
import MobileTabNav from "./MobileTabNav";
import ModalFooter from "./ModalFooter";
import ModalHeader from "./ModalHeader";
import Sidebar from "./Sidebar";
import TipsTab from "./TipsTab";
import WarningsTab from "./WarningsTab";

const initialData = (
  initialInstructions: any,
  productName?: string
): FormData => {
  // Handle nested data structure: {data: Array(1)} or direct array
  const instructionsArray = initialInstructions?.data || initialInstructions;
  const instructions = instructionsArray?.[0];
  const defaultStep: ApplicationStep = {
    id: Date.now().toString(),
    step: "",
    description: "",
  };

  return instructions
    ? {
        ...instructions,
        applicationSteps: (() => {
          try {
            // Parse application_steps JSON string
            const steps = instructions.application_steps ? JSON.parse(instructions.application_steps) : [];
            return Array.isArray(steps) && steps.length > 0 
              ? steps.map((step: any) => ({
                  id: step.step_number?.toString() || Date.now().toString(),
                  step: step.step_title || "",
                  description: step.description || "",
                }))
              : [defaultStep];
          } catch (e) {
            console.error('Error parsing application_steps:', e);
            return [defaultStep];
          }
        })(),
        tips: (() => {
          try {
            const tips = instructions.tips ? JSON.parse(instructions.tips) : [];
            return Array.isArray(tips) && tips.length > 0 ? tips : [""];
          } catch (e) {
            return [""];
          }
        })(),
        warnings: (() => {
          try {
            const warnings = instructions.warnings ? JSON.parse(instructions.warnings) : [];
            return Array.isArray(warnings) && warnings.length > 0 ? warnings : [""];
          } catch (e) {
            return [""];
          }
        })(),
        skinType: (() => {
          try {
            const skinType = instructions.skin_type ? JSON.parse(instructions.skin_type) : [];
            return Array.isArray(skinType) ? skinType : [];
          } catch (e) {
            return [];
          }
        })(),
        usageTimeType: instructions.usage_time_type || [],
        howToUse: instructions.how_to_use || "",
        frequency: instructions.frequency || "",
        duration: instructions.duration || "",
        productName: instructions.product_name || productName || "",
      }
    : {
        productName: productName || "",
        productType: "",
        howToUse: "",
        applicationSteps: [defaultStep],
        tips: [""],
        warnings: [""],
        frequency: "",
        skinType: [],
        duration: "",
        usageTimeType: [],
      };
};

const ProductUsageModal: React.FC<CosmeticProductModalProps> = ({
  experienceId,
  inline = false,
  initialInstructions,
  productName,
  onClose,
  onFeatureEnable,
}) => {
  const { mutate: addInstruction, isPending: isSaving, isSuccess, isError, error } = useAddInstruction(experienceId);
  const [isLoading, setIsLoading] = useState(!initialInstructions);

  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = inline ? true : internalOpen;
  const [activeTab, setActiveTab] = useState<ActiveTab>("instructions");
  
  // Local storage key for this experience
  const storageKey = `usageModal_${experienceId}`;
  
  // Initialize form data with local storage fallback
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      // Try to load from local storage first
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        //console.log('Loaded form data from local storage:', parsedData);
        // Validate that the parsed data has the expected structure
        if (parsedData && typeof parsedData === 'object' && 'productName' in parsedData) {
          return parsedData as FormData;
        }
      }
    } catch (error) {
     // console.warn('Failed to load form data from local storage:', error);
    }
    
    // Fallback to initial data if no saved data
    return initialData(initialInstructions, productName);
  });
  
  const [errors, setErrors] = useState<any>({});

  // Set loading to false when initialInstructions are available
  useEffect(() => {
    if (initialInstructions) {
      setIsLoading(false);
    }
  }, [initialInstructions]);

  // Centralized form data update handler with local storage
  const updateFormData = useCallback(<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Save to local storage
      try {
        localStorage.setItem(storageKey, JSON.stringify(newData));
       // console.log('Saved form data to local storage:', field, value);
      } catch (error) {
        console.warn('Failed to save form data to local storage:', error);
      }
      
      return newData;
    });
  }, [storageKey]);

  // Wrapper function for setFormData that also saves to local storage
  const updateFormDataDirect = useCallback((newData: FormData | ((prev: FormData) => FormData)) => {
    setFormData((prev) => {
      const updatedData = typeof newData === 'function' ? newData(prev) : newData;
      
      // Save to local storage
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
       // console.log('Saved form data to local storage (direct update)');
      } catch (error) {
      //  console.warn('Failed to save form data to local storage:', error);
      }
      
      return updatedData;
    });
  }, [storageKey]);

  // Handlers for lists (Application Steps, Tips, Warnings) are passed down

  const handleSave = () => {
    const validationErrors = validateUsageInstructions(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
        showToast.error("Please fill out all required fields.");
        return;
    }

    const payload: any = {
      experience_id: experienceId,
      product_name: formData.productName,
      product_type: formData.productType,
      how_to_use: formData.howToUse,
      application_steps: formData.applicationSteps.map((step, idx) => ({
        step_number: idx + 1,
        step_title: step.step,
        description: step.description,
      })),
      tips: formData.tips.filter(tip => tip.trim() !== ""), // Filter out empty strings
      warnings: formData.warnings.filter(warning => warning.trim() !== ""), // Filter out empty strings
      frequency: formData.frequency,
      skin_type: formData.skinType,
      duration: formData.duration,
      // Convert array to comma-separated string for backend, or handle as array if API supports
      usage_time_type: Array.isArray(formData.usageTimeType)
        ? formData.usageTimeType.join(", ")
        : formData.usageTimeType,
    };
    addInstruction(payload);
  };

  const handlePreview = () => {
   // console.log("Preview data:", formData);
    alert("Opening preview..."); // Replace with actual preview logic
  };

  // Effect for API response feedback and closing
  useEffect(() => {
    if (isSuccess) {
      showToast.success("Instructions saved!");
      
      // Clear local storage on successful save
      try {
        localStorage.removeItem(storageKey);
       // console.log('Cleared form data from local storage after successful save');
      } catch (error) {
        console.warn('Failed to clear form data from local storage:', error);
      }
      
      if (onFeatureEnable) onFeatureEnable();
      if (!inline && onClose) onClose(); 
      if (!inline) setInternalOpen(false);
    }
    if (isError) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showToast.error(`Error saving: ${errorMessage}`);
    }
  }, [isSuccess, isError, error, onClose, onFeatureEnable, inline, storageKey]);

  // Effect to notify parent when drawer closes (for non-inline mode)
  useEffect(() => {
    if (!inline && !internalOpen && onClose) {
      onClose();
    }
  }, [internalOpen, inline, onClose]);

  // Cleanup effect to clear local storage when component unmounts (optional)
  useEffect(() => {
    return () => {
      // Only clear if the modal is being closed without saving
      // This is optional - you might want to keep the data for next time
      // Uncomment the lines below if you want to clear on unmount
      /*
      try {
        localStorage.removeItem(storageKey);
        console.log('Cleared form data from local storage on unmount');
      } catch (error) {
        console.warn('Failed to clear form data from local storage on unmount:', error);
      }
      */
    };
  }, [storageKey]);

  if (!isOpen) return null;

  const mainPanel = (
    <div className="lg:flex  bg-gray-50">
      {/* Sidebar (Desktop) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Tab Navigation */}
      <MobileTabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="lg:flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-4 lg:p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {activeTab === "instructions" && (
            <InstructionsTab
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              setFormData={updateFormDataDirect}
              isLoading={isLoading}
            />
          )}
          {activeTab === "tips" && (
            <TipsTab
              formData={formData}
              setFormData={updateFormDataDirect}
              errors={errors}
            />
          )}
          {activeTab === "warnings" && (
            <WarningsTab
              formData={formData}
              setFormData={updateFormDataDirect}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Render Inline Mode
  if (inline) return mainPanel;

  // Render Modal/Drawer Mode
  return (
    <Drawer
      open={isOpen}
      onOpenChange={setInternalOpen}
      shouldScaleBackground={true}
    >
      <DrawerContent className="bg-gray-50 max-w-screen-lg mx-auto min-h-[90vh] max-h-[90vh] rounded-t-lg p-0 overflow-hidden lg:rounded-t-lg">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <ModalHeader
            productName={productName}
            onClose={() => setInternalOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">{mainPanel}</div>

          {/* Footer */}
          <ModalFooter
            isSaving={isSaving}
            handlePreview={handlePreview}
            handleSave={handleSave}
            onClose={() => setInternalOpen(false)}
          />

        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductUsageModal;
// CosmeticProductModal.tsx
import React, { useState, useEffect, useCallback } from "react";
import { validateUsageInstructions } from "@/utils/validateUsageInstructions";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { showToast } from "@/utils/toast";
import { useAddInstruction } from "@/hooks/brands/useFeatureApi";
import {
  FormData,
  ApplicationStep,
  CosmeticProductModalProps,
  ActiveTab,
} from "@/types/usageTypes";

// Import new modular components
import InstructionsTab from "./InstructionsTab";
import TipsTab from "./TipsTab";
import WarningsTab from "./WarningsTab";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import Sidebar from "./Sidebar";
import MobileTabNav from "./MobileTabNav";

const initialData = (
  initialInstructions: any,
  productName?: string
): FormData => {
  const instructions = initialInstructions?.[0];
  const defaultStep: ApplicationStep = {
    id: Date.now().toString(),
    step: "",
    description: "",
  };

  return instructions
    ? {
        ...instructions,
        applicationSteps: instructions.applicationSteps?.length
          ? instructions.applicationSteps
          : [defaultStep],
        tips: instructions.tips?.length ? instructions.tips : [""],
        warnings: instructions.warnings?.length ? instructions.warnings : [""],
        skinType: instructions.skinType || [],
        usageTimeType: instructions.usageTimeType || [],
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

  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = inline ? true : internalOpen;
  const [activeTab, setActiveTab] = useState<ActiveTab>("instructions");
  const [formData, setFormData] = useState<FormData>(() =>
    initialData(initialInstructions, productName)
  );
  const [errors, setErrors] = useState<any>({});

  // Centralized form data update handler
  const updateFormData = useCallback(<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

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
    console.log("Preview data:", formData);
    alert("Opening preview..."); // Replace with actual preview logic
  };

  // Effect for API response feedback and closing
  useEffect(() => {
    if (isSuccess) {
      showToast.success("Instructions saved! 🎉");
      if (onFeatureEnable) onFeatureEnable();
      if (!inline && onClose) onClose(); 
      if (!inline) setInternalOpen(false);
    }
    if (isError) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      showToast.error(`Error saving: ${errorMessage}`);
    }
  }, [isSuccess, isError, error, onClose, onFeatureEnable, inline]);

  // Effect to notify parent when drawer closes (for non-inline mode)
  useEffect(() => {
    if (!inline && !internalOpen && onClose) {
      onClose();
    }
  }, [internalOpen, inline, onClose]);

  if (!isOpen) return null;

  const mainPanel = (
    <div className="lg:flex  bg-gray-50">
      {/* Sidebar (Desktop) */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Tab Navigation */}
      <MobileTabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="lg:flex-1 bg-gray-50 mb-24 sm:mb-12 overflow-y-auto4">
        <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 160px)" }}>
          {activeTab === "instructions" && (
            <InstructionsTab
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              setFormData={setFormData}
            />
          )}
          {activeTab === "tips" && (
            <TipsTab
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
          {activeTab === "warnings" && (
            <WarningsTab
              formData={formData}
              setFormData={setFormData}
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
      <DrawerContent className="bg-gray-50 max-w-screen-lg mx-auto min-h-[90vh] max-h-[90vh] rounded-t-lg p-0 overflow-hidden">
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
          />

        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductUsageModal;
import React, { useState, useEffect } from "react";
import { validateUsageInstructions } from "@/utils/validateUsageInstructions";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { showToast } from "@/utils/toast";
import { useAddInstruction } from "@/hooks/brands/useFeatureApi";
import {
  X,
  Plus,
  Minus,
  Eye,
  ListChecks,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

interface ApplicationStep {
  id: string;
  step: string;
  description: string;
}

interface ProductUsageData {
  productName: string;
  productType: string;
  howToUse: string;
  applicationSteps: ApplicationStep[];
  tips: string[];
  warnings: string[];
  frequency: string;
  skinType: string[];
  duration: string;
}

interface CosmeticProductModalProps {
  experienceId: string;
  inline?: boolean;
  initialInstructions?: any;
  productName?: string;
  onClose?: () => void;
  onFeatureEnable?: () => void;
}

interface CosmeticProductModalProps {
  experienceId: string;
  inline?: boolean;
  initialInstructions?: any;
  onClose?: () => void;
  onFeatureEnable?: () => void;
}

const CosmeticProductModal: React.FC<CosmeticProductModalProps> = ({
  experienceId,
  inline = false,
  initialInstructions,
  productName,
  onClose,
  onFeatureEnable,
}) => {
  const {
    mutate: addInstruction,
    isPending: isSaving,
    isSuccess,
    isError,
    error,
  } = useAddInstruction(experienceId);
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = inline ? true : internalOpen;
  const [activeTab, setActiveTab] = useState<
    "instructions" | "tips" | "warnings"
  >("instructions");

  const [formData, setFormData] = useState<
    ProductUsageData & { usageTimeType?: string[] }
  >(
    initialInstructions && initialInstructions[0]
      ? {
          ...initialInstructions[0],
          applicationSteps: initialInstructions[0].applicationSteps?.length
            ? initialInstructions[0].applicationSteps
            : [{ id: Date.now().toString(), step: "", description: "" }],
          tips: initialInstructions[0].tips?.length
            ? initialInstructions[0].tips
            : [""],
          warnings: initialInstructions[0].warnings?.length
            ? initialInstructions[0].warnings
            : [""],
          skinType: initialInstructions[0].skinType?.length
            ? initialInstructions[0].skinType
            : [],
          usageTimeType: initialInstructions[0].usageTimeType?.length
            ? initialInstructions[0].usageTimeType
            : [],
        }
      : {
          productName: productName || "",
          productType: "",
          howToUse: "",
          applicationSteps: [
            { id: Date.now().toString(), step: "", description: "" },
          ],
          tips: [""],
          warnings: [""],
          frequency: "",
          skinType: [],
          duration: "",
          usageTimeType: [],
        }
  );

  const [errors, setErrors] = useState<any>({});
/* 
  useEffect(() => {
    setErrors(validateUsageInstructions(formData));
  }, [formData]); */

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

  const toggleUsageTimeType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      usageTimeType: prev.usageTimeType?.includes(type)
        ? prev.usageTimeType.filter((t) => t !== type)
        : [...(prev.usageTimeType || []), type],
    }));
  };

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

  const addTip = () =>
    setFormData((prev) => ({ ...prev, tips: [...prev.tips, ""] }));
  const removeTip = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      tips:
        prev.tips.length > 1
          ? prev.tips.filter((_, i) => i !== index)
          : prev.tips,
    }));
  const updateTip = (index: number, value: string) =>
    setFormData((prev) => {
      const t = [...prev.tips];
      t[index] = value;
      return { ...prev, tips: t };
    });

  const addWarning = () =>
    setFormData((prev) => ({ ...prev, warnings: [...prev.warnings, ""] }));
  const removeWarning = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      warnings:
        prev.warnings.length > 1
          ? prev.warnings.filter((_, i) => i !== index)
          : prev.warnings,
    }));
  const updateWarning = (index: number, value: string) =>
    setFormData((prev) => {
      const w = [...prev.warnings];
      w[index] = value;
      return { ...prev, warnings: w };
    });

  const toggleSkinType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      skinType: prev.skinType.includes(type)
        ? prev.skinType.filter((t) => t !== type)
        : [...prev.skinType, type],
    }));
  };

  const handleSave = () => {
    const validationErrors = validateUsageInstructions(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    // Map frontend formData to backend schema
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
      tips: formData.tips,
      warnings: formData.warnings,
      frequency: formData.frequency,
      skin_type: formData.skinType,
      duration: formData.duration,
      usage_time_type: Array.isArray(formData.usageTimeType)
        ? formData.usageTimeType.join(", ")
        : formData.usageTimeType,
    };
    addInstruction(payload);
  };

  const handlePreview = () => {
    console.log("Preview data:", formData);
    alert("Opening preview...");
  };

  useEffect(() => {
    if (isSuccess) {
      showToast.success("Instructions saved!");
      if (onFeatureEnable) onFeatureEnable();
      if (!inline && onClose) onClose(); // Always notify parent to close
      if (!inline) setInternalOpen(false);
    }
    if (isError) {
      showToast.error(
        `Error saving: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [isSuccess, isError, error, onClose, onFeatureEnable, inline]);

  // Ensure parent is notified when drawer closes (internalOpen changes)
  useEffect(() => {
    if (!inline && !internalOpen && onClose) {
      onClose();
    }
  }, [internalOpen, inline, onClose]);

  if (!isOpen) return null;

  const mainPanel = (
    <div className="lg:flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 mt-28 hidden lg:block border-r border-gray-200 p-4 fixed left-0 top-0 h-full z-30">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("instructions")}
            className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl transition-colors ${
              activeTab === "instructions"
                ? "bg-purple-100 text-purple-800 font-semibold"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            <ListChecks className="w-5 h-5 mr-1" /> Instructions & Steps
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl transition-colors ${
              activeTab === "tips"
                ? "bg-purple-100 text-purple-800 font-semibold"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            <Lightbulb className="w-5 h-5 mr-1" /> Application Tips
          </button>
          <button
            onClick={() => setActiveTab("warnings")}
            className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl transition-colors ${
              activeTab === "warnings"
                ? "bg-purple-100 text-purple-800 font-semibold"
                : "hover:bg-gray-100 text-gray-900"
            }`}
          >
            <AlertTriangle className="w-5 h-5 mr-1" /> Warnings & Precautions
          </button>
        </nav>
      </div>

  <div className="mb-6 px-2 w-full bg-gray-50 relative overflow-x-auto lg:hidden" style={{ marginLeft: 0 }}>
        <nav className="flex space-x-8 border-b border-gray-200">
          {[
            {
              id: "instructions",
              label: "Instructions & Steps",
              icon: ListChecks,
            },
            { id: "tips", label: "Application Tips", icon: Lightbulb },
            {
              id: "warnings",
              label: "Warnings & Precautions",
              icon: AlertTriangle,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center min-w-xs py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-800 flex text-purple-800"
                    : "border-transparent flex  text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 lg:flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">
          {/* Basic Information only for instructions tab */}
          {activeTab === "instructions" && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">
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
                    onChange={(e) =>
                      setFormData({ ...formData, frequency: e.target.value })
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-purple-900 ${
                      formData.frequency ? "bg-[#ede8f3]" : ""
                    }`}
                    placeholder="e.g., Once daily, Twice weekly"
                  />
                  {errors.frequency && <p className="text-xs text-red-600 mt-2">{errors.frequency}</p>}
                </div>
                <div>
                  <label className="block text-left text-purple-800 text-sm font-medium mb-2">
                    Application Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-purple-900 ${
                      formData.duration ? "bg-[#ede8f3]" : ""
                    }`}
                    placeholder="e.g., Leave on overnight, Rinse after 10 minutes"
                  />
                  {errors.duration && <p className="text-xs text-red-600 mt-2">{errors.duration}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-left text-purple-800 text-sm font-medium mb-2">
                  Suitable Skin Types
                </label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {skinTypes.map((type) => {
                    const checked = formData.skinType.includes(type);
                    return (
                      <label
                        key={type}
                        className="flex items-center cursor-pointer select-none"
                      >
                        <span
                          className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors duration-200 mr-2 ${
                            checked
                              ? "bg-purple-700 border-purple-700"
                              : "bg-white border-purple-300"
                          } shadow-sm`}
                          style={{ minWidth: 20 }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSkinType(type)}
                            className="appearance-none w-5 h-5 absolute opacity-0 cursor-pointer"
                            style={{ zIndex: 2 }}
                          />
                          {checked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm text-purple-900 font-medium">
                          {type}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.skinType && <p className="text-xs text-red-600 mt-2">{errors.skinType}</p>}
                <label className="block text-left text-purple-800 text-sm font-medium mb-2">
                  Usage Time Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {usageTimeOptions.map((option) => {
                    const checked = formData.usageTimeType?.includes(option);
                    return (
                      <label
                        key={option}
                        className="flex items-center cursor-pointer select-none"
                      >
                        <span
                          className={`w-5 h-5 flex items-center justify-center border-2 rounded-full transition-colors duration-200 mr-2 ${
                            checked
                              ? "bg-purple-700 border-purple-700"
                              : "bg-white border-purple-300"
                          } shadow-sm`}
                          style={{ minWidth: 20 }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleUsageTimeType(option)}
                            className="appearance-none w-5 h-5 absolute opacity-0 cursor-pointer"
                            style={{ zIndex: 2 }}
                          />
                          {checked && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="text-sm text-purple-900 font-medium">
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.usageTimeType && <p className="text-xs text-red-600 mt-2">{errors.usageTimeType}</p>}
              </div>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "instructions" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-800">
                Usage Instructions
              </h3>
              {/* General How to Use */}
              <div className="mb-6">
                <label className="block text-left text-purple-800 text-sm font-medium mb-2">
                  General How to Use
                </label>
                <textarea
                  value={formData.howToUse}
                  onChange={(e) =>
                    setFormData({ ...formData, howToUse: e.target.value })
                  }
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-purple-900 ${
                    formData.howToUse ? "bg-[#ede8f3]" : ""
                  }`}
                  placeholder="Describe the general usage instructions for this product..."
                />
                {errors.howToUse && <p className="text-xs text-red-600 mt-2">{errors.howToUse}</p>}
              </div>
              {/* Step-by-Step Application */}
              <div>
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
                        className={`px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-purple-900 ${
                          step.step ? "bg-[#ede8f3]" : ""
                        }`}
                        placeholder="Step title (e.g., Cleanse face)"
                      />
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) =>
                          updateApplicationStep(
                            step.id,
                            "description",
                            e.target.value
                          )
                        }
                        className={`px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-purple-900 ${
                          step.description ? "bg-[#ede8f3]" : ""
                        }`}
                        placeholder="Detailed description"
                      />
                    </div>
                  </div>
                ))}
                {errors.applicationSteps && <p className="text-xs text-red-600 mt-2">{errors.applicationSteps}</p>}
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-purple-800">
                  Application Tips
                </h3>
                <button
                  onClick={addTip}
                  className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tip
                </button>
              </div>
              <p className="text-sm text-blue-900 mb-4 font-medium">
                Share helpful tips for users to get the best results from this
                product. These can include application techniques, storage
                advice, or expert recommendations.
              </p>
              {/* Only show tips fields */}
              {formData.tips.map((tip, index) => (
                <div key={index} className="mb-3 flex gap-2">
                  <textarea
                    value={tip}
                    onChange={(e) => updateTip(index, e.target.value)}
                    rows={2}
                    className={`flex-1 px-4 py-3 border-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-blue-900 ${
                      tip ? "bg-[#ede8f3]" : ""
                    }`}
                    placeholder={`Pro tip #${index + 1}...`}
                  />
                  <button
                    onClick={() => removeTip(index)}
                    className="p-2 text-purple-800 hover:bg-purple-100 rounded-xl self-start"
                    disabled={formData.tips.length === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {errors.tips && <p className="text-xs text-red-600 mt-2">{errors.tips}</p>}
            </div>
          )}

          {activeTab === "warnings" && (
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-purple-800">
                  Warnings & Precautions
                </h3>
                <button
                  onClick={addWarning}
                  className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Warning
                </button>
              </div>
              <p className="text-sm text-red-900 mb-4 font-medium">
                List any important warnings, precautions, or contraindications
                users should be aware of before or during use. This can include
                allergy information, age restrictions, or safety advice.
              </p>
              {/* Only show warnings fields */}
              {formData.warnings.map((warning, index) => (
                <div key={index} className="mb-3 flex gap-2">
                  <textarea
                    value={warning}
                    onChange={(e) => updateWarning(index, e.target.value)}
                    rows={2}
                    className={`flex-1 px-4 py-3 border-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-red-900 ${
                      warning ? "bg-[#ede8f3]" : ""
                    }`}
                    placeholder={`Warning #${index + 1}...`}
                  />
                  <button
                    onClick={() => removeWarning(index)}
                    className="p-2 text-purple-800 hover:bg-purple-100 rounded-xl self-start"
                    disabled={formData.warnings.length === 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {errors.warnings && <p className="text-xs text-red-600 mt-2">{errors.warnings}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (inline) return mainPanel;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setInternalOpen}
      shouldScaleBackground={true}
    >
      <DrawerContent className="w-screen bg-gray-50 max-w-screen-lg mx-auto h-[90vh] max-h-[90vh] rounded-t-lg p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center bg-gray-50 justify-between px-8 py-3 text-purple-900 sticky top-0 z-20 ">
            <div className="flex items-center space-x-3">
              <div className="">
                <h2 className="text-xl font-bold text-black">
                  {productName} Usage Instructions
                </h2>
                <p className="text-purple-700 text-left text-sm">
                  {/* Optionally show step count or other info here */}
                </p>
              </div>
            </div>
            <button
              onClick={() => setInternalOpen(false)}
              className="p-2 rounded-xl  hover:rotate-90  hover:bg-purple-600 transition-all duration-200 group hover:text-white"
              aria-label="Close drawer"
            >
              <X
                size={20}
                className="group-hover:rotate-90 transition-transform duration-200"
              />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">{mainPanel}</div>

          {/* Footer */}
          <div className="flex items-center bg-gray-50 justify-end border-t border-gray-200 px-8 py-4 sticky bottom-0 z-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreview}
                className="flex items-center px-4 py-2 text-purple-800 bg-white border border-gray-300 rounded-xl hover:bg-purple-50 transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-6 py-2 bg-purple-800 text-white font-medium rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    Saving...
                  </>
                ) : (
                  <>
                    Save Instructions
                  </>
                )}
              </button>
            </div>
            {/* Toast notifications handled by showToast utility */}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CosmeticProductModal;

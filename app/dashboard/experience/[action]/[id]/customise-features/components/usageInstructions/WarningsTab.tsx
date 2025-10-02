// WarningsTab.tsx
import { Minus, Plus } from "lucide-react";
import React from "react";
import { useIsMobile } from "@/hooks/brands/use-mobile";
import { FormData } from "@/types/usageTypes";

interface WarningsTabProps {
  formData: FormData;
  errors: any;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const WarningsTab: React.FC<WarningsTabProps> = ({
  formData,
  errors,
  setFormData,
}) => {
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

  const textareaClass = (value: string) =>
    `flex-1 px-4 py-3 border-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-red-900 ${
      value ? "bg-[#ede8f3]" : ""
    }`;

    const isMobile = useIsMobile();

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-purple-800">
          {isMobile ? "Warnings" : "Warnings & Precautions"}
        </h3>
        <button
          onClick={addWarning}
          className="flex items-center px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add More Warnings
        </button>
      </div>
      <p className="text-sm text-red-900 mb-4 font-medium">
        List any important warnings, precautions, or contraindications users
        should be aware of before or during use. This can include allergy
        information, age restrictions, or safety advice.
      </p>
      {formData.warnings.map((warning, index) => (
        <div key={index} className="mb-3 flex gap-2">
          <textarea
            value={warning}
            onChange={(e) => updateWarning(index, e.target.value)}
            rows={2}
            className={textareaClass(warning)}
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
  );
};

export default WarningsTab;
// TipsTab.tsx
import { Minus, Plus } from "lucide-react";
import React from "react";
import { FormData } from "@/types/usageTypes";

interface TipsTabProps {
  formData: FormData;
  errors: any;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const TipsTab: React.FC<TipsTabProps> = ({ formData, errors, setFormData }) => {
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

  const textareaClass = (value: string) =>
    `flex-1 px-4 py-3 border-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 border-blue-900 ${
      value ? "bg-[#ede8f3]" : ""
    }`;

  return (
    <div className="bg-gray-50 pb-16">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-purple-800">
          Application Tips
        </h3>
        <button
          onClick={addTip}
          className="flex items-center px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors  hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add More Tips
        </button>
      </div>
      <p className="text-sm text-blue-900 mb-4 font-medium">
        Share helpful tips for users to get the best results from this product.
        These can include application techniques, storage advice, or expert
        recommendations.
      </p>
      {formData.tips.map((tip, index) => (
        <div key={index} className="mb-3 flex gap-2">
          <textarea
            value={tip}
            onChange={(e) => updateTip(index, e.target.value)}
            rows={2}
            className={textareaClass(tip)}
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
  );
};

export default TipsTab;
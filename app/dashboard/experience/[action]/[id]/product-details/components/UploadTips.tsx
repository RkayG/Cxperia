// CreateExperience/UploadTips.tsx
import React from "react";
import {
  SunIcon,
  PaintbrushIcon,
  CameraIcon,
  LightbulbIcon,
  PictureInPictureIcon,
} from "lucide-react";
import type { UploadTipProps } from "@/types/productExperience";

const UploadTip: React.FC<UploadTipProps> = ({
  icon,
  text,
  isActive = false,
}) => (
  <div
    className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
      isActive ? "bg-purple-50 border border-purple-200" : "hover:bg-gray-50"
    }`}
  >
    <div
      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
        isActive ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-600"
      }`}
    >
      {icon}
    </div>
    <p
      className={`text-sm leading-relaxed ${
        isActive ? "text-purple-900 font-medium" : "text-gray-700"
      }`}
    >
      {text}
    </p>
  </div>
);

const UploadTips: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Tips for great photos
        </h3>
        <div className="flex items-center space-x-1">
          <PictureInPictureIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-3">
        <UploadTip
          icon={<SunIcon className="w-3 h-3" />}
          text="Capture your product with clear, even lighting to highlight true color and texture."
          isActive={true}
        />
        <UploadTip
          icon={<CameraIcon className="w-3 h-3" />}
          text="Show close-ups of product texture, applicator, or swatches on skin."
        />
        <UploadTip
          icon={<PaintbrushIcon className="w-3 h-3" />}
          text="Demonstrate the product in use - apply to face, lips, or hands for context."
        />
        <UploadTip
          icon={<LightbulbIcon className="w-3 h-3" />}
          text="Use a clean, neutral background to keep focus on the beauty product."
        />
        <UploadTip
          icon={<PictureInPictureIcon className="w-3 h-3" />}
          text="Include before-and-after or transformation shots for skincare and makeup."
        />
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Recommended size:</span>
          <span className="font-medium text-gray-900">600 x 600px</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Max file size:</span>
          <span className="font-medium text-gray-900">10MB</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Supported formats:</span>
          <span className="font-medium text-gray-900">JPG, PNG</span>
        </div>
      </div>
    </div>
  );
};

export default UploadTips;

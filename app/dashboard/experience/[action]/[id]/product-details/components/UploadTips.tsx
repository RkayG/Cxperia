// CreateExperience/UploadTips.tsx
import {
  CameraIcon,
  LightbulbIcon,
  PaintbrushIcon,
  PictureInPictureIcon,
  SunIcon,
} from "lucide-react";
import React from "react";
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
          Conseils pour de belles photos
        </h3>
        <div className="flex items-center space-x-1">
          <PictureInPictureIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-3">
        <UploadTip
          icon={<SunIcon className="w-3 h-3" />}
          text="Capturez votre produit avec une lumière claire et uniforme pour mettre en valeur sa couleur et sa texture."
          isActive={true}
        />
        <UploadTip
          icon={<CameraIcon className="w-3 h-3" />}
          text="Montrez des grossissements de la texture du produit, de l'appliquateur ou des échantillons sur la peau."
        />
        <UploadTip
          icon={<PaintbrushIcon className="w-3 h-3" />}
          text="Démontrez le produit en utilisation - appliquez-le sur le visage, les lèvres ou les mains pour le contexte."
        />
        <UploadTip
          icon={<LightbulbIcon className="w-3 h-3" />}
          text="Utilisez un fond propre et neutre pour garder le focus sur le produit de beauté."
        />
        <UploadTip
          icon={<PictureInPictureIcon className="w-3 h-3" />}
          text="Incluez des photos avant et après ou des transformations pour la cosmétique et le maquillage."
        />
      </div>

      {/* Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Taille recommandée:</span>
          <span className="font-medium text-gray-900">600 x 600px</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Taille maximale du fichier:</span>
          <span className="font-medium text-gray-900">10MB</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Formats supportés:</span>
          <span className="font-medium text-gray-900">JPG, PNG, WEBP</span>
        </div>
      </div>
    </div>
  );
};

export default UploadTips;

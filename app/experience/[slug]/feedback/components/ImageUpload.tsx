// src/components/ImageUpload.tsx
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

const ImageUpload: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImages((prevImages) => [...prevImages, e.target?.result as string]);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700">Upload Images</p>
      <div className="flex space-x-3 items-center">
        {/* Upload Button */}
        <label htmlFor="image-upload" className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <Plus size={30} className="text-gray-400" />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* Display Uploaded Images */}
        {uploadedImages.map((imageSrc, index) => (
          <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden shadow-md">
            <img src={imageSrc} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      
      </div>
    </div>
  );
};

export default ImageUpload;

import React, { useState } from 'react';
import { Check, Palette, RefreshCw } from 'lucide-react';
import { experienceService } from '@/services/brands/experienceService';

interface ColorPickerProps {
  experienceId?: string; // Added experienceId prop
  onColorChange?: (color: string) => void;
  initialColor?: string;
  className?: string;
  onApply?: () => void; // New prop to notify parent when Apply is clicked
}

interface PresetColor {
  name: string;
  value: string;
  category: 'luxury' | 'natural' | 'fashion' | 'custom';
}

const BrandColorPicker: React.FC<ColorPickerProps> = ({ 
  experienceId,
  onColorChange, 
  initialColor = '#3b82f6',
  className = '',
  onApply
}) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'bold'>('bold');

  // Helper to update the preview iframe
  const updatePreview = (color: string, themeKey: 'light' | 'bold') => {
    const iframe = document.querySelector('iframe[title="Live Customer Preview"]') as HTMLIFrameElement | null;
    if (iframe) {
      const src = new URL(iframe.src);
      src.searchParams.set('color', color);
      src.searchParams.set('themeKey', themeKey);
      iframe.src = src.toString();
    }
  };

  // Predefined color presets organized by category
const presetColors: PresetColor[] = [
  // Luxury / Premium tones
  { name: 'Rose Gold', value: '#B76E79', category: 'luxury' },
  { name: 'Deep Plum', value: '#580F41', category: 'luxury' },
  { name: 'Emerald Green', value: '#046307', category: 'luxury' },
  { name: 'Midnight Blue', value: '#191970', category: 'luxury' },

  // Natural / Wellness
  { name: 'Sage Green', value: '#6B8E23', category: 'natural' },
  { name: 'Earth Brown', value: '#7D5A50', category: 'natural' },
  { name: 'Terracotta', value: '#8E4B32', category: 'natural' },

  // Bold / Fashion
  { name: 'Crimson Red', value: '#DC143C', category: 'fashion' },
  { name: 'Royal Purple', value: '#6A0DAD', category: 'fashion' },
  { name: 'Electric Blue', value: '#0056A3', category: 'fashion' },
  { name: 'Vibrant Teal', value: '#008080', category: 'fashion' },
  { name: 'Deep Magenta', value: '#8B008B', category: 'fashion' },
  { name: 'Copper Orange', value: '#B7410E', category: 'fashion' },
];

  const colorCategories = [
    { key: 'luxury', label: 'Luxury / Premium', colors: presetColors.filter(c => c.category === 'luxury') },
    { key: 'natural', label: 'Natural / Wellness', colors: presetColors.filter(c => c.category === 'natural') },
    { key: 'fashion', label: 'Bold / Fashion', colors: presetColors.filter(c => c.category === 'fashion') },
  ];



  const handlePresetColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setSelectedColor(color);
  };

const generateRandomColor = () => {
  const colors = [
    '#8B0000', // Dark Red
    '#006400', // Dark Green
    '#483D8B', // Dark Slate Blue
    '#800000', // Maroon
    '#191970', // Midnight Blue
    '#5f27cd', // Deep Indigo
    '#8B008B', // Dark Magenta
    '#B7410E', // Copper Orange
    '#2F4F4F', // Dark Slate Gray
    '#4B0082', // Indigo
    '#9932CC', // Dark Orchid
    '#A52A2A', // Brown
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  setCustomColor(randomColor);
  setSelectedColor(randomColor);
};


  const handleApply = async () => {
    // Update preview iframe
    updatePreview(selectedColor, selectedTheme);
    // Call backend to persist theme and color
    if (experienceId) {
      try {
        await experienceService.setThemeAndColor(experienceId, selectedTheme, selectedColor);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to set theme and color', e);
      }
    }
    // Optionally call onColorChange
    onColorChange?.(selectedColor);
    // Notify parent to switch tab if needed
    if (typeof onApply === 'function') {
      onApply();
    }
  };

  return (
  <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gray-100">
          <Palette className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Brand Color</h3>
          <p className="text-sm text-gray-600">Choose your brand's primary color</p>
        </div>
      </div>

      {/* Color Preview & Theme Selector */}
      <div className="mb-6 flex flex-col gap-4">
        <div 
          className="w-full h-16 rounded-xl shadow-inner border-2 border-gray-200 relative overflow-hidden"
          style={{ backgroundColor: selectedColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute bottom-2 left-3 text-white text-sm font-medium drop-shadow-lg">
            {selectedColor}
          </div>
        </div>
        {/* Theme Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Theme:</label>
          <select
            value={selectedTheme}
            onChange={e => {
              const themeKey = e.target.value as 'light' | 'bold';
              setSelectedTheme(themeKey);
              // updatePreview(selectedColor, themeKey); // Now handled by useEffect
            }}
            className="border border-gray-300  text-gray-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'presets' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'custom' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Custom
        </button>
      </div>

      {/* Content */}
      {activeTab === 'presets' ? (
        <div className="space-y-4">
          {colorCategories.map((category) => (
            <div key={category.key}>
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category.label}</h4>
              <div className="grid grid-cols-6 gap-2">
                {category.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handlePresetColorSelect(color.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-105 relative group ${
                      selectedColor === color.value 
                        ? 'border-gray-900 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Color Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Hex Color
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
                      setSelectedColor(e.target.value);
                    }
                  }}
                  placeholder="#000000"
                  className="w-full pl-12 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              <button
                onClick={generateRandomColor}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Generate Random Color"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Popular Custom Colors */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Colors</h4>
            <div className="grid grid-cols-8 gap-2">
              {[
                '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd',
                '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24', '#2d3436', '#636e72', '#a29bfe', '#fd79a8'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => handlePresetColorSelect(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedColor === color ? 'border-gray-900' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check className="w-3 h-3 text-white mx-auto drop-shadow-lg" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Apply Button */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          className="w-full py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg transform hover:scale-[1.02]"
          style={{ backgroundColor: selectedColor }}
          onClick={handleApply}
        >
          Apply Brand Color
        </button>
      </div>
    </div>
  );
};

export default BrandColorPicker;
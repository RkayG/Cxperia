'use client';
import { CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface DropdownSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
}


const DropdownSelect: React.FC<DropdownSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  searchPlaceholder = "Search..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [_dropdownMenuStyle, setDropdownMenuStyle] = useState<React.CSSProperties>({});
  const [_dropdownMenuPos, setDropdownMenuPos] = useState<{ top: number; left: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Calculate dropdown position and style to prevent overflow
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const minWidth = 300; // match min-w-[300px]
      const maxWidth = 400; // optional: set a max width for dropdown
      const margin = 12;
      let left = rect.left;
      const top = rect.bottom + window.scrollY;
      // Calculate available space to the right
      const availableWidth = window.innerWidth - left - margin;
      const width = Math.max(minWidth, Math.min(rect.width, availableWidth, maxWidth));
      // If dropdown would overflow right, shift left
      if (left + width > window.innerWidth - margin) {
        left = window.innerWidth - width - margin;
      }
      // If dropdown would overflow left, clamp to margin
      if (left < margin) {
        left = margin;
      }
      setDropdownMenuPos({ top, left });
      setDropdownMenuStyle({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        minWidth: `${minWidth}px`,
        width: `${width}px`,
        zIndex: 9999,
        background: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #d1d5db',
        maxHeight: '16rem',
        overflow: 'hidden',
      });
    } else {
      setDropdownMenuPos(null);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (event.key === 'Enter') {
      if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0] || '');
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full px-4 py-3.5 lg:py-2 border-2 lg:border-1 border-purple-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-pointer text-left flex items-center justify-between ${value ? 'bg-[#ede8f3]' : 'bg-white'}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu (no portal, so click-outside works) */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border text-gray-800 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors duration-150 flex items-center justify-between group"
                >
                  <span className="text-gray-900 group-hover:text-purple-700">
                    {option}
                  </span>
                  {value === option && (
                    <CheckIcon className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownSelect;

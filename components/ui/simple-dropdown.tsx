'use client';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface SimpleDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full px-4 py-3.5 lg:py-2 border-2 lg:border-1 border-purple-900 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 cursor-pointer text-left flex items-center justify-between ${
          value ? 'bg-[#ede8f3]' : 'bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-hidden">
          {/* Options List */}
          <div className="max-h-64 overflow-y-auto">
            {options.length > 0 ? (
              options.map((option) => (
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
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleDropdown;

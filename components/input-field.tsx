import { Eye, EyeOff } from 'lucide-react';
import React from 'react';

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  showPasswordToggle?: boolean;
  autoComplete?: string;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
  onKeyPress,
  required = false,
  showPasswordToggle = false,
  autoComplete,
  onTogglePassword,
  showPassword = false
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block bricolage-grotesque-light text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
           onKeyPress={onKeyPress}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bricolage-grotesque-light px-4 py-3 bg-gray-50 border border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200"
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;

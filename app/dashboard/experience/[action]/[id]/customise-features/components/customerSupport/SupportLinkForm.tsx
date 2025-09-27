import React from 'react';
import type { SupportLinkFormProps } from '@/types/customerServiceTypes';

const SupportLinkForm: React.FC<SupportLinkFormProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  id,
  icon: Icon,
}) => {
  return (
    <div className="group">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gray-500" />}
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
      />
  </div>
  );
};

export default SupportLinkForm;
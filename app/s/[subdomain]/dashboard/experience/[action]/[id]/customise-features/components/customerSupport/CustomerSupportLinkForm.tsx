import React from 'react';
import type { SupportLinkFormProps } from '@/types/customerServiceTypes';

const SupportLinkForm: React.FC<SupportLinkFormProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  id,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className=" px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SupportLinkForm;
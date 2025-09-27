// src/components/CustomerService/IntegrationSettings.tsx
import React from 'react';
import type { IntegrationSettingsProps } from '@/types/customerServiceTypes';

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({  onToggle }) => {
  return (
    <div className="bg-white rounded-xl">
     {/*  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Settings</h3> */}
      <div className="items-center flex justify-between">
        <label htmlFor="automaticIntegrationToggle" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="automaticIntegrationToggle"
            className="sr-only peer"
            checked={true}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
        <div>
          {/* <p className="text-base font-medium text-gray-800">Automatic Integration</p> */}
          <p className="text-sm text-gray-600  ml-2">
            Automatically attach links to published experiences.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default IntegrationSettings;
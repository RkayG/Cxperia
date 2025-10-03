'use client';
import { useState, useEffect } from 'react';
import { User, Building2, Settings, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/brands/use-mobile';
import BrandProfileTab from './components/BrandProfileTab';
import UserProfileTab from './components/UserProfileTab';
import AccountSettingsTab from './components/AccountSettingsTab';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('brand');
  const [isLoading, _setIsLoading] = useState(true);
  const isMobile = useIsMobile();
/* 
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []); */

  const tabs: Tab[] = [
    {
      id: 'brand',
      label: 'Brand Profile',
      icon: <Building2 size={20} />,
      component: <BrandProfileTab />
    },
    {
      id: 'user',
      label: 'User Profile',
      icon: <User size={20} />,
      component: <UserProfileTab />
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: <Settings size={20} />,
      component: <AccountSettingsTab />
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-xl p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your brand profile, user information, and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl  border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            {isMobile ? (
              <div className="p-4">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-700 bg-purple-50 border-b-2 border-purple-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
}

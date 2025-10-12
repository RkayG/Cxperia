'use client';
import { useState, useEffect } from 'react';
import { User, Building2, Settings, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/brands/use-mobile';
import { useNavigationProgressContext } from '@/contexts/NavigationProgressContext';
import BrandProfileTab from './components/BrandProfileTab';
import UserProfileTab from './components/UserProfileTab';
import AccountSettingsTab from './components/AccountSettingsTab';
import SimpleDropdown from '@/components/ui/simple-dropdown';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('brand');
  const isMobile = useIsMobile();
/*   const { startLoading, finishLoading } = useNavigationProgressContext();
  
  // Trigger navigation progress on mount
  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      finishLoading();
    }, 500);
    return () => clearTimeout(timer);
  }, [startLoading, finishLoading]); */

  const tabs: Tab[] = [
    {
      id: 'brand',
      label: 'Profil de la marque',
      icon: <Building2 size={20} />,
      component: <BrandProfileTab />
    },
    {
      id: 'user',
      label: 'Profil utilisateur',
      icon: <User size={20} />,
      component: <UserProfileTab />
    },
    {
      id: 'settings',
      label: 'Paramètres du compte',
      icon: <Settings size={20} />,
      component: <AccountSettingsTab />
    }
  ];

  // Create options for dropdown with proper labels
  const dropdownOptions = tabs.map(tab => tab.label);
  const getTabIdFromLabel = (label: string) => tabs.find(tab => tab.label === label)?.id || 'brand';

  // Remove loading state - render immediately

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion du profil</h1>
          <p className="text-gray-600 mt-2">
            Gérez votre profil de marque, vos informations utilisateur et vos paramètres de compte
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl  border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            {isMobile ? (
              <div className="p-4">
                <SimpleDropdown
                  value={tabs.find(tab => tab.id === activeTab)?.label || 'Profil de la marque'}
                  onChange={(label) => setActiveTab(getTabIdFromLabel(label))}
                  options={dropdownOptions}
                  placeholder="Sélectionnez un onglet"
                  className="w-full"
                />
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

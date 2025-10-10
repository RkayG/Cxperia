'use client';
import { useState, useEffect } from 'react';
import { Building2, Upload, Save, Globe, MapPin, Phone, Mail, DollarSign, Pencil } from 'lucide-react';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { useIsMobile } from '@/hooks/brands/use-mobile';
interface BrandData {
  id: string;
  name: string;
  brand_slug: string;
  logo_url: string;
  website_url: string;
  contact_info: string;
  country: string;
  city: string;
  zip_code: string;
  business_address: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  plan_tier: 'starter' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled';
  custom_domain: string;
  monthly_volume: string;
  settings: {
    limits: {
      users: number;
      products: number;
      storage_mb: number;
      experiences: number;
    };
    features: {
      white_label: boolean;
      custom_domain: boolean;
      multi_user_roles: boolean;
      advanced_analytics: boolean;
    };
    preferences: {
      auto_publish: boolean;
      require_approval: boolean;
      email_notifications: boolean;
    };
  };
}

const BrandProfileTab: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const { brand, setBrand } = useExperienceStore();
  const isMobile = useIsMobile();
  // Use existing brand data from store, with fallback to empty object
  const brandData = brand || null;
  const [formData, setFormData] = useState<Partial<BrandData>>(brandData || {});

  // Update form data when brand data changes
  useEffect(() => {
    if (brandData) {
      setFormData(brandData);
    }
  }, [brandData]);

  // Only fetch if no brand data exists
  useEffect(() => {
    if (!brandData) {
      fetchBrandData();
    }
  }, [brandData]);

  const fetchBrandData = async () => {
    try {
      const response = await fetch('/api/profile/brand');
      const result = await response.json();
      
      if (result.success) {
        setBrand(result.data);
      } else {
        console.error('Error fetching brand data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    }
  };

  const handleInputChange = (field: keyof BrandData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Upload logo if changed
      let logoUrl = formData.logo_url;
      if (logoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', logoFile);
        uploadFormData.append('type', 'logo');
        
        const uploadResponse = await fetch('/api/profile/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.success) {
          logoUrl = uploadResult.data.url;
        }
      }

      // Update brand data
      const response = await fetch('/api/profile/brand', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          logo_url: logoUrl,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setBrandData(result.data);
        setBrand(result.data);
        setIsEditing(false);
        setLogoFile(null);
        setLogoPreview('');
      } else {
        console.error('Error saving brand data:', result.error);
      }
    } catch (error) {
      console.error('Error saving brand data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading only if no brand data and we're fetching
  if (!brandData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* Mobile Edit Button */}
          <div className="flex gap-3 justify-end mb-6 md:hidden">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 md:hidden text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center md:hidden gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 md:hidden bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        
        {/* Desktop Edit Button */}
      
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Building2 className="text-purple-600" />
            Brand Profile
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your brand information and settings
          </p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 hidden md:block text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center hidden md:flex gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 hidden md:block bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Logo</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {logoPreview || brandData?.logo_url ? (
              <img
                src={logoPreview || brandData?.logo_url}
                alt="Brand logo"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building2 size={32} className="text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
              disabled={!isEditing}
            />
            <label
              htmlFor="logo-upload"
              className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-colors ${
                isEditing
                  ? 'hover:bg-gray-50 hover:border-gray-400'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <Upload size={16} />
              {logoFile ? 'Change Logo' : 'Upload Logo'}
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 200x200px, PNG or JPG
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Slug
          </label>
          <input
            type="text"
            value={formData.brand_slug || ''}
            onChange={(e) => handleInputChange('brand_slug', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            placeholder="your-brand-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={formData.website_url || ''}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
              placeholder="https://your-website.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Domain
          </label>
          <input
            type="text"
            value={formData.custom_domain || ''}
            onChange={(e) => handleInputChange('custom_domain', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            placeholder="app.yourdomain.com"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.contact_name || ''}
              onChange={(e) => handleInputChange('contact_name', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                disabled={!isEditing}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Volume
            </label>
            <select
              value={formData.monthly_volume || ''}
              onChange={(e) => handleInputChange('monthly_volume', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            >
              <option value="">Select volume</option>
              <option value="0-100">0-100 orders</option>
              <option value="100-500">100-500 orders</option>
              <option value="500-1000">500-1000 orders</option>
              <option value="1000+">1000+ orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                value={formData.business_address || ''}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 resize-none"
                placeholder="Enter your business address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              value={formData.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.zip_code || ''}
              onChange={(e) => handleInputChange('zip_code', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Plan Information */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Tier
            </label>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-gray-400" />
              <span className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium capitalize">
                {formData.plan_tier}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subscription Status
            </label>
            <span className={`px-3 py-2 rounded-lg font-medium capitalize ${
              formData.subscription_status === 'active' 
                ? 'bg-green-100 text-green-800'
                : formData.subscription_status === 'trialing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {formData.subscription_status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandProfileTab;

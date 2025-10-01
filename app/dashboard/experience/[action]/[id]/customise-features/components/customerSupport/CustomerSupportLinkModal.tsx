import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useAddCustomerSupportLinks, useCustomerSupportLinksByBrand } from '@/hooks/brands/useFeatureApi';
import { X, MessageCircle, Phone, Mail, HelpCircle, Facebook, Instagram, Twitter, Youtube, Video, Loader2 } from "lucide-react";
import { validateField } from "./ValidationUtils";
import type { CustomerSupportLinksData, CustomerSupportLinksModalProps } from "@/types/customerServiceTypes";
import IntegrationSettings from "./IntegrationSettings";
import { showToast } from "@/utils/toast";
import { Skeleton } from "@/components/ui/skeleton";
// If you have a TikTok icon, import it, else use Video as fallback
// TikTok icon not available in lucide-react; use Video as fallback

const CustomerSupportLinksModal: React.FC<CustomerSupportLinksModalProps & { onAutoEnableFeature?: () => void }> = ({
  isOpen = true,
  onClose = () => {},
  initialData = {},
  onSave = () => {},
}) => {
  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);
  const defaultData: CustomerSupportLinksData = {
    liveChatWidgetUrl: "",
    whatsAppNumber: "",
    supportEmail: "",
    faqPageUrl: "",
    automaticIntegration: true,
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    tiktokUrl: "",
    youtubeUrl: "",
  };
  

  // Fetch customer support links for brand (backend gets brandId from req.user)
  const { data: brandLinksData, isLoading: isBrandLinksLoading } = useCustomerSupportLinksByBrand();
  console.log('Fetched brand support links:', brandLinksData);  
  // Type guard to ensure initialData is CustomerSupportLinksData
  const safeInitialData: Partial<CustomerSupportLinksData> = initialData && typeof initialData === 'object' ? initialData : {};
  const [formData, setFormData] = useState<CustomerSupportLinksData>({
    ...defaultData,
    ...safeInitialData,
    automaticIntegration: typeof safeInitialData.automaticIntegration === 'boolean'
      ? safeInitialData.automaticIntegration
      : true
  });

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Validate all fields on change using ValidationUtils
  const handleValidatedChange = (id: keyof CustomerSupportLinksData, value: string, type: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    const { error } = validateField(id as string, value, type);
    setFieldErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Prefill formData when brandLinksData is loaded
  useEffect(() => {
    if (brandLinksData && Array.isArray(brandLinksData.data)) {
      // Map backend links to form fields
      const mapped: Partial<CustomerSupportLinksData> = {};
      brandLinksData.data.forEach((link: any) => {
        switch (link.type) {
          case 'whatsapp': mapped.whatsAppNumber = link.value; break;
          case 'email': mapped.supportEmail = link.value; break;
          case 'faq': mapped.faqPageUrl = link.value; break;
          case 'facebook': mapped.facebookUrl = link.value; break;
          case 'instagram': mapped.instagramUrl = link.value; break;
          case 'twitter': mapped.twitterUrl = link.value; break;
          case 'tiktok': mapped.tiktokUrl = link.value; break;
          case 'youtube': mapped.youtubeUrl = link.value; break;
          default: break;
        }
      });
      setFormData({
        ...defaultData,
        ...mapped,
        automaticIntegration: true
      });
      // No auto-enable logic here; rely on backend state only
    }
  }, [brandLinksData]);

  const [activeTab, setActiveTab] = useState('support');

  // Skeleton component for form fields
  const FormSkeleton = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-purple-100">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const SocialFormSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-purple-100">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  const handleChange = (id: keyof CustomerSupportLinksData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Get brandId from context (assume BrandContext provides it)
  const addLinksMutation = useAddCustomerSupportLinks();

  const handleSave = async () => {
    // Map formData to backend link objects (only non-empty fields)
    const links = [
      { id: 'whatsAppNumber', type: 'whatsapp', value: formData.whatsAppNumber },
      { id: 'supportEmail', type: 'email', value: formData.supportEmail },
      { id: 'faqPageUrl', type: 'faq', value: formData.faqPageUrl },
      { id: 'facebookUrl', type: 'facebook', value: formData.facebookUrl },
      { id: 'instagramUrl', type: 'instagram', value: formData.instagramUrl },
      { id: 'twitterUrl', type: 'twitter', value: formData.twitterUrl },
      { id: 'tiktokUrl', type: 'tiktok', value: formData.tiktokUrl },
      { id: 'youtubeUrl', type: 'youtube', value: formData.youtubeUrl },
    ].filter(l => l.value && l.value.trim()).map(l => ({ type: l.type, value: l.value?.trim() }));
   
    if (links.length === 0) {
      showToast.error('Please provide at least one support link.');
      return;
    }

    setSaving(true);
    try {
      await addLinksMutation.mutateAsync(links);
      onSave(formData);
      showToast.success("Support links saved successfully! 🎉");
      onClose();
    } catch (err) {
      showToast.error('Failed to save support links. Please try again.');
    } finally {
      setSaving(false);
    }
  };


  if (!isOpen) return null;
  if (isBrandLinksLoading) {
    return (
      <Drawer open={true} onOpenChange={onClose}>
        <DrawerContent>
          <div className="flex items-center bg-gray-50 justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto mb-4" />
              <div className="text-lg text-purple-700 font-semibold">Loading support links...</div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  const supportFields: Array<{
    id: keyof CustomerSupportLinksData;
    label: string;
    placeholder: string;
    type: "tel" | "email" | "url" | "text";
    icon: React.ElementType;
  }> = [
    {
      id: "whatsAppNumber",
      label: "WhatsApp Number",
      placeholder: "+33 885 123 456",
      type: "tel",
      icon: Phone
    },
    {
      id: "supportEmail",
      label: "Support Email",
      placeholder: "help@skincarepro.com",
      type: "email",
      icon: Mail
    },
    {
      id: "faqPageUrl",
      label: "FAQ Page",
      placeholder: "https://www.skincarepro.com/faqs",
      type: "url",
      icon: HelpCircle
    }
  ];

  const socialFields: Array<{
    id: keyof CustomerSupportLinksData;
    label: string;
    placeholder: string;
    type: "tel" | "email" | "url" | "text";
    icon: React.ElementType;
  }> = [
    {
      id: "facebookUrl",
      label: "Facebook Page",
      placeholder: "https://facebook.com/yourpage",
      type: "url",
      icon: Facebook
    },
    {
      id: "instagramUrl",
      label: "Instagram Profile",
      placeholder: "https://instagram.com/yourprofile",
      type: "url",
      icon: Instagram
    },
    {
      id: "twitterUrl",
      label: "Twitter/X Profile",
      placeholder: "https://twitter.com/yourprofile",
      type: "url",
      icon: Twitter
    },
    {
      id: "tiktokUrl",
      label: "TikTok Profile",
      placeholder: "https://tiktok.com/@yourprofile",
      type: "url",
  icon: Video
    },
    {
      id: "youtubeUrl",
      label: "YouTube Channel",
      placeholder: "https://youtube.com/yourchannel",
      type: "url",
      icon: Youtube
    }
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="mx-auto bg-gray-50 max-w-screen-lg min-h-[90vh]  max-h-[90vh]">
        <button
              onClick={onClose}
              className="absolute top-2 z-50 right-2 p-1 rounded-xl bg-white text-black hover:bg-purple-600 hover:text-white  hover:rotate-90 transition-all duration-200 backdrop-blur-sm"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
        <div className="relative overflow-y-auto mb-24 text-gray-900 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Enhanced Header */}
          <div className="relative px-8 py-2 text-white">
            
            
            <div className="max-w-2xl ">
              <h2 className=" text-xl md:text-2xl text-left  text-gray-900  font-bold mb-2">
                Customer Support Hub
              </h2>
              <p className="text-sm  text-left text-gray-900 leading-relaxed">
                Connect your customers with multiple support channels and social media platforms for seamless communication
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-6">
            <button
              onClick={() => setActiveTab('support')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'support'
                  ? 'border-purple-500 text-purple-600 bg-white rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-t-lg'
              }`}
            >
              <MessageCircle className="inline-block w-4 h-4 mr-2" />
              Support Channels
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'social'
                  ? 'border-purple-500 text-purple-600 bg-white rounded-t-lg'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-t-lg'
              }`}
            >
              <Facebook className="inline-block w-4 h-4 mr-2" />
              Social Media
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 ">
            <div className="md:p-8">
              {isBrandLinksLoading ? (
                activeTab === 'support' ? <FormSkeleton /> : <SocialFormSkeleton />
              ) : (
                <>
                  {activeTab === 'support' && (
                    <div className="space-y-8">
                      {/* Support Links Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-6 ">
                        {supportFields.map((field) => {
                          const value = formData[field.id as keyof CustomerSupportLinksData] as string;
                          const error = fieldErrors[field.id] || '';
                          return (
                            <div key={field.id} className="bg-white rounded-xl p-6 border border-purple-100 hover:border-purple-200 transition-colors">
                              <label htmlFor={field.id} className="block text-left text-purple-800 text-sm font-medium mb-2">
                                {field.label}
                              </label>
                              <input
                                type={field.type}
                                id={field.id}
                                value={value}
                                onChange={e => handleValidatedChange(field.id, e.target.value, field.type)}
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border-1 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 border-purple-900 ${value ? 'bg-[#ede8f3]' : ''} ${error ? 'border-red-600 bg-red-50' : ''}`}
                              />
                              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeTab === 'social' && (
                    <div className="space-y-6">
                     {/*  <div className="text-center md:mb-8">
                        <h3 className="text-xl mt-4 font-semibold text-gray-900 mb-2">Social Media Profiles</h3>
                        <p className="text-gray-600 mx-2">Connect your social media accounts to provide additional support channels</p>
                      </div> */}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6">
                        {socialFields.map((field) => {
                          const value = formData[field.id] as string;
                          const error = fieldErrors[field.id] || '';
                          return (
                            <div key={field.id} className="bg-white rounded-xl p-6 border border-purple-100 hover:border-purple-200 transition-colors">
                              <label htmlFor={field.id} className="block text-left text-purple-800 text-sm font-medium mb-2">
                                {field.label}
                              </label>
                              <input
                                type={field.type}
                                id={field.id}
                                value={value}
                                onChange={e => handleValidatedChange(field.id, e.target.value, field.type)}
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 border-1 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 border-purple-900 ${value ? 'bg-[#ede8f3]' : ''} ${error ? 'border-red-600 bg-red-50' : ''}`}
                              />
                              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="flex flex-col fixed bottom-0 w-full sm:flex-row justify-between items-center gap-4 px-8 py-4 border-t border-gray-200 bg-gray-50">
            <IntegrationSettings
              isChecked={formData.automaticIntegration}
              onToggle={(val) => handleChange("automaticIntegration", val)}
            />
            
            <div className="flex gap-6">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-purple-800 text-white font-medium rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomerSupportLinksModal;
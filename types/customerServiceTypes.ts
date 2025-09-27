
export interface CustomerSupportLinksData {
  liveChatWidgetUrl: string;
  whatsAppNumber: string;
  supportEmail: string;
  faqPageUrl: string;
  automaticIntegration: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
}

export interface CustomerSupportLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CustomerSupportLinksData;
  onSave: (data: CustomerSupportLinksData) => void;
}

export interface SupportLinkFormProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'url' | 'email' | 'tel' | 'text';
  id: string; // Unique ID for the input
  icon?: any;
}

export interface IntegrationSettingsProps {
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}
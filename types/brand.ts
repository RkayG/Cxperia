export interface Brand {
  id: string;
  name: string;
  brand_slug?: string;
  logo_url?: string;
  website_url?: string;
  created_at?: string;
  updated_at?: string;
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
  plan_tier?: 'starter' | 'pro' | 'enterprise';
  subscription_status?: 'active' | 'trialing' | 'past_due' | 'canceled';
  stripe_customer_id?: string;
  current_period_end?: string;
  custom_domain?: string;
  contact_info?: string;
  country?: string;
  city?: string;
  zip_code?: string;
  business_address?: string;
  contact_email?: string;
  contact_name?: string;
  contact_phone?: string;
  contract_value: number;
  sales_notes?: string;
  status?: string;
  monthly_volume?: string;
}
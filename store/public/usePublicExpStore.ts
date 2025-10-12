import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { usePublicExperience } from '@/hooks/public/useExperience'; // Adjust path if needed
import { fetchPublicExperience } from '@/services/public/experienceService';

interface PublicExperienceState {
  experience: any;
  isLoading: boolean;
  error: string | null;
  slug: string;
  color: string;
  brandName: string;
  brandLogo: string;
  theme: string;
  product: any;
  productName: string;
  customer_support_links_simple: any[];
  fetchExperience: (slug: string) => Promise<void>;
  refetch: () => Promise<void>;
  setColor: (color: string) => void;
}

export const usePublicExpStore = create<PublicExperienceState>()(
  devtools((set, get) => ({
    experience: null,
    isLoading: false,
    error: null,
    slug: '',
    color: '',
    brandName: '',
    brandLogo: '',
    theme: '',
    product: null,
  customer_support_links_simple: [],
  productName: '',
  setColor: (color: string) => {
    set({ color });
  },
    fetchExperience: async (slug: string) => {
      set({ isLoading: true, error: null, slug });
      try {
        const data = await fetchPublicExperience(slug);
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          data.success === false &&
          'message' in data &&
          (data.message === 'Not found' || data.message === 'Not Found')
        ) {
          set({ error: 'not_found', isLoading: false, experience: null });
          return;
        }
        let color = '';
        let brandName = '';
        let brandLogo = '';
        let theme = '';
        let product = null;
        let customer_support_links_simple: any[] = [];
        let productName = '';
        const expData = (data && typeof data === 'object' && 'data' in data) ? (data as any).data : undefined;
        if (expData) {
          color = typeof expData.primary_color === 'string' ? expData.primary_color : '';
          brandName = expData.brand_name || '';
          brandLogo = expData.brand_logo_url || '';
          theme = expData.theme || '';
          product = expData.product || null;
          productName = product?.name || '';
          customer_support_links_simple = expData.customer_support_links_simple || [];
        }
        set({ experience: data, color, brandName, brandLogo, theme, product, productName, customer_support_links_simple, isLoading: false });
      } catch (error: any) {
        set({ error: String(error), isLoading: false, experience: null });
      }
    },
    refetch: async () => {
      const { slug, fetchExperience } = get();
      if (slug) {
        await fetchExperience(slug);
      }
    },
  }))
);

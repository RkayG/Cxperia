import { useCallback } from 'react';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { useCreateExperience } from './useExperienceApi';
import { showToast } from '@/lib/toast';
import type { Experience } from '../../../Cyxperia/CxperiaPlatform/src/types/productExperience';

export const useExperienceOperations = () => {
  const { mutateAsync: createExperienceMutation } = useCreateExperience();
  const { setExperienceData, setIds, setLoading } = useExperienceStore();

  const createExperience = useCallback(async (data: any, stepOneData: Experience) => {
    setLoading(true);
    try {
      const result = await createExperienceMutation(data);
      
      if (result && result.data) {
        const expId = result.data.id;
        const prodId = result.data.productId;
        const product = result.data.product || result.data;
        
        // Map response to step one data format
        const mappedData: Partial<Experience> = {
          productName: product?.name || stepOneData.productName,
          tagline: product?.tagline || stepOneData.tagline,
          skinType: product?.skin_type || stepOneData.skinType || '',
          description: product?.description || stepOneData.description || '',
          category: product?.category || stepOneData.category,
          originalPrice: product?.original_price ?? stepOneData.originalPrice ?? null,
          discountedPrice: product?.discounted_price ?? stepOneData.discountedPrice ?? null,
          storeLink: product?.store_link || stepOneData.storeLink,
          estimatedDurationDays: product?.estimated_usage_duration_days ?? stepOneData.estimatedDurationDays,
          netContent: product?.net_content ?? stepOneData.netContent ?? null,
          experienceId: expId,
        };
        
        // Handle images
        const imageField = product?.product_image_url || product?.productImageUrl;
        if (imageField) {
          if (Array.isArray(imageField)) {
            mappedData.images = imageField.map((u: any) => 
              (typeof u === 'string' ? { url: u } : u)).filter(Boolean);
          } else if (typeof imageField === 'string') {
            mappedData.images = [{ 
              id: `img-${Date.now()}-${Math.floor(Math.random()*1000)}`, 
              url: imageField 
            }];
          }
        }
        
        // Update state
        setExperienceData(mappedData);
        setIds(expId, prodId);
        
        return result;
      }
      
      throw new Error('No valid response from server');
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to create experience');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createExperienceMutation, setExperienceData, setIds, setLoading]);

  return { createExperience };
};
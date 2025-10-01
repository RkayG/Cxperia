import { useCallback } from 'react';
import { useExperienceStore } from '@/store/brands/useExperienceStore';
import { useCreateExperience, useUpdateExperience } from './useExperienceApi';
import { showToast } from '@/lib/toast';
import type { Experience } from '@/types/productExperience';

export const useExperienceOperations = () => {
  //console.log('[useExperienceOperations] loaded');
  const { mutateAsync: createExperienceMutation } = useCreateExperience();
  const { mutateAsync: updateExperienceMutation } = useUpdateExperience();
  const { setExperienceData, setIds, setLoading } = useExperienceStore();

  const createExperience = useCallback(async (data: any, stepOneData: Experience) => {
    setLoading(true);
    try {
      // Check if we're updating an existing experience
      const result = data.experience_id 
        ? await updateExperienceMutation({ id: data.experience_id, data: data })
        : await createExperienceMutation(data);
      
      console.log('Operation result:', result);
     // console.log("Mutation result:", result);
     // console.log("Mutation result type:", typeof result);
     // console.log("Mutation result keys:", Object.keys(result || {}));
     
      if (result && typeof result === 'object' && 'data' in result) {
        const responseData = (result as any).data;
        const expId = responseData.id;
        const prodId = responseData.productId;
        const product = responseData.product || responseData;
       // console.log("Extracted expId:", expId);
        //console.log("Extracted prodId:", prodId);
        
        // Map response to step one data format
        const mappedData: Partial<Experience> = {
          name: product?.name || stepOneData.name,
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
        
        //console.log("Returning result:", result);
        return result;
      }
      
      throw new Error('No valid response from server');
    } catch (error: any) {
      showToast.error(error?.message || 'Failed to create experience');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createExperienceMutation, updateExperienceMutation, setExperienceData, setIds, setLoading]);

  return { createExperience };
};
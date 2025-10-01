import type { Experience } from '../types/productExperience';
import type { UploadedImage } from '../types/productExperience';

/**
 * Deep comparison function for Experience objects
 * Handles special cases like image arrays and null/undefined values
 */
export const isExperienceDataEqual = (
  a: Experience | null | undefined, 
  b: Experience | null | undefined
): boolean => {
  // Handle null/undefined cases
  if (!a && !b) return true;
  if (!a || !b) return false;
  
  // Compare simple primitive fields
  const simpleFields: (keyof Experience)[] = [
    'name', 'category', 'tagline', 'skinType', 'description', 
    'storeLink', 'estimatedDurationDays', 'netContent'
  ];
  
  for (const field of simpleFields) {
    if (a[field] !== b[field]) {
      //console.log(`[compare] Field ${field} changed:`, a[field], '→', b[field]);
      return false;
    }
  }
  
  // Compare price fields (handle null/undefined)
  if (a.originalPrice !== b.originalPrice) {
   // console.log('[compare] originalPrice changed:', a.originalPrice, '→', b.originalPrice);
    return false;
  }
  
  if (a.discountedPrice !== b.discountedPrice) {
    //console.log('[compare] discountedPrice changed:', a.discountedPrice, '→', b.discountedPrice);
    return false;
  }
  
  // Compare experienceId (handle undefined)
  if (a.experienceId !== b.experienceId) {
    //console.log('[compare] experienceId changed:', a.experienceId, '→', b.experienceId);
    return false;
  }
  
  // Compare images array (product_image_url)
  if (!areImagesEqual(a.product_image_url || [], b.product_image_url || [])) {
    //console.log('[compare] images changed');
    return false;
  }
  
  return true;
};

/**
 * Compare two arrays of images by their URLs
 */
export const areImagesEqual = (a: UploadedImage[], b: UploadedImage[]): boolean => {
  if (a.length !== b.length) {
    //console.log('[compare] image count changed:', a.length, '→', b.length);
    return false;
  }
  
  for (let i = 0; i < a.length; i++) {
    const imgA = a[i];
    const imgB = b[i];
    
    // Compare by URL only (ignore file objects and other metadata)
    if (imgA?.url !== imgB?.url) {
      //console.log('[compare] image URL changed at index', i, ':', imgA?.url, '→', imgB?.url);
      return false;
    }
  }
  
  return true;
};

/**
 * Check if form data has meaningful changes (ignores temporary fields)
 */
export const hasFormChanges = (
  initial: Experience | null | undefined, 
  current: Experience | null | undefined
): boolean => {
  return !isExperienceDataEqual(initial, current);
};
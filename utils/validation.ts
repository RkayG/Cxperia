export const validateStoreLink = (value: string): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return "Only https links are allowed";
    }
    return null;
  } catch (e) {
    return "Please enter a valid URL (include https://)";
  }
};
import type { Experience } from '../types/productExperience';

export interface ValidationErrors {
  productName?: string;
  category?: string;
  skinType?: string;
  tagline?: string;
  description?: string;
  storeLink?: string;
  images?: string;
  estimatedDurationDays?: string;
}

export const validateStepOne = (data: Experience): ValidationErrors => {
  const errors: ValidationErrors = {};
  if (!data.productName?.trim()) errors.productName = 'Product name is required.';
  if (!data.category?.trim()) errors.category = 'Category is required.';
  if (!data.tagline?.trim()) errors.tagline = 'Tagline is required.';
  if (!data.description?.trim()) errors.description = 'Description is required.';
  if (!data.storeLink?.trim()) {
    errors.storeLink = 'Store link is required.';
  } else {
    const storeLinkError = validateStoreLink(data.storeLink);
    if (storeLinkError) errors.storeLink = storeLinkError;
  }
  if (!data.product_image_url || data.product_image_url.length === 0) errors.images = 'At least one image is required.';
  if (!data.estimatedDurationDays || data.estimatedDurationDays <= 0) {
    errors.estimatedDurationDays = 'Estimated duration is required.';
  }
  return errors;
};

export const scrollToError = (errors: ValidationErrors) => {
  const firstKey = Object.keys(errors)[0] as keyof ValidationErrors;
  if (!firstKey) return;
  
  try {
    let element = document.getElementById(String(firstKey)) as HTMLElement | null;
    if (!element) {
      element = document.querySelector(`[name="${String(firstKey)}"]`) as HTMLElement | null;
    }
    if (!element) {
      element = document.querySelector(`[data-key="${String(firstKey)}"]`) as HTMLElement | null;
    }
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        try {
          if (typeof (element as any).focus === 'function') (element as any).focus();
        } catch (e) {
          // Ignore focus errors
        }
      }, 400);
    }
  } catch (e) {
    console.warn('Failed to scroll to error', e);
  }
};
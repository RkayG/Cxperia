/**
 * Utility functions for sanitizing public API responses
 * Removes sensitive internal data that should not be exposed to public clients
 */

/**
 * Removes brand_id and other sensitive fields from an object
 * @param obj - The object to sanitize
 * @param additionalFields - Additional fields to remove (optional)
 * @returns Sanitized object
 */
export function sanitizePublicData<T extends Record<string, any>>(
  obj: T,
  additionalFields: string[] = []
): Omit<T, 'brand_id' | 'user_id' | 'created_by' | 'updated_by'> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const sensitiveFields = ['brand_id', 'user_id', 'created_by', 'updated_by', ...additionalFields];
  
  // Create a deep copy to avoid mutating the original
  const sanitized = JSON.parse(JSON.stringify(obj));
  
  // Remove sensitive fields recursively
  function removeSensitiveFields(item: any): any {
    if (Array.isArray(item)) {
      return item.map(removeSensitiveFields);
    }
    
    if (item && typeof item === 'object') {
      const cleaned = { ...item };
      sensitiveFields.forEach(field => {
        delete cleaned[field];
      });
      
      // Recursively clean nested objects
      Object.keys(cleaned).forEach(key => {
        cleaned[key] = removeSensitiveFields(cleaned[key]);
      });
      
      return cleaned;
    }
    
    return item;
  }
  
  return removeSensitiveFields(sanitized);
}

/**
 * Removes brand_id and other sensitive fields from an array of objects
 * @param array - The array to sanitize
 * @param additionalFields - Additional fields to remove (optional)
 * @returns Sanitized array
 */
export function sanitizePublicDataArray<T extends Record<string, any>>(
  array: T[],
  additionalFields: string[] = []
): Array<Omit<T, 'brand_id' | 'user_id' | 'created_by' | 'updated_by'>> {
  if (!Array.isArray(array)) {
    return array;
  }
  
  return array.map(item => sanitizePublicData(item, additionalFields));
}

/**
 * Removes brand_id from nested brand objects in experience data
 * This is a specialized function for experience-related responses
 * @param data - The experience data to sanitize
 * @returns Sanitized experience data
 */
export function sanitizeExperienceData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };
  
  // Remove brand_id at top level
  delete sanitized.brand_id;
  
  // Remove brand_id from nested brand object
  if (sanitized.brand && typeof sanitized.brand === 'object') {
    const brand = { ...sanitized.brand };
    delete brand.brand_id;
    delete brand.user_id;
    delete brand.created_by;
    delete brand.updated_by;
    sanitized.brand = brand;
  }
  
  // Remove brand_id from nested objects
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] && typeof sanitized[key] === 'object') {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map((item: any) => {
          if (item && typeof item === 'object') {
            const cleaned = { ...item };
            delete cleaned.brand_id;
            delete cleaned.user_id;
            delete cleaned.created_by;
            delete cleaned.updated_by;
            return cleaned;
          }
          return item;
        });
      } else {
        const cleaned = { ...sanitized[key] };
        delete cleaned.brand_id;
        delete cleaned.user_id;
        delete cleaned.created_by;
        delete cleaned.updated_by;
        sanitized[key] = cleaned;
      }
    }
  });
  
  return sanitized;
}

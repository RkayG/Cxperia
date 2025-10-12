import { fetchPublicExperience } from '@/services/public/experienceService';

export async function getExperienceBySlug(slug: string) {
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
      return null;
    }
    
    return data;
  } catch (error) {
    return null;
  }
}

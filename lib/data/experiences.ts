import { fetchPublicExperience } from '@/services/public/experienceService';

export async function getExperienceBySlug(slug: string) {
  try {
    console.log('🔍 Server-side: Fetching experience for slug:', slug);
    const data = await fetchPublicExperience(slug);
    
    if (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      data.success === false &&
      'message' in data &&
      (data.message === 'Not found' || data.message === 'Not Found')
    ) {
      console.log('❌ Server-side: Experience not found for slug:', slug);
      return null;
    }
    
    console.log('✅ Server-side: Experience fetched successfully for slug:', slug);
    return data;
  } catch (error) {
    console.error('❌ Server-side: Error fetching experience for slug:', slug, error);
    return null;
  }
}

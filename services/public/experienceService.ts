
import config, { getApiUrl } from '@/config/api';

export async function fetchPublicExperience(slug: string) {
	// Use the secure server-side API route instead of the public one
	const url = `/api/experience/${slug}`;
	
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		
		if (response.status === 404) {
			return { success: false, message: 'Not found' };
		}
		
		if (!response.ok) {
			throw new Error(`Error fetching experience: ${response.statusText}`);
		}
		
		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function invalidatePublicExperience(slug: string) {
  const endpoint = config.endpoints.INVALIDATE_CACHE.EXPERIENCE(slug);
  const url = getApiUrl(endpoint);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error invalidating experience cache: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
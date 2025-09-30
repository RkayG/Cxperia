
import config, { getApiUrl } from '@/config/api';

const PUBLIC_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || '';

export async function fetchExperienceTutorials(slug: string) {
	const endpoint = config.endpoints.PUBLIC.TUTORIAL.LIST(slug);
	const url = getApiUrl(endpoint);
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'x-public-secret': PUBLIC_SECRET,
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			throw new Error(`Error fetching tutorials: ${response.statusText}`);
		}
       // console.log('Response status:', response.status);
        //console.log('Response data:', await response.clone().json());
		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function invalidateExperienceTutorials(slug: string) {
	const endpoint = config.endpoints.INVALIDATE_CACHE.TUTORIAL(slug);
	const url = getApiUrl(endpoint);
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'x-public-secret': PUBLIC_SECRET,
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			throw new Error(`Error invalidating tutorials cache: ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}
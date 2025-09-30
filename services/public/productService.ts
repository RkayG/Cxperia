

import config, { getApiUrl } from '@/config/api';

const PUBLIC_SECRET = process.env.NEXT_PUBLIC_EXPERIENCE_SECRET || '';

export async function fetchExperienceProducts(slug: string) {
	const endpoint = config.endpoints.PUBLIC.PRODUCT.LIST(slug);
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
			throw new Error(`Error fetching products: ${response.statusText}`);
		}
		console.log('Response status:', response.status);
		console.log('Response data:', await response.clone().json());
		return await response.json();
	} catch (error) {
		throw error;
	}
}

export async function invalidateExperienceProducts(slug: string) {
	const endpoint = config.endpoints.INVALIDATE_CACHE.PRODUCT(slug);
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
			throw new Error(`Error invalidating products cache: ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		throw error;
	}
}
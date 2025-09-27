const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
import { getAuthHeaders } from '@/utils/getAuthHeaders';

/**
 * Get or set the public URL for an experience.
 * Returns the public URL string.
 */
export async function getOrSetPublicUrl(experienceId: string): Promise<string> {
	const res = await fetch(`${API_BASE}/experiences/single/public-url`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify({ experienceId }),
	});
	const payload = await res.json();
	console.log('Public URL Service Response:', payload);
	if (payload && payload.url) {
		return payload.url;
	}
	throw new Error(payload?.error || 'Failed to get/set public URL');
}

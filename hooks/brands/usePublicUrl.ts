import { useState } from 'react';
import { getOrSetPublicUrl } from '../../../Cyxperia/CxperiaPlatform/src/services/publicUrlSerivce';

/**
 * usePublicUrl - React hook to get or set public experience URL
 * @returns { getUrl, loading, error, publicUrl }
 */
export function usePublicUrl() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [publicUrl, setPublicUrl] = useState<string | null>(null);

	const getUrl = async (experienceId: string) => {
		setLoading(true);
		setError(null);
		setPublicUrl(null);
		try {
			const url = await getOrSetPublicUrl(experienceId);
			setPublicUrl(url);
		} catch (err: any) {
			setError(err.message || 'Failed to get/set public URL');
		} finally {
			setLoading(false);
		}
	};

	return { getUrl, loading, error, publicUrl };
}

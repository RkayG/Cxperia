import { useState, useEffect } from 'react';
import { generateQrCode, fetchQrCode } from '@/services/brands/qrService';

/**
 * useQrApi - React hook to generate and fetch QR codes
 * @returns { generate, fetchExisting, loading, error, qrDataUrl, qrUrl, productName }
 */
export function useQrApi(experienceId?: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
	const [qrUrl, setQrUrl] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null);

	// Fetch existing QR code on mount if experienceId is provided
	useEffect(() => {
		if (experienceId) {
			fetchExisting(experienceId);
		}
	}, [experienceId]);

	const fetchExisting = async (expId: string) => {
		setLoading(true);
		setError(null);
		try {
			const result = await fetchQrCode(expId);
			setQrDataUrl(result.qr);
			setQrUrl(result.url);
			setProductName(result.productName || null);
		} catch (err: any) {
			// Don't set error for missing QR codes, just leave fields empty
			if (!err.message.includes('not yet generated')) {
				setError(err.message || 'Failed to fetch QR code');
			}
		} finally {
			setLoading(false);
		}
	};

	const generate = async (expId: string, text?: string) => {
		setLoading(true);
		setError(null);
		try {
			const result = await generateQrCode(expId, text);
			setQrDataUrl(result.qr);
			setQrUrl(result.url);
			setProductName(result.productName || null);
		} catch (err: any) {
			setError(err.message || 'Failed to generate QR code');
		} finally {
			setLoading(false);
		}
	};

	return { generate, fetchExisting, loading, error, qrDataUrl, qrUrl, productName };
}

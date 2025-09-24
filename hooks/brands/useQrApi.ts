import { useState } from 'react';
import { generateQrCode } from '../../../Cyxperia/CxperiaPlatform/src/services/qrService';

/**
 * useQrApi - React hook to generate QR codes from text/URL
 * @returns { generate, loading, error, qrDataUrl }
 */
export function useQrApi() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
	const [qrUrl, setQrUrl] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null);

	const generate = async (text: string) => {
		setLoading(true);
		setError(null);
		setQrDataUrl(null);
		setQrUrl(null);
		setProductName(null);
		try {
			const result = await generateQrCode(text);
			setQrDataUrl(result.qr);
			setQrUrl(result.url);
			setProductName(result.productName || null);
		} catch (err: any) {
			setError(err.message || 'Failed to generate QR code');
		} finally {
			setLoading(false);
		}
	};

	return { generate, loading, error, qrDataUrl, qrUrl, productName };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
import { getAuthHeaders } from '@/utils/getAuthHeaders';
/**
 * Generate a QR code for a given text or URL.
 * Returns a data URL for the QR image.
 */
export async function generateQrCode(text: string): Promise<{ qr: string; url: string; productName?: string }> {
	const res = await fetch(`${API_BASE}/experiences/single/qr`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify({ text }),
	});
	const payload = await res.json();
	console.log('QR Service Response:', payload);
	if (payload && payload.qr) {
		return {
			qr: payload.qr,
			url: payload.url,
			productName: payload.productName
		};
	}
	throw new Error(payload?.error || 'Failed to generate QR code');
}

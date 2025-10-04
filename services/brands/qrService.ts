import config from '@/config/api';
const endpoint = config.endpoints;
/**
 * Generate a QR code for a given text or URL.
 * Returns a data URL for the QR image.
 */
export async function generateQrCode(expId: string, text: string): Promise<{ qr: string; url: string; productName?: string }> {
	const res = await fetch(`${endpoint.EXPERIENCE.QR(expId)}`, {
		method: 'POST',
		body: JSON.stringify({ text }),
	});
	const payload = await res.json();
	console.log('QR Service Response:', payload);
	if (payload && payload.qr) {
		return {
			qr: payload.qr,
			url: payload.url,
			productName: payload.name
		};
	}
	throw new Error(payload?.error || 'Failed to generate QR code');
}

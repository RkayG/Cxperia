import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL for the given text or URL.
 *
 * NOTE: Requires 'qrcode' npm package to be installed.
 *
 * @param text - The text or URL to encode in the QR code.
 * @returns A promise that resolves to a data URL of the QR code image.
 */
export async function generateQrCode(text: string): Promise<string> {
  try {
    // We use .toDataURL to get a Base64 string that can be directly displayed in the browser.
    const qrDataUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H', // High error correction
      margin: 1,
      scale: 8,
    });
    return qrDataUrl;
  } catch (err: any) {
    console.error("QR Code Generation Failed:", err);
    throw new Error('Failed to generate QR code: ' + err.message);
  }
}

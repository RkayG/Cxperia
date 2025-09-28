const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

// CUSTOMER SUPPORT LINKS (brand scoped)
export async function getCustomerSupportLinksByBrand() {
  const res = await fetch(`${API_BASE}/brands/support-links`);
  return res.json();
}
// Add one or multiple support links for a brand
export async function addCustomerSupportLinks(links: any[]) {
  const res = await fetch(`${API_BASE}/brands/support-links`, {
    method: 'POST',
    body: JSON.stringify(links),
  });
  return res.json();
}

// Set brand logo URL (after uploading image via /upload)
export async function setBrandLogo(logoUrl: string) {
  const res = await fetch(`${API_BASE}/brands/logo`, {
    method: 'POST',
    body: JSON.stringify({ logo_url: logoUrl }),
  });
  return res.json();
}

// Get brand logo URL
export async function getBrandLogo() {
  const res = await fetch(`${API_BASE}/brands/logo`);
  return res.json();
}

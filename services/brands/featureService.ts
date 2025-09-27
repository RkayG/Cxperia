
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

// Link tutorials to an experience (many-to-many)
export async function linkTutorialsToExperience(experienceId: string, tutorialIds: string[]) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/tutorials/link`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ tutorialIds }),
  });
  return res.json();
}

// Get recent tutorials for a brand (last 30 days)
export async function getRecentTutorials() {
  const res = await fetch(`${API_BASE}/tutorials/recent`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}
// src/services/featureService.ts
// Service for Experience Feature API calls


function getAuthHeaders() {
  // Prefer token from cookie (name: 'token'), fallback to localStorage
  function getCookie(name: string) {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  const token = getCookie('token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// INGREDIENTS
export async function getIngredients(experienceId: string) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/ingredients`, { headers: getAuthHeaders() });
  return res.json();
}
export async function addIngredient(_experienceId: string, data: any) {
  const res = await fetch(`${API_BASE}/experiences/ingredients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// Bulk add ingredients: accepts an array of ingredient objects or { ingredients: [...] }
// NOTE: backend currently exposes POST /experiences/:experience_id/ingredients. If you prefer
// a dedicated bulk endpoint, create POST /experiences/ingredients on the server to accept
// per-item experience_id/product_id in the body. This client function posts to that path.
export async function addIngredients(data: any) {
  const res = await fetch(`${API_BASE}/experiences/ingredients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateIngredient(experienceId: string, ingredientId: string, data: any) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/ingredients/${ingredientId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function deleteIngredient(experienceId: string, ingredientId: string) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/ingredients/${ingredientId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Ingredient search for INCI ingredients
export async function searchInciIngredients(searchTerm: string, limit: number = 10) {
  const params = new URLSearchParams({ search: searchTerm, limit: String(limit) });
  const res = await fetch(`${API_BASE}/inci-ingredients?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch ingredients');
  const data = await res.json();
  console.log('Fetched INCI ingredients:', data);
  return Array.isArray(data.ingredients)
    ? data.ingredients.map((ing: any) => ({
        id: ing.id || null,
        inci_name: ing.inci_name || '',
        common_name: ing.common_name || '',
        category: ing.category || '',
        all_functions: ing.all_functions || [],
        is_allergen: ing.is_allergen || false,
      }))
    : [];
}

// TUTORIALS
// Get all tutorials for an experience (pass experienceId as query param)
export async function getTutorials() {
  const res = await fetch(`${API_BASE}/experiences/tutorials`, { headers: getAuthHeaders() });
  return res.json();
}

// Add a tutorial (experience_id in body)
export async function addTutorial(data: any) {
  const res = await fetch(`${API_BASE}/experiences/tutorials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// Get a tutorial by id
export async function getTutorialById(tutorialId: string) {
  const res = await fetch(`${API_BASE}/experiences/tutorials/${tutorialId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Update a tutorial by id
export async function updateTutorial(tutorialId: string, data: any) {
  const res = await fetch(`${API_BASE}/experiences/tutorials/${tutorialId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// Delete a tutorial by id
export async function deleteTutorial(tutorialId: string) {
  const res = await fetch(`${API_BASE}/experiences/tutorials/${tutorialId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Get tutorial IDs linked to an experience
export async function getTutorialIdsLinkedToExperience(experienceId: string) {
  const res = await fetch(`${API_BASE}/experiences/tutorials-linked/${experienceId}`, { headers: getAuthHeaders() });
  return res.json();
}


// DIGITAL INSTRUCTIONS
export async function getInstructions(experienceId: string ) {
  console.log('Fetching instructions for experienceId:', experienceId);
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/instructions`, {
     headers: getAuthHeaders(),
  });
  console.log('Get instructions response status:', res.status);
  console.log('Get instructions response headers:', res.headers);
  console.log('Get instructions response body:', await res.clone().text());
  return res.json();
}

export async function addInstruction(experienceId: string, data: any) {
  // usage_time_type can be included in data
  const res = await fetch(`${API_BASE}/experiences/instructions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...data, experience_id: experienceId }),
  });
  return res.json();
}


// CUSTOMER SUPPORT LINKS (brand scoped)
export async function getCustomerSupportLinksByBrand() {
  const res = await fetch(`${API_BASE}/brands/support-links`, { headers: getAuthHeaders() });
  return res.json();
}
// Add one or multiple support links for a brand
export async function addCustomerSupportLinks(links: any[]) {
  const res = await fetch(`${API_BASE}/brands/support-links`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(links),
  });
  return res.json();
}

// Set brand logo URL (after uploading image via /upload)
export async function setBrandLogo(logoUrl: string) {
  const res = await fetch(`${API_BASE}/brands/logo`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ logo_url: logoUrl }),
  });
  console.log('setBrandLogo response status:', res.status);
  console.log('setBrandLogo response headers:', res.headers);
  console.log('setBrandLogo response body:', await res.clone().text());
  return res.json();
}

// Get brand logo URL
export async function getBrandLogo() {
  const res = await fetch(`${API_BASE}/brands/logo`, { headers: getAuthHeaders() });
  return res.json();
}

// FEEDBACK FORMS
export async function getFeedbackForms(experienceId: string) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/feedback-forms`, { headers: getAuthHeaders() });
  return res.json();
}
export async function updateFeedbackForms(experienceId: string, data: any) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/feedback-forms`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

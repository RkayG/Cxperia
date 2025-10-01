import config from "@/config/api";
const { endpoints, API_BASE_URL } = config;

const API_BASE = API_BASE_URL || 'http://localhost:8000/api';

export async function linkTutorialsToExperience(experienceId: string, tutorialIds: string[]) {
  const res = await fetch(endpoints.TUTORIAL.LINK(experienceId), {
    method: 'POST',
    body: JSON.stringify({ tutorialIds }),
  });
  return res.json();
}

// Get recent tutorials for a brand (last 30 days)
export async function getRecentTutorials() {
  const res = await fetch(endpoints.TUTORIAL.LIST('recents'));
  return res.json();
}
// src/services/featureService.ts
// Service for Experience Feature API calls



// INGREDIENTS
export async function getIngredients(experienceId: string) {
  const res = await fetch(endpoints.INGREDIENT.LIST(experienceId));
  return res.json();
}

export async function addIngredient(_experienceId: string, data: any) {
  
  if (!_experienceId && data && data.experienceId) {
    _experienceId = data.experienceId;
  }
  if (!_experienceId) {
    throw new Error('Missing experienceId for adding ingredient');
  }
  const res = await fetch(endpoints.INGREDIENT.ADD(_experienceId), {
    method: 'POST',
    body: JSON.stringify(data.payload),
  });
  return res.json();
}

export async function updateIngredient(experienceId: string, ingredientId: string, data: any) {
  if (!experienceId) {
    throw new Error('Missing experienceId for updating ingredient');
  }
  if (!ingredientId) {
    throw new Error('Missing ingredientId for updating ingredient');
  }
  const res = await fetch(endpoints.INGREDIENT.UPDATE(experienceId, ingredientId), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function deleteIngredient(experienceId: string, ingredientId: string) {
  if (!experienceId) {
    throw new Error('Missing experienceId for deleting ingredient');
  }
  if (!ingredientId) {
    throw new Error('Missing ingredientId for deleting ingredient');
  }
  const res = await fetch(endpoints.INGREDIENT.DELETE(experienceId, ingredientId), {
    method: 'DELETE',
  });
  return res.json();
}

// Ingredient search for INCI ingredients with caching
const searchCache = new Map<string, { data: any[], timestamp: number }>();
const SEARCH_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function searchInciIngredients(searchTerm: string, limit: number = 20) {
  // Check cache first
  const cacheKey = `${searchTerm}-${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < SEARCH_CACHE_DURATION) {
    return cached.data;
  }

  const params = new URLSearchParams({ 
    search: searchTerm, 
    limit: String(limit),
    // Add cache-busting only for development
    ...(process.env.NODE_ENV === 'development' && { _t: Date.now().toString() })
  });
  
  const res = await fetch(`${API_BASE}/inci-ingredients?${params.toString()}`, {
    headers: {
      'Cache-Control': 'max-age=3600', // 1 hour cache
    }
  });
  
  if (!res.ok) throw new Error('Failed to fetch ingredients');
  const data = await res.json();
  
  const result = Array.isArray(data.ingredients)
    ? data.ingredients.map((ing: any) => ({
        id: ing.id || null,
        inci_name: ing.inci_name || '',
        common_name: ing.common_name || '',
        category: ing.category || '',
        all_functions: ing.all_functions || [],
        is_allergen: ing.is_allergen || false,
      }))
    : [];

  // Cache the results
  searchCache.set(cacheKey, {
    data: result,
    timestamp: Date.now()
  });

  return result;
}

// TUTORIALS
// Get all tutorials (optionally pass type: 'all' | 'recents')
export async function getTutorials(type: 'all' | 'recents' = 'all') {
  const res = await fetch(endpoints.TUTORIAL.LIST(type));
  return res.json();
}

// Add a tutorial (experience_id in body)
export async function addTutorial(data: any) {
  const res = await fetch(endpoints.TUTORIAL.CREATE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.json();
}

// Get a tutorial by id
export async function getTutorialById(tutorialId: string) {
  const res = await fetch(endpoints.TUTORIAL.DETAIL(tutorialId), {
    method: 'GET',
  });
  return res.json();
}

// Update a tutorial by id
export async function updateTutorial(tutorialId: string, data: any) {
  const res = await fetch(endpoints.TUTORIAL.UPDATE(tutorialId), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

// Delete a tutorial by id
export async function deleteTutorial(tutorialId: string) {
  console.log('Attempting to delete tutorial with ID:', tutorialId);
  console.log('API endpoint:', endpoints.TUTORIAL.DELETE(tutorialId));
  
  const res = await fetch(endpoints.TUTORIAL.DELETE(tutorialId), {
    method: 'DELETE',
  });
  
  console.log('Delete response status:', res.status);
  console.log('Delete response:', res);
  
  const result = await res.json();
  console.log('Delete result:', result);
  
  return result;
}

// Unpublish a tutorial by id
export async function unpublishTutorial(tutorialId: string) {
  const res = await fetch(endpoints.TUTORIAL.UPDATE(tutorialId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_published: false }),
  });
  return res.json();
}

// Get tutorial IDs linked to an experience
export async function getTutorialIdsLinkedToExperience(experienceId: string) {
  const res = await fetch(endpoints.TUTORIAL.LINK(experienceId));
  return res.json();
}


// DIGITAL INSTRUCTIONS
export async function getInstructions(experienceId: string ) {
  const res = await fetch(endpoints.INSTRUCTION.LIST(experienceId), {
  });
 
  return res.json();
}

export async function addInstruction(experienceId: string, data: any) {
  // usage_time_type can be included in data
  const res = await fetch(endpoints.INSTRUCTION.ADD(experienceId), {
    method: 'POST',
    body: JSON.stringify({ ...data, experience_id: experienceId }),
  });
  return res.json();
}


// CUSTOMER SUPPORT LINKS (brand scoped)
export async function getCustomerSupportLinksByBrand() {
  const res = await fetch(endpoints.BRAND.SUPPORT_LINKS);
  return res.json();
}
// Add one or multiple support links for a brand
export async function addCustomerSupportLinks(links: any[]) {
  const res = await fetch(endpoints.BRAND.SUPPORT_LINKS, {
    method: 'POST',
    body: JSON.stringify(links),
  });
  return res.json();
}

// Set brand logo URL (after uploading image via /upload)
export async function setBrandLogo(logoUrl: string) {
  const res = await fetch(endpoints.BRAND.LOGO, {
    method: 'POST',
    body: JSON.stringify({ logo_url: logoUrl }),
  });
  console.log('setBrandLogo response status:', res.status);
  console.log('setBrandLogo response headers:', res.headers);
  console.log('setBrandLogo response body:', await res.clone().text());
  return res.json();
}

// Get brand logo URL
export async function getBrandLogo() {
  const res = await fetch(endpoints.BRAND.LOGO);
  return res.json();
}

// FEEDBACK FORMS
export async function getFeedbackForms(experienceId: string) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/feedback-forms`);
  return res.json();
}
export async function updateFeedbackForms(experienceId: string, data: any) {
  const res = await fetch(`${API_BASE}/experiences/${experienceId}/feedback-forms`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.json();
}

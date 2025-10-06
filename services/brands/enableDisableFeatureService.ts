import config from "@/config/api";
const { endpoints } = config;

// DEBUG: Service loaded
console.log('[enableDisableFeatureService] loaded');
// src/services/enableFeatureService.ts
// Service for Experience Feature API calls (modeled after featureService.ts)
// Add/enable a feature for an experience
export async function enableFeature(experienceId: string, featureName: string) {
	console.log('enableFeature called with:', { experienceId, featureName });
	const endpoint = endpoints.FEATURE.ENABLE(experienceId);
	console.log('API endpoint:', endpoint);
	console.log('Full URL would be:', typeof window !== 'undefined' ? `${window.location.origin}${endpoint}` : `http://localhost:3000${endpoint}`);
	
	const res = await fetch(endpoints.FEATURE.ENABLE(experienceId), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ feature_name: featureName, is_enabled: true }),
	});
	
	console.log('Enable feature response status:', res.status);
	const responseData = await res.json();
	console.log('Enable feature response data:', responseData);
	
	if (!res.ok) {
		throw new Error(`Failed to enable feature: ${responseData.message || 'Unknown error'}`);
	}
	
	return responseData;
}

// Disable a feature by featureId (delete)
export async function disableFeature(experienceId: string, featureId: string) {
	const res = await fetch(endpoints.FEATURE.DISABLE(experienceId, featureId), {
		method: 'DELETE',
	});
	console.log('Disable feature response status:', res.status);
	return res.json();
}

// Update a feature (name, enabled, status)
export async function updateFeature(experienceId: string, featureId: string, data: Partial<{ feature_name: string; is_enabled: boolean; status: string }>) {
	const res = await fetch(endpoints.FEATURE.UPDATE(experienceId, featureId), {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return res.json();
}

// Get all features for an experience
export async function getFeaturesByExperience(experienceId: string) {
	const res = await fetch(endpoints.FEATURE.LIST(experienceId), {
	});
	console.log('Get features response status:', res.status);
	return res.json();
}

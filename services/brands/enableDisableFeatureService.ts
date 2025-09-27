
// DEBUG: Service loaded
console.log('[enableDisableFeatureService] loaded');
// src/services/enableFeatureService.ts
// Service for Experience Feature API calls (modeled after featureService.ts)
import { getAuthHeaders } from '../utils/getAuthHeaders';
const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

// Add/enable a feature for an experience
export async function enableFeature(experienceId: string, featureName: string) {
	const res = await fetch(`${API_BASE}/experiences/${experienceId}/features`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify({ feature_name: featureName, is_enabled: true }),
	});
	console.log('Enable feature response status:', res.status);
	return res.json();
}

// Disable a feature by featureId (delete)
export async function disableFeature(featureId: string) {
	const res = await fetch(`${API_BASE}/features/${featureId}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});
	console.log('Disable feature response status:', res.status);
	return res.json();
}

// Update a feature (name, enabled, status)
export async function updateFeature(featureId: string, data: Partial<{ feature_name: string; is_enabled: boolean; status: string }>) {
	const res = await fetch(`${API_BASE}/features/${featureId}`, {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});
	return res.json();
}

// Get all features for an experience
export async function getFeaturesByExperience(experienceId: string) {
	const res = await fetch(`${API_BASE}/experiences/${experienceId}/features`, {
		headers: getAuthHeaders(),
	});
	console.log('Get features response status:', res.status);
	return res.json();
}

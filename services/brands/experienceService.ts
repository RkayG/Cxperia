
// src/services/experienceService.ts
// Service for Experience API calls

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
import { getAuthHeaders } from '@/utils/getAuthHeaders';

// Create Experience
export async function createExperience(data: any) {
  const res = await fetch(`${API_BASE}/experiences/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  console.log('Create Experience response status:', res.status);
  return res.json();
}

// Get all Experiences (optionally by brand)
export async function getExperiences(brand_id?: string | undefined) {
  const url = brand_id
    ? `${API_BASE}/experiences?brand_id=${brand_id}`
    : `${API_BASE}/experiences`;
  const res = await fetch(url, { headers: getAuthHeaders() });

  return res.json();
}

// Get recent experiences (last 30 days) - client-side filter over the experiences endpoint
export async function getRecentExperiences(brand_id?: string | undefined) {
  // Reuse the experiences endpoint and filter on the client to avoid backend changes
  const url = brand_id
    ? `${API_BASE}/experiences?brand_id=${brand_id}`
    : `${API_BASE}/experiences`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  const payload = await res.json();
  // Expecting backend shape: { success: true, data: [...] }
  const rows = payload && payload.data ? payload.data : (Array.isArray(payload) ? payload : []);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const filtered = (rows || []).filter((e: any) => {
    const created = new Date(e.created_at || e.createdAt || e.createdAtDate || 0);
    return created >= cutoff;
  });
  return { success: true, data: filtered };
}

// Get Experience by ID
export async function getExperienceById(id: string | undefined) {
  const res = await fetch(`${API_BASE}/experiences/single/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Update Experience
export async function updateExperience(id: string | undefined, data: any) {
  const res = await fetch(`${API_BASE}/experiences/single/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

// Get Experience URL by ID
export async function getExperienceUrl(id: string | undefined) {
  const res = await fetch(`${API_BASE}/experiences/single/${id}/url`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Set theme and primary_color for an experience
export async function setThemeAndColor(id: string | undefined, theme: string, primary_color: string) {
  const res = await fetch(`${API_BASE}/experiences/single/${id}/theme`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ theme, primary_color }),
  });
  return res.json();
}

// Delete Experience
export async function deleteExperience(id: string | undefined) {
  const res = await fetch(`${API_BASE}/experiences/single/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Publish/Unpublish Experience
export async function setPublishStatus(id: string | undefined, is_published: boolean) {
  const res = await fetch(`${API_BASE}/experiences/single/${id}/publish`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ is_published }),
  });
  return res.json();
}

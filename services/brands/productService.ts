// src/services/productService.ts
// Service for Product API calls
import { getAuthHeaders } from '@/utils/getAuthHeaders';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';

// Create Product
export async function createProduct(data: any) {
	const res = await fetch(`${API_BASE}/products`, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});
	return res.json();
}

// Get all Products (optionally by brand)
export async function getProducts() {
	const res = await fetch(`${API_BASE}/products`, { headers: getAuthHeaders() });
	return res.json();
}

// Get Product by ID
export async function getProductById(id: string | undefined) {
	const res = await fetch(`${API_BASE}/products/${id}`, {
		headers: getAuthHeaders(),
	});
	return res.json();
}

// Update Product
export async function updateProduct(id: string | undefined, data: any) {
	const res = await fetch(`${API_BASE}/products/${id}`, {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});
	return res.json();
}

// Delete Product
export async function deleteProduct(id: string | undefined) {
	const res = await fetch(`${API_BASE}/products/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});
	return res.json();
}

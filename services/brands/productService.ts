// src/services/productService.ts
// Service for Product API calls
import { getAuthHeaders } from '@/utils/getAuthHeaders';
import config from '@/config/api';
const endpoint = config.endpoints
// Create Product
export async function createProduct(data: any) {
	const res = await fetch(endpoint.PRODUCT.CREATE, {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});
	return res.json();
}

// Get all Products (optionally by brand)
export async function getProducts() {
	const res = await fetch(endpoint.PRODUCT.LIST, { headers: getAuthHeaders() });
	return res.json();
}

// Get Product by ID
export async function getProductById(id: string | undefined) {
	const res = await fetch(endpoint.PRODUCT.DETAIL(id), {
		headers: getAuthHeaders(),
	});
	return res.json();
}

// Update Product
export async function updateProduct(id: string | undefined, data: any) {
	const res = await fetch(endpoint.PRODUCT.UPDATE(id), {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify(data),
	});
	return res.json();
}

// Delete Product
export async function deleteProduct(id: string | undefined) {
	const res = await fetch(endpoint.PRODUCT.DELETE(id), {
		method: 'DELETE',
		headers: getAuthHeaders(),
	});
	return res.json();
}

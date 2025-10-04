// src/services/productService.ts
// Service for Product API calls
import config from '@/config/api';
const endpoint = config.endpoints
// Create Product
export async function createProduct(data: any) {
	const res = await fetch(endpoint.PRODUCT.CREATE, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return res.json();
}

// Get all Products (optionally by brand)
export async function getProducts() {
	const res = await fetch(endpoint.PRODUCT.LIST);
	return res.json();
}

// Get Product by ID
export async function getProductById(id: string) {
	const res = await fetch(endpoint.PRODUCT.DETAIL(id), {
	});
	return res.json();
}

// Update Product
export async function updateProduct(id: string, data: any) {
	const res = await fetch(endpoint.PRODUCT.UPDATE(id), {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return res.json();
}

// Delete Product
export async function deleteProduct(id: string) {
	const res = await fetch(endpoint.PRODUCT.DELETE(id), {
		method: 'DELETE',
	});
	return res.json();
}

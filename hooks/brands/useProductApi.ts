import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createProduct,
	getProducts,
	getProductById,
	updateProduct,
	deleteProduct,
} from '@/services/brands/productService';

// Fetch all products 
export function useProducts() {
	return useQuery({
		queryKey: ['products'],
		queryFn: () => getProducts(),
	});
}

// Fetch single product by ID
export function useProduct(productId?: string) {
	return useQuery({
		queryKey: ['product', productId],
		queryFn: () => getProductById(productId),
		enabled: !!productId,
	});
}

// Create product
export function useAddProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

// Update product
export function useUpdateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ productId, data }: { productId: string; data: any }) => updateProduct(productId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
			queryClient.invalidateQueries({ queryKey: ['product'] });
		},
	});
}

// Delete product
export function useDeleteProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (productId: string) => deleteProduct(productId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] });
		},
	});
}

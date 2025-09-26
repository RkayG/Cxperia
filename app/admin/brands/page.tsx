
import { supabase } from "@/lib/supabase";

export default async function BrandsPage() {

	const { data: brands, error } = await supabase
		.from('brands')
		.select('*')
		.order('created_at', { ascending: false });

	if (error) {
		return <div className="text-red-600">Failed to load brands: {error.message}</div>;
	}

	return (
		<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-6">Brands</h1>
			<div className="bg-white shadow rounded-lg overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{brands && brands.length > 0 ? (
							brands.map((brand: any) => (
								<tr key={brand.id}>
									<td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{brand.name}</td>
									<td className="px-6 py-4 whitespace-nowrap">{brand.contact_email}</td>
									<td className="px-6 py-4 whitespace-nowrap">{brand.plan_tier}</td>
									<td className="px-6 py-4 whitespace-nowrap capitalize">{brand.status}</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{brand.created_at ? new Date(brand.created_at).toLocaleDateString() : ''}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={5} className="px-6 py-8 text-center text-gray-500">No brands found.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

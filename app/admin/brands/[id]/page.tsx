import JsonViewer from '@/components/JsonViewer';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface BrandPageProps {
	params: { id: string };
}

export default async function BrandPage({ params }: BrandPageProps) {
	
    const { data: brand, error } = await supabase
		.from('brands')
		.select('*')
		.eq('id', params.id)
		.single();

	if (error || !brand) {
		notFound();
	}

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<h1 className="text-3xl font-bold mb-4">{brand.name}</h1>
			<div className="bg-white shadow rounded-lg p-6 space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<div className="text-gray-500 text-xs">Brand ID</div>
						<div className="font-mono text-sm">{brand.id}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Slug</div>
						<div>{brand.brand_slug || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Plan</div>
						<div>{brand.plan_tier}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Status</div>
						<div className="capitalize">{brand.status}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Contact Name</div>
						<div>{brand.contact_name || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Contact Email</div>
						<div>{brand.contact_email || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Contact Phone</div>
						<div>{brand.contact_phone || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Website</div>
						<div>{brand.website_url || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Country</div>
						<div>{brand.country || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">City</div>
						<div>{brand.city || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Zip Code</div>
						<div>{brand.zip_code || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Business Address</div>
						<div>{brand.business_address || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Contract Value (€)</div>
						<div>{brand.contract_value}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Monthly Volume</div>
						<div>{brand.monthly_volume || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Sales Notes</div>
						<div>{brand.sales_notes || '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Created At</div>
						<div>{brand.created_at ? new Date(brand.created_at).toLocaleString() : '-'}</div>
					</div>
					<div>
						<div className="text-gray-500 text-xs">Updated At</div>
						<div>{brand.updated_at ? new Date(brand.updated_at).toLocaleString() : '-'}</div>
					</div>
				</div>
				<div>
					<JsonViewer data={brand.settings || {}} title="Brand Settings" />
				</div>
			</div>
		</div>
	);
}

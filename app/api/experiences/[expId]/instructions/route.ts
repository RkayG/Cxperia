import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createClient } from '@/lib/supabase/server';

// Get all instructions for an experience
export async function GET(req: NextRequest, { params }: { params: Promise<{ expId: string }> }) {
	const { expId } = await params;
	const supabase = await createClient();
	const user = await getCurrentUser();
	const experience_id = expId;
	//console.log('Fetching instructions for experience_id:', experience_id);
	const brand_id = user?.brand_id;
	if (!experience_id) {
		return NextResponse.json({ error: 'Missing experience_id in query' }, { status: 400 });
	}
	if (!brand_id) {
		return NextResponse.json({ error: 'Missing brand_id in user context' }, { status: 403 });
	}
	const { data, error } = await supabase
		.from('digital_instructions')
		.select('*')
		.eq('experience_id', experience_id)
		.eq('brand_id', brand_id);

	//console.log('Instructions fetch result:', { data, error });
	if (error) {
		return NextResponse.json({ error: 'Failed to fetch instructions', details: error.message }, { status: 500 });
	}
	return NextResponse.json({ data });
}

// Create or overwrite instruction for an experience
export async function POST(req: NextRequest, { params }: { params: Promise<{ expId: string }> }) {
	const { expId } = await params;
	const supabase = await createClient();
	const user = await getCurrentUser();
	const experience_id = expId;
	const brand_id = user?.brand_id;
	const body = await req.json() as any;

	// Validate required fields
	const missingFields = [];
	if (!experience_id) missingFields.push('experience_id');
	if (!brand_id) missingFields.push('brand_id');
	if (!body.application_steps) missingFields.push('application_steps');
	if (!body.how_to_use) missingFields.push('how_to_use');
	if (!body.usage_time_type) missingFields.push('usage_time_type');
	if (missingFields.length > 0) {
		return NextResponse.json({ error: 'Missing required fields', missingFields }, { status: 400 });
	}

	// Overwrite any existing instructions for this experience_id
	await supabase
		.from('digital_instructions')
		.delete()
		.eq('experience_id', experience_id);

	// Normalize application_steps, tips, warnings, skin_type to JSON strings
	function normalize(val: any) {
		if (val && typeof val !== 'string') return JSON.stringify(val);
		return val;
	}
	const insertData = {
		experience_id,
		brand_id,
		image_url: body.image_url || null,
		product_name: body.product_name || null,
		product_type: body.product_type || null,
		how_to_use: body.how_to_use,
		application_steps: normalize(body.application_steps),
		tips: normalize(body.tips),
		warnings: normalize(body.warnings),
		frequency: body.frequency || null,
		skin_type: normalize(body.skin_type),
		duration: body.duration || null,
		usage_time_type: body.usage_time_type,
	};

	const { data, error } = await supabase
		.from('digital_instructions')
		.insert([insertData])
		.select()
		.single();
	if (error) {
		//console.log('Error inserting instruction:', error);
		return NextResponse.json({ error: 'Failed to create instruction', details: error.message }, { status: 500 });
	}
	return NextResponse.json({ data });
}

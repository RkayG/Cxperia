export interface Product {
	id: number;
	brand_id: number;
	name: string;
	tagline: string;
	description: string;
	category: string;
	skin_type: string;
	store_link: string;
	product_image_url: string[];
	logo_url: string | null;
	net_content: string | null;
	estimated_usage_duration_days: number;
	created_at: string;
	updated_at: string;
}

export interface DigitalInstruction {
	id: number;
	experience_id: number;
	title: string;
	content: string;
	order: number;
	created_at: string;
	updated_at: string;
}

export interface Ingredient {
	id: number;
	experience_id: number;
	name: string;
	amount: string;
	unit: string;
	created_at: string;
	updated_at: string;
}

export interface ExperienceFeature {
	id: number;
	experience_id: number;
	feature_name: string;
	enabled: boolean;
	settings?: any;
	created_at: string;
	updated_at: string;
}

export interface Tutorial {
	id: number;
	experience_id: number;
	title: string;
	description: string;
	video_url: string;
	featured_image?: string;
	created_at: string;
	updated_at: string;
}

export interface Experience {
	id: number;
	brand_id: number;
	product_id: number;
	is_published: boolean;
	qr_code_url?: string;
	experience_url?: string;
	created_at: string;
	updated_at: string;
	product?: Product;
	digital_instructions?: DigitalInstruction[];
	ingredients?: Ingredient[];
	features?: ExperienceFeature[];
	tutorials?: Tutorial[];
}

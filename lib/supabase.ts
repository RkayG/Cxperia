// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';
import { Brand } from '@/types/brand';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Database = {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          brand_color: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Brand, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Brand>
      }
      products: {
        Row: {
          id: string
          brand_id: string
          name: string
          sku: string | null
          description: string | null
          image_url: string | null
          ingredients: string | null
          usage_instructions: string | null
          created_at: string
          updated_at: string
        }
      }
      experiences: {
        Row: {
          id: string
          brand_id: string | null
          product_id: string | null
          is_published: boolean
          qr_code_url: string | null
          experience_url: string | null
          created_at: string
          updated_at: string
          public_slug: string | null
          primary_color: string
          theme: string
          scan_count: number
        }
      }
      faq_items: {
        Row: {
          id: string
          brand_id: string
          category_id: string | null
          product_id: string | null
          question: string
          answer: string
          priority: number
          is_active: boolean
          search_keywords: string[]
          created_at: string
          updated_at: string
        }
      }
      chatbot_configs: {
        Row: {
          id: string
          brand_id: string
          name: string
          greeting: string
          fallback_message: string
          brand_color: string
          avatar_type: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
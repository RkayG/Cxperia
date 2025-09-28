
// lib/api-service.ts
import { supabase } from './supabase'

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  brand_color: string
  created_at: string
  updated_at: string
}

export interface Product {
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

export interface Experience {
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
  products?: Product
  brands?: Brand
}

export interface FAQItem {
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
  products?: Product
}

export interface ChatbotConfig {
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

export class HybridChatbotService {
 
  // Update chatbot config
  async updateChatbotConfig(id: string, updates: Partial<ChatbotConfig>) {
    const { data, error } = await supabase
      .from('chatbot_configs')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
   // Get FAQ bot with product context
  async getContextualFAQBot(experienceSlug: string) {
    // First, get the experience with product and brand info
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select(`
        *,
        products (*),
        brands (*)
      `)
      .eq('public_slug', experienceSlug)
      .eq('is_published', true)
      .single()

    if (expError || !experience) {
      throw new Error('Experience not found')
    }

    // Get brand-wide FAQ items plus product-specific ones
    const { data: faqItems, error: faqError } = await supabase
      .from('faq_items')
      .select(`
        *,
        products (*)
      `)
      .or(`brand_id.eq.${experience.brand_id},and(product_id.eq.${experience.product_id},brand_id.eq.${experience.brand_id})`)
      .eq('is_active', true)
      .order('priority', { ascending: true })

    if (faqError) {
      throw faqError
    }

    // Get chatbot config
    const { data: chatbotConfig, error: configError } = await supabase
      .from('chatbot_configs')
      .select('*')
      .eq('brand_id', experience.brand_id)
      .eq('is_active', true)
      .single()

    return {
      experience,
      faqItems: faqItems || [],
      chatbotConfig: chatbotConfig || null,
      context: {
        product: experience.products,
        brand: experience.brands
      }
    }
  }

  // Search FAQs with product context
  async searchFAQs(experienceSlug: string, query: string) {
    const { data: experience } = await supabase
      .from('experiences')
      .select('brand_id, product_id')
      .eq('public_slug', experienceSlug)
      .single()

    if (!experience) {
      throw new Error('Experience not found')
    }

    const { data, error } = await supabase
      .from('faq_items')
      .select(`
        *,
        products (*)
      `)
      .or(`brand_id.eq.${experience.brand_id},and(product_id.eq.${experience.product_id},brand_id.eq.${experience.brand_id})`)
      .eq('is_active', true)
      .textSearch('search_keywords', query.split(' ').join(' | '))
      .order('priority', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Record analytics
  async recordInteraction(experienceId: string, productId: string | null, question: string, wasAnswered: boolean) {
    const { error } = await supabase
      .from('chat_analytics')
      .insert({
        experience_id: experienceId,
        product_id: productId,
        question_asked: question,
        was_answered: wasAnswered,
        session_id: crypto.randomUUID()
      })

    if (error) throw error
  }

  // Increment scan count
  async incrementScanCount(experienceSlug: string) {
    const { error } = await supabase
      .rpc('increment_scan_count', { exp_slug: experienceSlug })

    if (error) throw error
  }

  // Admin: Get dashboard data for a brand
  async getBrandDashboard(brandId: string) {
    const [experiences, faqItems, analytics] = await Promise.all([
      supabase.from('experiences').select('*').eq('brand_id', brandId),
      supabase.from('faq_items').select('*').eq('brand_id', brandId),
      supabase
        .from('chat_analytics')
        .select('*')
        .eq('experience_id', brandId) // This would need adjustment based on your analytics structure
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ])

    return {
      experiences: experiences.data || [],
      faqItems: faqItems.data || [],
      analytics: analytics.data || []
    }
  }

  // Admin: Update FAQ items
  async updateFAQItem(id: string, updates: Partial<FAQItem>) {
    const { data, error } = await supabase
      .from('faq_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Admin: Create FAQ item
  async createFAQItem(faq: Omit<FAQItem, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('faq_items')
      .insert(faq)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Admin: Delete FAQ item
  async deleteFAQItem(id: string) {
    const { error } = await supabase
      .from('faq_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

export const chatbotService = new HybridChatbotService()
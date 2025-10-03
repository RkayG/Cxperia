import { supabase } from '@/lib/supabase';

export interface PlatformFeedback {
  id?: string;
  user_id?: string;
  brand_id?: string;
  type: 'bug_report' | 'feature_request' | 'general_feedback' | 'support';
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  user_email?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
  admin_notes?: string;
}

export async function createPlatformFeedback(feedbackData: Omit<PlatformFeedback, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>) {
  const { data, error } = await supabase
    .from('platform_feedback')
    .insert([feedbackData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create platform feedback: ${error.message}`);
  }

  return data;
}

export async function getPlatformFeedback(feedbackId: string) {
  const { data, error } = await supabase
    .from('platform_feedback')
    .select('*')
    .eq('id', feedbackId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch platform feedback: ${error.message}`);
  }

  return data;
}

export async function updatePlatformFeedback(feedbackId: string, updates: Partial<PlatformFeedback>) {
  const { data, error } = await supabase
    .from('platform_feedback')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', feedbackId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update platform feedback: ${error.message}`);
  }

  return data;
}

export async function getPlatformFeedbackByUser(userId: string) {
  const { data, error } = await supabase
    .from('platform_feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user platform feedback: ${error.message}`);
  }

  return data;
}

export async function getAllPlatformFeedback(limit = 50, offset = 0) {
  const { data, error } = await supabase
    .from('platform_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch platform feedback: ${error.message}`);
  }

  return data;
}

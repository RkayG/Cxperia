import { Experience, Product} from '@/lib/db/experiences';
import  config  from '@/config/api';
const { endpoints } = config;
const {} = config;
export interface CreateExperienceData {
  product_id?: string;
  product?: Product;
  experience_id?: string;
}
//console.log('[experienceService] loaded');
export const experienceService = {
  async getAll(brandId?: string) {
    const url = brandId ? `/api/experiences?brand_id=${brandId}` : '/api/experiences';
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch experiences');
    }
    
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(endpoints.EXPERIENCE.DETAIL(id));
    const res = await response.json();
    console.log('Experience data:', res);
    if (!response.ok) {
      throw new Error('Failed to fetch experience');
    }
    
    return res;
  },

  async create(data: CreateExperienceData) {
    const response = await fetch(endpoints.EXPERIENCE.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create experience');
    }
    
    return response.json();
  },

  async update(id: string, updates: Partial<Experience>) {
    const response = await fetch(endpoints.EXPERIENCE.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update experience');
    }
    
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(endpoints.EXPERIENCE.DELETE(id), {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete experience');
    }
    
    return response.json();
  },

  async setPublishStatus(id: string, isPublished: boolean) {
    const response = await fetch(endpoints.EXPERIENCE.PUBLISH(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_published: isPublished }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update publish status');
    }
    
    return response.json();
  },

  async setThemeAndColor(id: string, theme?: string, primary_color?: string) {
    const response = await fetch(endpoints.EXPERIENCE.THEME(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme, primary_color }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update theme');
    }
    
    return response.json();
  },

  async getExperienceUrl(id: string) {
    const response = await fetch(endpoints.EXPERIENCE.URL(id));
    
    if (!response.ok) {
      throw new Error('Failed to get experience URL');
    }
    
    return response.json();
  },

  async getRecent() {
    const response = await fetch(endpoints.EXPERIENCE.RECENTS);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent experiences');
    }
    
    return response.json();
  },
};
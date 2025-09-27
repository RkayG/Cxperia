console.log('[api config] loaded');
const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/api';
const config = {
  // Base API URL - will be different for development, staging, and production
  API_BASE_URL: API_BASE,

  
  // API endpoints relevant to Cxperia
  endpoints: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      PROFILE: '/auth/profile',
    },

    EXPERIENCE: {
      RECENTS: '/api/experiences/recents',
      LIST: '/api/experiences',
      CREATE: '/api/experiences/',
      DETAIL: (id: string) => `/api/experiences/${id}`,
      UPDATE: (id: string) => `/api/experiences/${id}`,
      DELETE: (id: string) => `/api/experiences/${id}`,
      PUBLISH: (id: string) => `/api/experiences/${id}/publish`,
      THEME: (id: string) => `/api/experiences/${id}/theme`,
      URL: (id: string) => `/api/experiences/${id}/url`,
      // QR: (id: string) => `/api/experiences/${id}/qr`, // if needed in future
    },

    PRODUCT: {
      LIST: '/products',
      DETAIL: (id: string | number) => `/products/${id}`,
      CREATE: '/products',
      UPDATE: (id: string | number) => `/products/${id}`,
    },

    TUTORIAL: {
      LIST: '/tutorials',
      DETAIL: (id: string | number) => `/tutorials/${id}`,
      CREATE: '/tutorials',
      UPDATE: (id: string | number) => `/tutorials/${id}`,
      LINK_TO_EXPERIENCE: (experienceId: string | number) => `/experiences/${experienceId}/tutorials`,
    },

    INGREDIENT: {
      LIST: (experienceId: string | number) => `/experiences/${experienceId}/ingredients`,
      ADD: (experienceId: string | number) => `/experiences/${experienceId}/ingredients`,
    },

    FEATURE: {
      LIST: (experienceId: string | number) => `/experiences/${experienceId}/features`,
      UPDATE: (experienceId: string | number) => `/experiences/${experienceId}/features`,
    },

    UPLOAD: {
      IMAGE: '/upload/image',
      VIDEO: '/upload/video',
    },
  },
  
  // Request timeout
  TIMEOUT: 10000,
  
  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
};

export default config;

export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`;
};

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};
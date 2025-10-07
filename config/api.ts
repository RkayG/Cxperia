import { BRAND } from "zod"

console.log("[api config] loaded")
const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/api"
const config = {
  // Base API URL - will be different for development, staging, and production
  API_BASE_URL: API_BASE,

    // API endpoints relevant to Cxperia
  
  endpoints: {
    // Auth API endpoints
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      PROFILE: "/auth/profile",
    },

    // Invalidat Cache API endpoints
    INVALIDATE_CACHE: {
      EXPERIENCE: (slug: string) => `/api/public/experience/${slug}/purge/experience`,
      TUTORIAL: (slug: string) => `/api/public/experience/${slug}/purge/tutorials`,
      PRODUCT: (slug: string) => `/api/public/experience/${slug}/purge/products`,
    },

    // Experience API endpoints
    EXPERIENCE: {
      RECENTS: "/api/experiences/recents",
      LIST: "/api/experiences",
      CREATE: "/api/experiences/",
      DETAIL: (id: string) => `/api/experiences/${id}`,
      UPDATE: (id: string) => `/api/experiences/${id}`,
      DELETE: (id: string) => `/api/experiences/${id}`,
      PUBLISH: (id: string) => `/api/experiences/${id}/publish`,
      THEME: (id: string) => `/api/experiences/${id}/theme`,
      URL: (id: string) => `/api/experiences/${id}/url`,
      QR: (id: string) => `/api/experiences/${id}/qr`,
      // QR: (id: string) => `/api/experiences/${id}/qr`, // if needed in future
    },

    // Product API endpoints
    PRODUCT: {
      LIST: "/api/products",
      DETAIL: (id: string) => `/api/products/${id}`,
      CREATE: "/api/products",
      UPDATE: (id: string) => `/api/products/${id}`,
      DELETE: (id: string) => `/api/products/${id}`,
    },

    // Tutorial API endpoints
    TUTORIAL: {
      LIST: (type: 'all' | 'recents' = 'all') => `/api/tutorials?type=${type}`,
      DETAIL: (id: string) => `/api/tutorials/${id}`,
      CREATE: "/api/tutorials",
      UPDATE: (id: string) => `/api/tutorials/${id}`,
      DELETE: (id: string) => `/api/tutorials/${id}`,
      LINK: (experienceId: string) => `/api/experiences/${experienceId}/tutorials/link`,
    },

    // Ingredient API endpoints
    INGREDIENT: {
      LIST: (experienceId: string) => `/api/experiences/${experienceId}/ingredients`,
      ADD: (experienceId: string) => `/api/experiences/${experienceId}/ingredients`,
      UPDATE: (experienceId: string, ingredientId: string) =>
        `/api/experiences/${experienceId}/ingredients/${ingredientId}`,
      DELETE: (experienceId: string, ingredientId: string) =>
        `/api/experiences/${experienceId}/ingredients/${ingredientId}`,
    },

    // Instruction API endpoints
    INSTRUCTION: {
      LIST: (experienceId: string) => `/api/experiences/${experienceId}/instructions`,
      ADD: (experienceId: string) => `/api/experiences/${experienceId}/instructions`,
      UPDATE: (experienceId: string, instructionId: string) =>
        `/api/experiences/${experienceId}/instructions/${instructionId}`,
      DELETE: (experienceId: string, instructionId: string) =>
        `/api/experiences/${experienceId}/instructions/${instructionId}`,
    },

    // Feature API endpoints
    FEATURE: {
      LIST: (experienceId: string) => `/api/experiences/${experienceId}/features`,
      ENABLE: (experienceId: string) => `/api/experiences/${experienceId}/features`,
      DISABLE: (experienceId: string, featureId: string) => `/api/experiences/${experienceId}/features/${featureId}`,
    },

    // Feedback API endpoints
    FEEDBACK: {
      CREATE: "/api/feedbacks",
    },

    // Brand API endpoints
    BRAND: {
      LOGO: "/api/brands/logo",
      SUPPORT_LINKS: "/api/brands/support-links",
    },

    // Upload API endpoints
    UPLOAD: {
      IMAGE: "/upload/image",
      VIDEO: "/upload/video",
    },

    // Public API endpoints
    PUBLIC: {
      EXPERIENCE: {
        DATA: (slug: string) => `/public/experience/${slug}`,
      },

      PRODUCT: {
        LIST: (slug: string) => `/public/experience/${slug}/products`,
      },

      TUTORIAL: {
        LIST: (slug: string) => `/public/experience/${slug}/tutorials`,
        DETAIL: (id: string) => `/public/tutorials/${id}`,
      },

      FEEDBACK: {
        CREATE: (slug: string) => `/api/public/experience/${slug}/feedback`,
      },

      UPLOAD: {
        IMAGE: "/api/public/upload",
      },
    },
  },

  // Request timeout
  TIMEOUT: 10000,

  // File upload limits
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
}

export default config

export const getApiUrl = (endpoint: string): string => {
  return `${config.API_BASE_URL}${endpoint}`
}

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item:any) => searchParams.append(key, item))
      } else {
        searchParams.append(key, value.toString())
      }
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

/**
 * Non-Public API Security Tests
 * Tests for sanitization of sensitive data in authenticated API endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createApiSecurityTestSuite,
  createMockRequest,
  testApiSecurity,
  testAuthentication,
  mockExperienceData,
  mockTutorialData,
  mockFeedbackData,
  mockBrandData,
  SENSITIVE_FIELDS
} from '../utils/security-test-utils';

// Mock the API handlers
const mockExperiencesHandler = vi.fn();
const mockExperienceHandler = vi.fn();
const mockTutorialsHandler = vi.fn();
const mockTutorialHandler = vi.fn();
const mockFeedbacksHandler = vi.fn();
const mockBrandProfileHandler = vi.fn();

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  auth: {
    getUser: vi.fn()
  }
};

// Mock Redis client
const mockRedisClient = {
  get: vi.fn(),
  setex: vi.fn(),
  del: vi.fn()
};

// Mock Next.js modules
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient
}));

vi.mock('@/lib/redis', () => ({
  redis: mockRedisClient
}));

vi.mock('@/lib/auth/getCurrentUser', () => ({
  getCurrentUser: vi.fn()
}));

vi.mock('next/server', () => ({
  NextRequest: vi.fn(),
  NextResponse: {
    json: vi.fn((data, init) => ({
      json: vi.fn().mockReturnValue(data),
      status: init?.status || 200,
      headers: new Map()
    }))
  }
}));

describe('Non-Public API Security Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // Default mock for authenticated user
    const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 'user-123',
      brand_id: 'brand-123',
      email: 'test@example.com'
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('/api/experiences Security', () => {
    it('should remove brand_id from experiences list response', async () => {
      const mockExperiences = [
        {
          id: 'exp-1',
          brand_id: 'brand-123',
          product_id: 'prod-1',
          is_published: true,
          created_at: '2024-01-01T00:00:00Z',
          products: {
            id: 'prod-1',
            brand_id: 'brand-123',
            name: 'Product 1'
          }
        },
        {
          id: 'exp-2',
          brand_id: 'brand-123',
          product_id: 'prod-2',
          is_published: false,
          created_at: '2024-01-01T00:00:00Z',
          products: {
            id: 'prod-2',
            brand_id: 'brand-123',
            name: 'Product 2'
          }
        }
      ];

      // Mock Redis cache miss
      mockRedisClient.get.mockResolvedValue(null);
      
      // Mock database query
      mockSupabaseClient.eq.mockResolvedValue({
        data: mockExperiences,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences?brand_id=brand-123',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/route');
      const result = await testApiSecurity(GET, mockRequest);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify experiences don't have brand_id
      if (result.responseData?.data) {
        result.responseData.data.forEach((experience: any) => {
          expect(experience.brand_id).toBeUndefined();
          if (experience.products) {
            expect(experience.products.brand_id).toBeUndefined();
          }
        });
      }
    });

    it('should require authentication', async () => {
      const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/route');
      const response = await GET(mockRequest);
      
      expect(response.status).toBe(401);
    });

    it('should cache sanitized data', async () => {
      const mockExperiences = [
        { id: 'exp-1', brand_id: 'brand-123', name: 'Experience 1' }
      ];

      // Mock Redis cache miss
      mockRedisClient.get.mockResolvedValue(null);
      
      // Mock database query
      mockSupabaseClient.eq.mockResolvedValue({
        data: mockExperiences,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences?brand_id=brand-123',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/route');
      await GET(mockRequest);
      
      // Verify that sanitized data was cached
      expect(mockRedisClient.setex).toHaveBeenCalled();
      const cachedData = mockRedisClient.setex.mock.calls[0][1];
      const parsedCache = JSON.parse(cachedData);
      
      // Verify cached data doesn't contain brand_id
      parsedCache.forEach((item: any) => {
        expect(item.brand_id).toBeUndefined();
      });
    });
  });

  describe('/api/experiences/[expId] Security', () => {
    it('should remove brand_id from single experience response', async () => {
      const mockExperience = {
        ...mockExperienceData,
        products: {
          id: 'prod-123',
          brand_id: 'brand-123',
          name: 'Test Product'
        },
        experience_features: [
          {
            id: 'feat-1',
            experience_id: 'exp-123',
            feature_name: 'tutorials',
            is_enabled: true
          }
        ]
      };

      // Mock experience query
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: mockExperience,
        error: null
      });

      // Mock features query
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: mockExperience.experience_features,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences/exp-123',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/[expId]/route');
      const result = await testApiSecurity(GET, mockRequest);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify experience doesn't have brand_id
      if (result.responseData?.data) {
        expect(result.responseData.data.brand_id).toBeUndefined();
        if (result.responseData.data.product) {
          expect(result.responseData.data.product.brand_id).toBeUndefined();
        }
      }
    });
  });

  describe('/api/tutorials Security', () => {
    it('should remove brand_id from tutorials list response', async () => {
      const mockTutorials = [
        {
          id: 'tut-1',
          brand_id: 'brand-123',
          title: 'Tutorial 1',
          is_published: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'tut-2',
          brand_id: 'brand-123',
          title: 'Tutorial 2',
          is_published: false,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock Redis cache miss
      mockRedisClient.get.mockResolvedValue(null);
      
      // Mock database query
      mockSupabaseClient.eq.mockResolvedValue({
        data: mockTutorials,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/tutorials?brand_id=brand-123',
        'GET'
      );

      const { GET } = await import('@/app/api/tutorials/route');
      const result = await testApiSecurity(GET, mockRequest);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify tutorials don't have brand_id
      if (result.responseData?.data) {
        result.responseData.data.forEach((tutorial: any) => {
          expect(tutorial.brand_id).toBeUndefined();
        });
      }
    });
  });

  describe('/api/tutorials/[id] Security', () => {
    it('should remove brand_id from single tutorial response', async () => {
      const mockTutorial = {
        ...mockTutorialData,
        steps: JSON.stringify([
          { id: 'step-1', title: 'Step 1', description: 'First step' }
        ])
      };

      mockSupabaseClient.single.mockResolvedValue({
        data: mockTutorial,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/tutorials/tut-123',
        'GET'
      );

      const { GET } = await import('@/app/api/tutorials/[id]/route');
      const result = await testApiSecurity(GET, mockRequest);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify tutorial doesn't have brand_id
      if (result.responseData?.data) {
        expect(result.responseData.data.brand_id).toBeUndefined();
      }
    });
  });

  describe('/api/feedbacks Security', () => {
    it('should remove brand_id from feedbacks list response', async () => {
      const mockFeedbacks = [
        {
          id: 'fb-1',
          brand_id: 'brand-123',
          experience_id: 'exp-123',
          customer_name: 'John Doe',
          overall_rating: 5,
          created_at: '2024-01-01T00:00:00Z',
          experiences: {
            id: 'exp-123',
            brand_id: 'brand-123',
            products: {
              name: 'Test Product',
              category: 'skincare'
            }
          }
        }
      ];

      mockSupabaseClient.order.mockResolvedValue({
        data: mockFeedbacks,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/feedbacks',
        'GET'
      );

      const { GET } = await import('@/app/api/feedbacks/route');
      const result = await testApiSecurity(GET, mockRequest);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify feedbacks don't have brand_id
      if (result.responseData?.data) {
        result.responseData.data.forEach((feedback: any) => {
          expect(feedback.brand_id).toBeUndefined();
          if (feedback.experiences) {
            expect(feedback.experiences.brand_id).toBeUndefined();
          }
        });
      }
    });
  });

  describe('/api/profile/brand Security', () => {
    it('should remove sensitive fields but keep brand_id for frontend use', async () => {
      const mockBrand = {
        ...mockBrandData,
        custom_domain: 'example.com',
        monthly_volume: '1000+'
      };

      // Mock Redis cache miss
      mockRedisClient.get.mockResolvedValue(null);
      
      // Mock database query
      mockSupabaseClient.single.mockResolvedValue({
        data: mockBrand,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/profile/brand',
        'GET'
      );

      const { GET } = await import('@/app/api/profile/brand/route');
      const result = await testApiSecurity(GET, mockRequest, ['user_id', 'created_by', 'updated_by']);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify brand_id is kept but other sensitive fields are removed
      if (result.responseData?.data) {
        expect(result.responseData.data.brand_id).toBeDefined();
        expect(result.responseData.data.user_id).toBeUndefined();
        expect(result.responseData.data.created_by).toBeUndefined();
        expect(result.responseData.data.updated_by).toBeUndefined();
      }
    });
  });

  describe('Authentication Tests', () => {
    it('should require authentication for all non-public endpoints', async () => {
      const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
      vi.mocked(getCurrentUser).mockResolvedValue(null);

      const endpoints = [
        { name: 'experiences', handler: () => import('@/app/api/experiences/route') },
        { name: 'tutorials', handler: () => import('@/app/api/tutorials/route') },
        { name: 'feedbacks', handler: () => import('@/app/api/feedbacks/route') },
        { name: 'brand profile', handler: () => import('@/app/api/profile/brand/route') }
      ];

      for (const endpoint of endpoints) {
        const { GET } = await endpoint.handler();
        const mockRequest = createMockRequest(
          `http://localhost:3000/api/${endpoint.name}`,
          'GET'
        );

        const response = await GET(mockRequest);
        expect(response.status).toBe(401);
      }
    });
  });

  describe('Cache Security Tests', () => {
    it('should not cache sensitive data in Redis', async () => {
      const mockExperiences = [
        { id: 'exp-1', brand_id: 'brand-123', name: 'Experience 1' }
      ];

      // Mock Redis cache miss
      mockRedisClient.get.mockResolvedValue(null);
      
      // Mock database query
      mockSupabaseClient.eq.mockResolvedValue({
        data: mockExperiences,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences?brand_id=brand-123',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/route');
      await GET(mockRequest);
      
      // Verify that only sanitized data was cached
      expect(mockRedisClient.setex).toHaveBeenCalled();
      const cachedData = mockRedisClient.setex.mock.calls[0][1];
      const parsedCache = JSON.parse(cachedData);
      
      // Verify cached data doesn't contain brand_id
      parsedCache.forEach((item: any) => {
        expect(item.brand_id).toBeUndefined();
      });
    });

    it('should serve sanitized data from cache', async () => {
      const sanitizedData = [
        { id: 'exp-1', name: 'Experience 1' } // No brand_id
      ];

      // Mock Redis cache hit
      mockRedisClient.get.mockResolvedValue(JSON.stringify(sanitizedData));

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences?brand_id=brand-123',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/route');
      const result = await testApiSecurity(GET, mockRequest);
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify cache was used
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });
  });
});

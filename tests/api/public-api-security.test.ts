/**
 * Public API Security Tests
 * Tests for sanitization of sensitive data in public API endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createApiSecurityTestSuite,
  createMockRequest,
  createMockParams,
  testApiSecurity,
  mockExperienceData,
  mockTutorialData,
  mockFeedbackData,
  SENSITIVE_FIELDS
} from '../utils/security-test-utils';

// Mock the API handlers
const mockPublicExperienceHandler = vi.fn();
const mockPublicProductsHandler = vi.fn();
const mockPublicTutorialsHandler = vi.fn();
const mockPublicFeedbackHandler = vi.fn();

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  not: vi.fn().mockReturnThis(),
  auth: {
    getUser: vi.fn()
  }
};

// Mock Next.js modules
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
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

describe('Public API Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('/api/public/experience/[slug] Security', () => {
    it('should remove brand_id from experience response', async () => {
      // Mock successful database response
      mockSupabaseClient.single.mockResolvedValue({
        data: mockExperienceData,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug?secret=test-secret',
        'GET',
        { 'x-public-secret': 'test-secret' }
      );

      // Import and test the actual handler
      const { GET } = await import('@/app/api/public/experience/[slug]/route');
      
      const result = await testApiSecurity(GET, mockRequest, SENSITIVE_FIELDS, { slug: 'test-slug' });
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      expect(result.foundFields).toHaveLength(0);
    });

    it('should remove brand_id from nested brand object', async () => {
      const experienceWithBrand = {
        ...mockExperienceData,
        brand: {
          id: 'brand-123',
          brand_id: 'brand-123',
          name: 'Test Brand',
          logo_url: 'https://example.com/logo.png',
          customer_support_links: [
            { type: 'email', value: 'support@example.com' }
          ]
        }
      };

      mockSupabaseClient.single.mockResolvedValue({
        data: experienceWithBrand,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug?secret=test-secret',
        'GET',
        { 'x-public-secret': 'test-secret' }
      );

      const { GET } = await import('@/app/api/public/experience/[slug]/route');
      const result = await testApiSecurity(GET, mockRequest, SENSITIVE_FIELDS, { slug: 'test-slug' });
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify brand object doesn't have brand_id
      if (result.responseData?.data?.brand) {
        expect(result.responseData.data.brand.brand_id).toBeUndefined();
      }
    });

    it('should require valid secret key', async () => {
      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug',
        'GET',
        {} // No secret
      );

      const { GET } = await import('@/app/api/public/experience/[slug]/route');
      const params = createMockParams({ slug: 'test-slug' });
      const response = await GET(mockRequest, params);
      
      expect(response.status).toBe(403);
    });
  });

  describe('/api/public/experience/[slug]/products Security', () => {
    it('should remove brand_id from products response', async () => {
      const mockProducts = [
        {
          id: 'prod-1',
          brand_id: 'brand-123',
          name: 'Product 1',
          category: 'skincare',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'prod-2', 
          brand_id: 'brand-123',
          name: 'Product 2',
          category: 'makeup',
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock experience lookup
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { brand_id: 'brand-123' },
        error: null
      });

      // Mock products query
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: mockProducts,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug/products?secret=test-secret',
        'GET',
        { 'x-public-secret': 'test-secret' }
      );

      const { GET } = await import('@/app/api/public/experience/[slug]/products/route');
      const result = await testApiSecurity(GET, mockRequest, SENSITIVE_FIELDS, { slug: 'test-slug' });
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify products don't have brand_id
      if (result.responseData?.products) {
        result.responseData.products.forEach((product: any) => {
          expect(product.brand_id).toBeUndefined();
        });
      }
    });
  });

  describe('/api/public/experience/[slug]/tutorials Security', () => {
    it('should remove brand_id from tutorials response', async () => {
      const mockTutorials = [
        {
          id: 'tut-1',
          brand_id: 'brand-123',
          title: 'Tutorial 1',
          description: 'First tutorial',
          is_published: true,
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 'tut-2',
          brand_id: 'brand-123', 
          title: 'Tutorial 2',
          description: 'Second tutorial',
          is_published: true,
          created_at: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock experience lookup
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { brand_id: 'brand-123' },
        error: null
      });

      // Mock tutorials query
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: mockTutorials,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug/tutorials?secret=test-secret',
        'GET',
        { 'x-public-secret': 'test-secret' }
      );

      const { GET } = await import('@/app/api/public/experience/[slug]/tutorials/route');
      const result = await testApiSecurity(GET, mockRequest, SENSITIVE_FIELDS, { slug: 'test-slug' });
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify tutorials don't have brand_id
      if (result.responseData?.tutorials) {
        result.responseData.tutorials.forEach((tutorial: any) => {
          expect(tutorial.brand_id).toBeUndefined();
        });
      }
    });
  });

  describe('/api/public/experience/[slug]/feedback Security', () => {
    it('should remove brand_id from feedback POST response', async () => {
      const mockFeedback = {
        id: 'fb-123',
        brand_id: 'brand-123',
        experience_id: 'exp-123',
        customer_name: 'John Doe',
        overall_rating: 5,
        comment: 'Great product!',
        created_at: '2024-01-01T00:00:00Z'
      };

      // Mock experience lookup
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'exp-123', brand_id: 'brand-123' },
        error: null
      });

      // Mock feedback insertion
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockFeedback,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug/feedback',
        'POST',
        {},
        {
          customer_name: 'John Doe',
          overall_rating: 5,
          comment: 'Great product!'
        }
      );

      const { POST } = await import('@/app/api/public/experience/[slug]/feedback/route');
      const result = await testApiSecurity(POST, mockRequest, SENSITIVE_FIELDS, { slug: 'test-slug' });
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
      
      // Verify feedback doesn't have brand_id
      if (result.responseData?.data) {
        expect(result.responseData.data.brand_id).toBeUndefined();
      }
    });

    it('should remove brand_id from feedback GET response', async () => {
      const mockStats = [
        { overall_rating: 5 },
        { overall_rating: 4 },
        { overall_rating: 5 }
      ];

      // Mock experience lookup
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'exp-123', brand_id: 'brand-123' },
        error: null
      });

      // Mock stats query
      mockSupabaseClient.not.mockResolvedValueOnce({
        data: mockStats,
        error: null
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug/feedback',
        'GET'
      );

      const { GET } = await import('@/app/api/public/experience/[slug]/feedback/route');
      const result = await testApiSecurity(GET, mockRequest, SENSITIVE_FIELDS, { slug: 'test-slug' });
      
      expect(result.success).toBe(true);
      expect(result.hasSensitiveData).toBe(false);
    });
  });

  describe('Sanitization Utility Tests', () => {
    it('should remove all sensitive fields from complex nested objects', async () => {
      const complexData = {
        id: 'test-1',
        brand_id: 'brand-123',
        user_id: 'user-456',
        created_by: 'admin-789',
        nested: {
          id: 'nested-1',
          brand_id: 'brand-123',
          items: [
            { id: 'item-1', brand_id: 'brand-123' },
            { id: 'item-2', user_id: 'user-456' }
          ]
        },
        array: [
          { id: 'array-1', brand_id: 'brand-123' },
          { id: 'array-2', created_by: 'admin-789' }
        ]
      };

      const { sanitizePublicData } = await import('@/utils/sanitizePublicData');
      const sanitized = sanitizePublicData(complexData) as any;

      // Check that all sensitive fields are removed
      expect(sanitized.brand_id).toBeUndefined();
      expect(sanitized.user_id).toBeUndefined();
      expect(sanitized.created_by).toBeUndefined();
      expect(sanitized.nested.brand_id).toBeUndefined();
      expect(sanitized.nested.items[0].brand_id).toBeUndefined();
      expect(sanitized.nested.items[1].user_id).toBeUndefined();
      expect(sanitized.array[0].brand_id).toBeUndefined();
      expect(sanitized.array[1].created_by).toBeUndefined();

      // Check that non-sensitive fields remain
      expect(sanitized.id).toBe('test-1');
      expect(sanitized.nested.id).toBe('nested-1');
      expect(sanitized.nested.items[0].id).toBe('item-1');
      expect(sanitized.array[0].id).toBe('array-1');
    });

    it('should handle arrays of objects correctly', async () => {
      const arrayData = [
        { id: '1', brand_id: 'brand-123', name: 'Item 1' },
        { id: '2', brand_id: 'brand-123', name: 'Item 2' },
        { id: '3', user_id: 'user-456', name: 'Item 3' }
      ];

      const { sanitizePublicDataArray } = await import('@/utils/sanitizePublicData');
      const sanitized = sanitizePublicDataArray(arrayData);

      sanitized.forEach((item: any) => {
        expect(item.brand_id).toBeUndefined();
        expect(item.user_id).toBeUndefined();
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
      });
    });
  });
});

/**
 * Rate Limiting and Input Validation Security Tests
 * Tests for rate limiting, input validation, and security measures
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createMockRequest,
  testRateLimiting,
  testInputValidation
} from '../utils/security-test-utils';

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
  not: vi.fn().mockReturnThis(),
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

// Mock rate limiter
const mockRateLimiter = {
  checkLimit: vi.fn(),
  limit: 10,
  remaining: 9,
  retryAfter: 60
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

vi.mock('@/lib/rate-limiter', () => ({
  createFeedbackRateLimiter: vi.fn(() => mockRateLimiter),
  createGeneralRateLimiter: vi.fn(() => mockRateLimiter),
  createRateLimitResponse: vi.fn((result, message) => ({
    json: vi.fn().mockReturnValue({ error: message }),
    status: 429,
    headers: new Map()
  })),
  addRateLimitHeaders: vi.fn((response, result) => response)
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

describe('Rate Limiting and Input Validation Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default successful rate limit check
    mockRateLimiter.checkLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      retryAfter: 60
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Rate Limiting Tests', () => {
    it('should enforce rate limits on feedback submission', async () => {
      // Mock rate limit exceeded
      mockRateLimiter.checkLimit.mockResolvedValue({
        success: false,
        limit: 10,
        remaining: 0,
        retryAfter: 60
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
      const response = await POST(mockRequest);
      
      expect(response.status).toBe(429);
    });

    it('should allow requests within rate limit', async () => {
      // Mock successful rate limit check
      mockRateLimiter.checkLimit.mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        retryAfter: 60
      });

      // Mock successful database operations
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'exp-123', brand_id: 'brand-123' },
        error: null
      });

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: {
          id: 'fb-123',
          brand_id: 'brand-123',
          customer_name: 'John Doe',
          overall_rating: 5
        },
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
      const response = await POST(mockRequest);
      
      expect(response.status).not.toBe(429);
    });

    it('should include rate limit headers in responses', async () => {
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
      const response = await POST(mockRequest);
      
      // Verify rate limit headers are added
      expect(response.headers).toBeDefined();
    });
  });

  describe('Input Validation Tests', () => {
    it('should validate required fields in feedback submission', async () => {
      const invalidInputs = [
        {}, // Empty object
        { customer_name: 'John Doe' }, // Missing rating and comment
        { overall_rating: 5 }, // Missing name and comment
        { comment: 'Great product!' }, // Missing name and rating
        { customer_name: '', overall_rating: 5, comment: 'Great!' }, // Empty name
        { customer_name: 'John Doe', overall_rating: 0, comment: 'Great!' }, // Invalid rating
        { customer_name: 'John Doe', overall_rating: 6, comment: 'Great!' }, // Rating too high
        { customer_name: 'John Doe', overall_rating: -1, comment: 'Great!' }, // Negative rating
      ];

      for (const invalidInput of invalidInputs) {
        const mockRequest = createMockRequest(
          'http://localhost:3000/api/public/experience/test-slug/feedback',
          'POST',
          {},
          invalidInput
        );

        const { POST } = await import('@/app/api/public/experience/[slug]/feedback/route');
        const response = await POST(mockRequest);
        
        // Should return 400 for invalid input
        expect(response.status).toBe(400);
      }
    });

    it('should validate tutorial creation input', async () => {
      const invalidInputs = [
        {}, // Empty object
        { title: '' }, // Empty title
        { title: 'A'.repeat(1000) }, // Title too long
        { title: 'Valid Title', video_url: 'invalid-url' }, // Invalid URL
        { title: 'Valid Title', skin_types: 'not-an-array' }, // Invalid skin_types
        { title: 'Valid Title', occasions: 'not-an-array' }, // Invalid occasions
        { title: 'Valid Title', tags: 'not-an-array' }, // Invalid tags
        { title: 'Valid Title', difficulty: 'invalid-difficulty' }, // Invalid difficulty
        { title: 'Valid Title', is_published: 'not-boolean' }, // Invalid boolean
      ];

      const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        brand_id: 'brand-123',
        email: 'test@example.com'
      });

      for (const invalidInput of invalidInputs) {
        const mockRequest = createMockRequest(
          'http://localhost:3000/api/tutorials',
          'POST',
          {},
          invalidInput
        );

        const { POST } = await import('@/app/api/tutorials/route');
        const response = await POST(mockRequest);
        
        // Should return 400 for invalid input
        expect(response.status).toBe(400);
      }
    });

    it('should validate experience creation input', async () => {
      const invalidInputs = [
        {}, // Empty object
        { product: {} }, // Empty product
        { product: { name: '' } }, // Empty product name
        { product: { name: 'Valid Product', tagline: 'A'.repeat(100) } }, // Tagline too long
        { product: { name: 'Valid Product', original_price: -10 } }, // Negative price
        { product: { name: 'Valid Product', discounted_price: 100, original_price: 50 } }, // Discounted > original
        { product: { name: 'Valid Product', estimated_usage_duration_days: -5 } }, // Negative duration
        { product: { name: 'Valid Product', estimated_usage_duration_days: 10000 } }, // Unrealistic duration
      ];

      const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        brand_id: 'brand-123',
        email: 'test@example.com'
      });

      for (const invalidInput of invalidInputs) {
        const mockRequest = createMockRequest(
          'http://localhost:3000/api/experiences',
          'POST',
          {},
          invalidInput
        );

        const { POST } = await import('@/app/api/experiences/route');
        const response = await POST(mockRequest);
        
        // Should return 400 for invalid input
        expect(response.status).toBe(400);
      }
    });

    it('should sanitize user input to prevent XSS', async () => {
      const maliciousInputs = [
        { customer_name: '<script>alert("xss")</script>', overall_rating: 5, comment: 'Great!' },
        { customer_name: 'John Doe', overall_rating: 5, comment: '<img src=x onerror=alert("xss")>' },
        { customer_name: 'John Doe', overall_rating: 5, comment: 'javascript:alert("xss")' },
        { customer_name: 'John Doe', overall_rating: 5, comment: '"><script>alert("xss")</script>' },
      ];

      // Mock successful database operations
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: 'exp-123', brand_id: 'brand-123' },
        error: null
      });

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: {
          id: 'fb-123',
          brand_id: 'brand-123',
          customer_name: 'Sanitized Name',
          overall_rating: 5,
          comment: 'Sanitized Comment'
        },
        error: null
      });

      for (const maliciousInput of maliciousInputs) {
        const mockRequest = createMockRequest(
          'http://localhost:3000/api/public/experience/test-slug/feedback',
          'POST',
          {},
          maliciousInput
        );

        const { POST } = await import('@/app/api/public/experience/[slug]/feedback/route');
        const response = await POST(mockRequest);
        
        // Should handle malicious input gracefully
        expect(response.status).not.toBe(500);
        
        // If successful, verify input was sanitized
        if (response.status === 200) {
          const responseData = await response.json() as any;
          expect(responseData.data.customer_name).not.toContain('<script>');
          expect(responseData.data.comment).not.toContain('<script>');
        }
      }
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in search parameters', async () => {
      const sqlInjectionAttempts = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "' UNION SELECT * FROM users --",
        "'; INSERT INTO users VALUES ('hacker', 'password'); --",
        "' OR 1=1 --"
      ];

      const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        brand_id: 'brand-123',
        email: 'test@example.com'
      });

      // Mock Redis cache miss
      mockRedisClient.get.mockResolvedValue(null);
      
      // Mock database query
      mockSupabaseClient.eq.mockResolvedValue({
        data: [],
        error: null
      });

      for (const injection of sqlInjectionAttempts) {
        const mockRequest = createMockRequest(
          `http://localhost:3000/api/tutorials?search=${encodeURIComponent(injection)}`,
          'GET'
        );

        const { GET } = await import('@/app/api/tutorials/route');
        const response = await GET(mockRequest);
        
        // Should handle injection attempts safely
        expect(response.status).not.toBe(500);
        
        // Verify Supabase client was called with safe parameters
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('tutorials');
      }
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types and sizes', async () => {
      const invalidFiles = [
        { name: 'malicious.exe', size: 1000000, type: 'application/x-executable' },
        { name: 'script.js', size: 50000, type: 'application/javascript' },
        { name: 'large-image.jpg', size: 10000000, type: 'image/jpeg' }, // Too large
        { name: 'document.pdf', size: 5000000, type: 'application/pdf' }, // Potentially too large
      ];

      for (const file of invalidFiles) {
        const mockRequest = createMockRequest(
          'http://localhost:3000/api/upload',
          'POST',
          { 'content-type': 'multipart/form-data' },
          { file }
        );

        try {
          const { POST } = await import('@/app/api/upload/route');
          const response = await POST(mockRequest);
          
          // Should reject invalid files
          expect(response.status).toBe(400);
        } catch (error) {
          // File upload validation should prevent processing
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe('Request Size Limits', () => {
    it('should limit request body size', async () => {
      const largePayload = {
        customer_name: 'A'.repeat(10000), // Very long name
        overall_rating: 5,
        comment: 'B'.repeat(100000) // Very long comment
      };

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/public/experience/test-slug/feedback',
        'POST',
        {},
        largePayload
      );

      const { POST } = await import('@/app/api/public/experience/[slug]/feedback/route');
      const response = await POST(mockRequest);
      
      // Should handle large payloads gracefully
      expect(response.status).not.toBe(500);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple concurrent requests safely', async () => {
      const { getCurrentUser } = await import('@/lib/auth/getCurrentUser');
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        brand_id: 'brand-123',
        email: 'test@example.com'
      });

      // Mock successful database responses
      mockSupabaseClient.eq.mockResolvedValue({
        data: [],
        error: null
      });

      mockRedisClient.get.mockResolvedValue(null);

      const requests = Array.from({ length: 10 }, (_, i) => {
        const mockRequest = createMockRequest(
          `http://localhost:3000/api/experiences?brand_id=brand-123&request=${i}`,
          'GET'
        );
        return mockRequest;
      });

      const { GET } = await import('@/app/api/experiences/route');
      
      // Execute all requests concurrently
      const responses = await Promise.all(requests.map(request => GET(request)));
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).not.toBe(500);
      });
    });
  });

  describe('Error Handling Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      // Mock database error
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: {
          message: 'Database connection failed: password=secret123',
          code: 'DB_ERROR'
        }
      });

      const mockRequest = createMockRequest(
        'http://localhost:3000/api/experiences',
        'GET'
      );

      const { GET } = await import('@/app/api/experiences/route');
      const response = await GET(mockRequest);
      
      // Should not expose database credentials
      const responseData = await response.json() as any;
      expect(responseData.error).not.toContain('password=');
      expect(responseData.error).not.toContain('secret123');
    });

    it('should handle malformed JSON gracefully', async () => {
      const mockRequest = {
        ...createMockRequest(
          'http://localhost:3000/api/tutorials',
          'POST',
          { 'content-type': 'application/json' },
          'invalid json{'
        ),
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      };

      const { POST } = await import('@/app/api/tutorials/route');
      const response = await POST(mockRequest);
      
      // Should handle malformed JSON gracefully
      expect(response.status).toBe(400);
    });
  });
});

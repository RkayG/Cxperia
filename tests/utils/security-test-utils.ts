/**
 * Security Test Utilities
 * Helper functions for testing API security, sanitization, and authentication
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock data for testing
export const mockBrandData = {
  id: 'brand-123',
  brand_id: 'brand-123',
  user_id: 'user-456',
  name: 'Test Brand',
  created_by: 'admin-789',
  updated_by: 'admin-789',
  logo_url: 'https://example.com/logo.png',
  website_url: 'https://example.com',
  contact_email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockExperienceData = {
  id: 'exp-123',
  brand_id: 'brand-123',
  user_id: 'user-456',
  product_id: 'prod-123',
  is_published: true,
  public_slug: 'test-experience',
  theme: 'bold',
  primary_color: '#3b82f6',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  products: {
    id: 'prod-123',
    brand_id: 'brand-123',
    name: 'Test Product',
    description: 'A test product',
    created_at: '2024-01-01T00:00:00Z'
  },
  experience_features: [
    {
      id: 'feat-1',
      experience_id: 'exp-123',
      feature_name: 'tutorials',
      is_enabled: true,
      created_at: '2024-01-01T00:00:00Z'
    }
  ]
};

export const mockTutorialData = {
  id: 'tut-123',
  brand_id: 'brand-123',
  user_id: 'user-456',
  experience_id: 'exp-123',
  title: 'Test Tutorial',
  description: 'A test tutorial',
  video_url: 'https://example.com/video.mp4',
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockFeedbackData = {
  id: 'fb-123',
  brand_id: 'brand-123',
  experience_id: 'exp-123',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  overall_rating: 5,
  comment: 'Great product!',
  created_at: '2024-01-01T00:00:00Z'
};

// Sensitive fields that should be removed from public responses
export const SENSITIVE_FIELDS = [
  'brand_id',
  'user_id', 
  'created_by',
  'updated_by'
];

// Helper function to check if sensitive data is present
export function containsSensitiveData(obj: any, fields: string[] = SENSITIVE_FIELDS): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  // Check direct properties
  for (const field of fields) {
    if (field in obj) return true;
  }
  
  // Check nested objects recursively
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        // Check array elements
        for (const item of obj[key]) {
          if (containsSensitiveData(item, fields)) return true;
        }
      } else {
        // Check nested object
        if (containsSensitiveData(obj[key], fields)) return true;
      }
    }
  }
  
  return false;
}

// Helper function to extract all sensitive fields from an object
export function extractSensitiveFields(obj: any, fields: string[] = SENSITIVE_FIELDS): string[] {
  const foundFields: string[] = [];
  
  function traverse(o: any, path: string = '') {
    if (!o || typeof o !== 'object') return;
    
    for (const key in o) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (fields.includes(key)) {
        foundFields.push(currentPath);
      }
      
      if (o[key] && typeof o[key] === 'object') {
        if (Array.isArray(o[key])) {
          o[key].forEach((item: any, index: number) => {
            traverse(item, `${currentPath}[${index}]`);
          });
        } else {
          traverse(o[key], currentPath);
        }
      }
    }
  }
  
  traverse(obj);
  return foundFields;
}

// Helper function to create mock API response
export function createMockApiResponse(data: any, success: boolean = true) {
  return {
    success,
    data: success ? data : null,
    message: success ? 'Success' : 'Error',
    ...(success ? {} : { error: 'Test error' })
  };
}

// Helper function to create mock NextRequest
export function createMockRequest(
  url: string = 'http://localhost:3000/api/test',
  method: string = 'GET',
  headers: Record<string, string> = {},
  body?: any
) {
  const mockHeaders = new Map(Object.entries(headers));
  
  return {
    url,
    method,
    headers: {
      get: (name: string) => mockHeaders.get(name.toLowerCase()),
      has: (name: string) => mockHeaders.has(name.toLowerCase()),
      set: (name: string, value: string) => mockHeaders.set(name.toLowerCase(), value),
      delete: (name: string) => mockHeaders.delete(name.toLowerCase()),
      forEach: (callback: (value: string, key: string) => void) => {
        mockHeaders.forEach(callback);
      },
      [Symbol.iterator]: () => mockHeaders[Symbol.iterator]()
    },
    nextUrl: new URL(url),
    json: async () => body || {},
    text: async () => typeof body === 'string' ? body : JSON.stringify(body),
    formData: async () => new FormData(),
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0)
  } as any;
}

// Helper function to create mock NextRequest with params
export function createMockRequestWithParams(
  url: string = 'http://localhost:3000/api/test',
  method: string = 'GET',
  headers: Record<string, string> = {},
  body?: any,
  params?: Record<string, string>
) {
  const mockHeaders = new Map(Object.entries(headers));
  
  return {
    url,
    method,
    headers: {
      get: (name: string) => mockHeaders.get(name.toLowerCase()),
      has: (name: string) => mockHeaders.has(name.toLowerCase()),
      set: (name: string, value: string) => mockHeaders.set(name.toLowerCase(), value),
      delete: (name: string) => mockHeaders.delete(name.toLowerCase()),
      forEach: (callback: (value: string, key: string) => void) => {
        mockHeaders.forEach(callback);
      },
      [Symbol.iterator]: () => mockHeaders[Symbol.iterator]()
    },
    nextUrl: new URL(url),
    json: async () => body || {},
    text: async () => typeof body === 'string' ? body : JSON.stringify(body),
    formData: async () => new FormData(),
    blob: async () => new Blob(),
    arrayBuffer: async () => new ArrayBuffer(0)
  } as any;
}

// Helper function to create mock params object
export function createMockParams(params: Record<string, string>) {
  return {
    params: Promise.resolve(params)
  };
}

// Helper function to create mock NextResponse
export function createMockResponse(data: any, status: number = 200) {
  return {
    json: vi.fn().mockReturnValue(data),
    status,
    headers: new Map(),
    ok: status >= 200 && status < 300
  } as any;
}

// Helper function to test API endpoint security
export async function testApiSecurity(
  apiHandler: Function,
  mockRequest: any,
  expectedSensitiveFields: string[] = SENSITIVE_FIELDS,
  mockParams?: Record<string, string>
) {
  try {
    const params = mockParams ? createMockParams(mockParams) : undefined;
    const response = await apiHandler(mockRequest, params);
    const responseData = await response.json();
    
    // Check if response contains sensitive data
    const hasSensitiveData = containsSensitiveData(responseData, expectedSensitiveFields);
    const foundFields = extractSensitiveFields(responseData, expectedSensitiveFields);
    
    return {
      success: !hasSensitiveData,
      hasSensitiveData,
      foundFields,
      responseData,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      hasSensitiveData: false,
      foundFields: [],
      responseData: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

// Helper function to test authentication
export function testAuthentication(
  apiHandler: Function,
  mockRequest: any,
  shouldRequireAuth: boolean = true
) {
  return async () => {
    const response = await apiHandler(mockRequest);
    const status = response.status;
    
    if (shouldRequireAuth) {
      expect(status).toBe(401);
    } else {
      expect(status).not.toBe(401);
    }
    
    return { status, requiresAuth: status === 401 };
  };
}

// Helper function to test rate limiting
export function testRateLimiting(
  apiHandler: Function,
  mockRequest: any,
  maxRequests: number = 10
) {
  return async () => {
    const responses = [];
    
    // Make multiple requests
    for (let i = 0; i < maxRequests + 5; i++) {
      const response = await apiHandler(mockRequest);
      responses.push({
        status: response.status,
        headers: response.headers
      });
    }
    
    // Check if rate limiting kicked in
    const rateLimitedResponses = responses.filter(r => r.status === 429);
    const hasRateLimitHeaders = responses.some(r => 
      r.headers.get('X-RateLimit-Limit') || 
      r.headers.get('X-RateLimit-Remaining')
    );
    
    return {
      totalRequests: responses.length,
      rateLimitedCount: rateLimitedResponses.length,
      hasRateLimitHeaders,
      responses
    };
  };
}

// Helper function to test input validation
export function testInputValidation(
  apiHandler: Function,
  invalidInputs: any[],
  expectedStatus: number = 400
) {
  return async () => {
    const results = [];
    
    for (const invalidInput of invalidInputs) {
      const mockRequest = createMockRequest(
        'http://localhost:3000/api/test',
        'POST',
        {},
        invalidInput
      );
      
      const response = await apiHandler(mockRequest);
      results.push({
        input: invalidInput,
        status: response.status,
        isValid: response.status !== expectedStatus
      });
    }
    
    return results;
  };
}

// Test suite helper for API security
export function createApiSecurityTestSuite(
  apiName: string,
  apiHandler: Function,
  testCases: {
    name: string;
    request: any;
    expectedSensitiveFields?: string[];
    shouldRequireAuth?: boolean;
  }[]
) {
  return describe(`${apiName} Security Tests`, () => {
    testCases.forEach(({ name, request, expectedSensitiveFields, shouldRequireAuth }) => {
      it(`should sanitize sensitive data in ${name}`, async () => {
        const result = await testApiSecurity(apiHandler, request, expectedSensitiveFields);
        
        expect(result.success).toBe(true);
        expect(result.hasSensitiveData).toBe(false);
        expect(result.foundFields).toHaveLength(0);
      });
      
      if (shouldRequireAuth !== undefined) {
        it(`should ${shouldRequireAuth ? 'require' : 'not require'} authentication for ${name}`, async () => {
          const authTest = testAuthentication(apiHandler, request, shouldRequireAuth);
          await authTest();
        });
      }
    });
  });
}

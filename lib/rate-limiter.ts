// Rate limiting utility for Next.js API routes
// Supports both Redis and in-memory storage

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: Request) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  message?: string; // Custom error message
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

// In-memory store for rate limiting
class MemoryStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.store.entries()) {
        if (value.resetTime < now) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    const value = this.store.get(key);
    if (!value) return null;
    
    // Check if expired
    if (value.resetTime < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return value;
  }

  async set(key: string, count: number, resetTime: number): Promise<void> {
    this.store.set(key, { count, resetTime });
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const now = Date.now();
    const resetTime = now + windowMs;
    
    const existing = await this.get(key);
    
    if (existing) {
      const newCount = existing.count + 1;
      await this.set(key, newCount, existing.resetTime);
      return { count: newCount, resetTime: existing.resetTime };
    } else {
      await this.set(key, 1, resetTime);
      return { count: 1, resetTime };
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Redis store for rate limiting (if Redis is available)
class RedisStore {
  private redis: any;
  public isConnected: boolean = false;

  constructor() {
    // Try to import Redis, but don't fail if it's not available
    try {
      const Redis = require('ioredis');
      this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
    }
  }

  async get(key: string): Promise<{ count: number; resetTime: number } | null> {
    if (!this.isConnected) return null;
    
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      
      const parsed = JSON.parse(value) as { count: number; resetTime: number };
      if (parsed.resetTime < Date.now()) {
        await this.redis.del(key);
        return null;
      }
      
      return parsed;
    } catch (error) {
      return null;
    }
  }

  async set(key: string, count: number, resetTime: number): Promise<void> {
    if (!this.isConnected) return;
    
    try {
      const value = JSON.stringify({ count, resetTime });
      const ttl = Math.ceil((resetTime - Date.now()) / 1000);
      await this.redis.setex(key, ttl, value);
    } catch (error) {
    }
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    if (!this.isConnected) {
      // Fallback to memory store
      const memoryStore = new MemoryStore();
      return memoryStore.increment(key, windowMs);
    }
    
    try {
      const now = Date.now();
      const resetTime = now + windowMs;
      
      const existing = await this.get(key);
      if (existing) {
        const newCount = existing.count + 1;
        await this.set(key, newCount, existing.resetTime);
        return { count: newCount, resetTime: existing.resetTime };
      } else {
        await this.set(key, 1, resetTime);
        return { count: 1, resetTime };
      }
    } catch (error) {
      // Fallback to memory store
      const memoryStore = new MemoryStore();
      return memoryStore.increment(key, windowMs);
    }
  }
}

// Default key generator - uses IP address
const defaultKeyGenerator = (request: Request): string => {
  const headers = request.headers;
  const ip = headers.get('x-forwarded-for') || 
             headers.get('x-real-ip') || 
             headers.get('cf-connecting-ip') || 
             'unknown';
  const key = `rate_limit:${ip}`;
  return key;
};

// Rate limiter class
export class RateLimiter {
  private store: MemoryStore | RedisStore;
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: defaultKeyGenerator,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      message: 'Too many requests, please try again later.',
      ...config,
    };

    // Use Redis if available, otherwise fall back to memory
    const redisStore = new RedisStore();
    if (!redisStore.isConnected) {
      this.store = new MemoryStore();
    } else {
      this.store = redisStore;
    }
  }

  async checkLimit(request: Request): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(request);
    
    const { count, resetTime } = await this.store.increment(key, this.config.windowMs);
    
    const remaining = Math.max(0, this.config.maxRequests - count);
    const retryAfter = count > this.config.maxRequests 
      ? Math.ceil((resetTime - Date.now()) / 1000)
      : undefined;

    const result = {
      success: count <= this.config.maxRequests,
      limit: this.config.maxRequests,
      remaining,
      resetTime,
      retryAfter,
    };
    
    if (!result.success) {
    }
    
    return result;
  }

  async recordRequest(request: Request, success: boolean = true): Promise<void> {
    // This is handled by checkLimit, but we can add additional logic here if needed
    // For example, different limits for successful vs failed requests
  }

  destroy(): void {
    if (this.store instanceof MemoryStore) {
      this.store.destroy();
    }
  }
}

// Singleton rate limiters to ensure persistence across requests
let feedbackRateLimiter: RateLimiter | null = null;
let generalRateLimiter: RateLimiter | null = null;
let strictRateLimiter: RateLimiter | null = null;

export const createFeedbackRateLimiter = () => {
  if (!feedbackRateLimiter) {
    feedbackRateLimiter = new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3, // 3 feedback submissions per 15 minutes
      message: 'Too many feedback submissions. Please wait before submitting again.',
    });
  }
  return feedbackRateLimiter;
};

export const createGeneralRateLimiter = () => {
  if (!generalRateLimiter) {
    generalRateLimiter = new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per 15 minutes
      message: 'Too many requests. Please try again later.',
    });
  }
  return generalRateLimiter;
};

export const createStrictRateLimiter = () => {
  if (!strictRateLimiter) {
    strictRateLimiter = new RateLimiter({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10, // 10 requests per minute
      message: 'Rate limit exceeded. Please slow down your requests.',
    });
  }
  return strictRateLimiter;
};

// Utility function to create rate limit response
export const createRateLimitResponse = (result: RateLimitResult, message?: string) => {
  const response = new Response(
    JSON.stringify({ 
      error: message || 'Rate limit exceeded',
      retryAfter: result.retryAfter,
      limit: result.limit,
      remaining: result.remaining,
      resetTime: new Date(result.resetTime).toISOString(),
    }),
    { 
      status: 429,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
  
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString());
  }

  return response;
};

// Utility function to add rate limit headers to successful responses
export const addRateLimitHeaders = (response: Response, result: RateLimitResult) => {
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
  return response;
};

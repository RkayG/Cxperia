# Rate Limiting Guide

This project includes comprehensive rate limiting for API endpoints to prevent abuse and ensure fair usage.

## Features

- **Multiple Rate Limiting Strategies**: Different limits for different types of requests
- **Redis + Memory Fallback**: Uses Redis when available, falls back to in-memory storage
- **IP-based Limiting**: Rate limits based on client IP address
- **Custom Headers**: Includes standard rate limit headers in responses
- **Comprehensive Logging**: All rate limit events are logged
- **Graceful Degradation**: Continues working even if Redis is unavailable

## Rate Limiting Configurations

### 1. Feedback Submission (POST)
- **Window**: 15 minutes
- **Limit**: 5 submissions per window
- **Purpose**: Prevent spam feedback submissions

### 2. General API (GET)
- **Window**: 15 minutes  
- **Limit**: 100 requests per window
- **Purpose**: General API protection

### 3. Strict Limiting
- **Window**: 1 minute
- **Limit**: 10 requests per window
- **Purpose**: Emergency protection against rapid requests

## Response Headers

All responses include rate limit headers:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200000
Retry-After: 900
```

## Rate Limit Exceeded Response

When rate limit is exceeded, returns HTTP 429:

```json
{
  "error": "Too many feedback submissions. Please wait before submitting again.",
  "retryAfter": 900,
  "limit": 5,
  "remaining": 0,
  "resetTime": "2024-01-15T10:30:00.000Z"
}
```

## Implementation

### Basic Usage

```typescript
import { createFeedbackRateLimiter, createRateLimitResponse } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  const rateLimiter = createFeedbackRateLimiter();
  
  // Check rate limit
  const result = await rateLimiter.checkLimit(request);
  
  if (!result.success) {
    return createRateLimitResponse(result, 'Too many requests');
  }
  
  // Process request...
  
  // Clean up
  rateLimiter.destroy();
}
```

### Custom Rate Limiter

```typescript
import { RateLimiter } from '@/lib/rate-limiter';

const customLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute
  keyGenerator: (request) => {
    // Custom key based on user ID if available
    const userId = request.headers.get('x-user-id');
    return userId ? `user:${userId}` : `ip:${request.headers.get('x-forwarded-for')}`;
  },
  message: 'Custom rate limit exceeded'
});
```

## Storage Backends

### Redis (Recommended for Production)
- **Pros**: Persistent, shared across instances, more accurate
- **Cons**: Requires Redis server
- **Configuration**: Set `REDIS_URL` environment variable

### Memory (Fallback)
- **Pros**: No external dependencies, fast
- **Cons**: Not shared across instances, lost on restart
- **Usage**: Automatic fallback when Redis unavailable

## Monitoring

Rate limit events are logged with:
- Request details (IP, user agent, method, URL)
- Rate limit status (limit, remaining, reset time)
- Request ID for tracking

## Testing Rate Limits

### Using curl

```bash
# Test feedback submission rate limit (5 per 15 minutes)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/public/experience/test/feedback \
    -H "Content-Type: application/json" \
    -d '{"overall_rating": 5, "comment": "Test feedback"}'
  echo "Request $i completed"
done
```

### Expected Behavior
- First 5 requests: HTTP 200 with rate limit headers
- 6th request: HTTP 429 with rate limit exceeded message
- After 15 minutes: Rate limit resets

## Configuration

### Environment Variables
```bash
# Optional: Redis URL for persistent rate limiting
REDIS_URL=redis://localhost:6379

# Optional: Custom rate limit settings
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=5    # 5 requests per window
```

### Customizing Limits

Edit the rate limiter configurations in `lib/rate-limiter.ts`:

```typescript
export const createFeedbackRateLimiter = () => new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 feedback submissions per 15 minutes
  message: 'Too many feedback submissions. Please wait before submitting again.',
});
```

## Best Practices

1. **Monitor Rate Limit Events**: Check logs for rate limit violations
2. **Adjust Limits**: Tune limits based on actual usage patterns
3. **User Communication**: Provide clear error messages
4. **Graceful Degradation**: Ensure app works even if rate limiting fails
5. **Testing**: Test rate limits in staging environment

## Troubleshooting

### Rate Limiting Not Working
- Check Redis connection (if using Redis)
- Verify rate limiter is properly initialized
- Check logs for errors

### Too Many False Positives
- Increase rate limit window or max requests
- Consider different key generation strategy
- Review IP detection logic

### Memory Usage Issues
- Switch to Redis for production
- Reduce rate limit window duration
- Implement cleanup for expired entries

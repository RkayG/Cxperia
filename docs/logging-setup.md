# Logging Setup

This project includes a comprehensive logging system that works across different Next.js environments.

## Architecture

### 1. Edge Runtime Logging (`lib/logging-edge.ts`)
- **Used in**: Middleware
- **Features**: Console-only logging (no file system access)
- **Compatible with**: Edge Runtime
- **Logs to**: Console only

### 2. Node.js Logging (`lib/logging.ts`)
- **Used in**: API routes, server components, server actions
- **Features**: File + console logging
- **Compatible with**: Node.js runtime
- **Logs to**: Files (`logs/access.log`, `logs/error.log`) + console

## Log Files

```
logs/
├── access.log    # HTTP requests, info, warnings, debug
└── error.log     # Errors with stack traces
```

## Usage

### In Middleware (Edge Runtime)
```typescript
import { logAccess, logError, extractRequestInfo, generateRequestId } from '@/lib/logging-edge';

// Log access
logAccess({
  method: 'GET',
  url: '/api/example',
  statusCode: 200,
  responseTime: 150,
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  userId: 'user123',
  requestId: 'req_abc123'
});
```

### In API Routes (Node.js Runtime)
```typescript
import { logError, logAccess, extractRequestInfo, generateRequestId } from '@/lib/logging';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const requestInfo = extractRequestInfo(request);
  
  try {
    // Your API logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    logError(error as Error, {
      ...requestInfo,
      requestId,
      statusCode: 500,
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    const responseTime = Date.now() - startTime;
    logAccess({
      ...requestInfo,
      statusCode: 200,
      responseTime,
      requestId,
    });
  }
}
```

### In React Components
```typescript
import { logError, logInfo } from '@/lib/logging';

const MyComponent = () => {
  const handleError = (error: Error) => {
    logError(error, {
      additionalData: { component: 'MyComponent' }
    });
  };

  return <div>...</div>;
};
```

## Log Levels

- **ERROR**: Critical errors with stack traces
- **WARN**: Warning messages
- **INFO**: General information
- **DEBUG**: Debug information (only in development)

## Log Format

All logs are in JSON format for easy parsing:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "INFO",
  "message": "GET /api/example 200",
  "method": "GET",
  "url": "https://example.com/api/example",
  "statusCode": 200,
  "responseTime": 150,
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "userId": "user123",
  "requestId": "req_abc123",
  "metadata": {
    "additionalData": "value"
  }
}
```

## Environment Behavior

### Development
- All logs go to console
- Debug logs are enabled
- File logging is disabled

### Production
- Logs go to both files and console
- Debug logs are disabled
- File logging is enabled

## File Logging

- **Access Log**: All HTTP requests, info, warnings, debug
- **Error Log**: Only errors with stack traces
- **Automatic Directory Creation**: Creates `logs/` directory if it doesn't exist
- **Buffer Optimization**: 16KB buffers for efficient writing
- **Graceful Shutdown**: Properly closes file streams on process exit

## Error Handling

The logging system is designed to be resilient:
- If file logging fails, it falls back to console only
- Edge Runtime compatibility is maintained
- No crashes if logging fails
- Graceful degradation in different environments

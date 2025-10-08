import fs from 'fs';
import path from 'path';

// Only create file streams in Node.js environment (not Edge Runtime)
let accessLogStream: fs.WriteStream | null = null;
let errorLogStream: fs.WriteStream | null = null;

// Initialize file logging only in Node.js environment
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'development') {
  try {
    // Create logs directory if it doesn't exist
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Create write streams for logs
    accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { 
      flags: 'a',
      highWaterMark: 1024 * 16 // 16KB buffer
    });

    errorLogStream = fs.createWriteStream(path.join(logDir, 'error.log'), { 
      flags: 'a',
      highWaterMark: 1024 * 16
    });
  } catch (error) {
    console.warn('Failed to initialize file logging:', error);
  }
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  metadata?: Record<string, any>;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
}

// Format timestamp
const getTimestamp = (): string => {
  return new Date().toISOString();
};

// Format log entry
const formatLogEntry = (entry: LogEntry): string => {
  const baseEntry = {
    timestamp: entry.timestamp,
    level: entry.level,
    message: entry.message,
    ...(entry.metadata && { metadata: entry.metadata }),
    ...(entry.userId && { userId: entry.userId }),
    ...(entry.requestId && { requestId: entry.requestId }),
    ...(entry.ip && { ip: entry.ip }),
    ...(entry.userAgent && { userAgent: entry.userAgent }),
    ...(entry.method && { method: entry.method }),
    ...(entry.url && { url: entry.url }),
    ...(entry.statusCode && { statusCode: entry.statusCode }),
    ...(entry.responseTime && { responseTime: entry.responseTime }),
  };

  return JSON.stringify(baseEntry) + '\n';
};

// Access logging function
export const logAccess = (data: {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  ip?: string;
  userAgent?: string;
  userId?: string;
  requestId?: string;
}) => {
  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level: 'INFO',
    message: `${data.method} ${data.url} ${data.statusCode}`,
    method: data.method,
    url: data.url,
    statusCode: data.statusCode,
    responseTime: data.responseTime,
    ip: data.ip,
    userAgent: data.userAgent,
    userId: data.userId,
    requestId: data.requestId,
  };

  const logLine = formatLogEntry(entry);
  
  // Write to access log if available
  if (accessLogStream) {
    accessLogStream.write(logLine);
  }
  
  // Also log to console
  console.log(`[ACCESS] ${logLine.trim()}`);
};

// Error logging function
export const logError = (error: Error | string, metadata?: {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  additionalData?: Record<string, any>;
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level: 'ERROR',
    message: errorMessage,
    metadata: {
      ...(errorStack && { stack: errorStack }),
      ...(metadata?.additionalData && metadata.additionalData),
    },
    userId: metadata?.userId,
    requestId: metadata?.requestId,
    ip: metadata?.ip,
    userAgent: metadata?.userAgent,
    method: metadata?.method,
    url: metadata?.url,
    statusCode: metadata?.statusCode,
  };

  const logLine = formatLogEntry(entry);
  
  // Write to error log if available
  if (errorLogStream) {
    errorLogStream.write(logLine);
  }
  
  // Also log to console
  console.error(`[ERROR] ${logLine.trim()}`);
};

// Warning logging function
export const logWarning = (message: string, metadata?: {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  additionalData?: Record<string, any>;
}) => {
  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level: 'WARN',
    message,
    metadata: metadata?.additionalData,
    userId: metadata?.userId,
    requestId: metadata?.requestId,
    ip: metadata?.ip,
    userAgent: metadata?.userAgent,
    method: metadata?.method,
    url: metadata?.url,
  };

  const logLine = formatLogEntry(entry);
  
  // Write to access log if available (warnings can go in access log)
  if (accessLogStream) {
    accessLogStream.write(logLine);
  }
  
  // Also log to console
  console.warn(`[WARN] ${logLine.trim()}`);
};

// Debug logging function
export const logDebug = (message: string, metadata?: {
  userId?: string;
  requestId?: string;
  additionalData?: Record<string, any>;
}) => {
  // Only log debug messages in development
  if (process.env.NODE_ENV !== 'development') return;

  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level: 'DEBUG',
    message,
    metadata: metadata?.additionalData,
    userId: metadata?.userId,
    requestId: metadata?.requestId,
  };

  const logLine = formatLogEntry(entry);
  
  // Write to access log if available
  if (accessLogStream) {
    accessLogStream.write(logLine);
  }
  
  // Also log to console
  console.log(`[DEBUG] ${logLine.trim()}`);
};

// Info logging function
export const logInfo = (message: string, metadata?: {
  userId?: string;
  requestId?: string;
  additionalData?: Record<string, any>;
}) => {
  const entry: LogEntry = {
    timestamp: getTimestamp(),
    level: 'INFO',
    message,
    metadata: metadata?.additionalData,
    userId: metadata?.userId,
    requestId: metadata?.requestId,
  };

  const logLine = formatLogEntry(entry);
  
  // Write to access log if available
  if (accessLogStream) {
    accessLogStream.write(logLine);
  }
  
  // Also log to console
  console.log(`[INFO] ${logLine.trim()}`);
};

// Utility function to extract request info
export const extractRequestInfo = (request: Request): {
  ip?: string;
  userAgent?: string;
  method: string;
  url: string;
} => {
  const headers = request.headers;
  
  return {
    ip: headers.get('x-forwarded-for') || 
        headers.get('x-real-ip') || 
        headers.get('cf-connecting-ip') || 
        'unknown',
    userAgent: headers.get('user-agent') || 'unknown',
    method: request.method,
    url: request.url,
  };
};

// Generate unique request ID
export const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Graceful shutdown - close streams
export const closeLogStreams = () => {
  if (accessLogStream) {
    accessLogStream.end();
  }
  if (errorLogStream) {
    errorLogStream.end();
  }
};

// Handle process exit
process.on('SIGINT', closeLogStreams);
process.on('SIGTERM', closeLogStreams);

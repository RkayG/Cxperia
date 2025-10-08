// Example usage of logging utilities
import { logError, logInfo, logWarning, logDebug } from '@/lib/logging';

// Example: Logging in a React component
export const ExampleComponent = () => {
  const handleError = (error: Error) => {
    logError(error, {
      additionalData: {
        component: 'ExampleComponent',
        action: 'handleError'
      }
    });
  };

  const handleInfo = (message: string) => {
    logInfo(message, {
      additionalData: {
        component: 'ExampleComponent',
        action: 'handleInfo'
      }
    });
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};

// Example: Logging in a server action
export async function serverAction() {
  try {
    logInfo('Server action started', {
      additionalData: { action: 'serverAction' }
    });

    // Your server logic here
    const result = await someAsyncOperation();

    logInfo('Server action completed successfully', {
      additionalData: { 
        action: 'serverAction',
        resultCount: result.length 
      }
    });

    return result;
  } catch (error) {
    logError(error as Error, {
      additionalData: { action: 'serverAction' }
    });
    throw error;
  }
}

// Example: Logging in API routes (already implemented in feedback route)
/*
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
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
*/

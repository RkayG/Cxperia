'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import NavigationProgressBar from '@/components/NavigationProgess';
import { NavigationProgressProvider } from '@/contexts/NavigationProgressContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationProgressProvider>
        <NavigationProgressBar />
        {children}
      </NavigationProgressProvider>
    </QueryClientProvider>
  );
}
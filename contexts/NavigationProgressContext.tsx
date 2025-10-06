'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigationProgress } from '@/hooks/useNavigationProgress';

interface NavigationProgressContextType {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  updateProgress: (progress: number) => void;
  finishLoading: () => void;
  stopLoading: () => void;
}

const NavigationProgressContext = createContext<NavigationProgressContextType | undefined>(undefined);

export const useNavigationProgressContext = () => {
  const context = useContext(NavigationProgressContext);
  if (!context) {
    throw new Error('useNavigationProgressContext must be used within a NavigationProgressProvider');
  }
  return context;
};

interface NavigationProgressProviderProps {
  children: ReactNode;
}

export const NavigationProgressProvider: React.FC<NavigationProgressProviderProps> = ({ children }) => {
  const navigationProgress = useNavigationProgress();

  return (
    <NavigationProgressContext.Provider value={navigationProgress}>
      {children}
    </NavigationProgressContext.Provider>
  );
};

'use client';

import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);

  const startNavigation = () => setIsNavigating(true);
  const endNavigation = () => setIsNavigating(false);

  return (
    <LoadingContext.Provider value={{ 
      isNavigating, 
      startNavigation, 
      endNavigation 
    }}>
      {children}
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-50 animate-pulse">
          <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 animate-ping"></div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

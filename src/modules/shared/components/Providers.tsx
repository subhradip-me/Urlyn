'use client';

import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Simple providers wrapper for now
  // Will be enhanced with AuthProvider, ThemeProvider, etc.
  return React.createElement('div', { className: 'app-providers' }, children);
}

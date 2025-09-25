'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children, requiredPersona = null }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      if (requiredPersona && user?.persona !== requiredPersona) {
        // Redirect to appropriate dashboard based on user's persona
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requiredPersona, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (requiredPersona && user?.persona !== requiredPersona) {
    return null; // Will redirect to appropriate dashboard
  }

  return children;
}

export default ProtectedRoute;

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function DashboardLayout({ children, persona }) {
  const { user, isAuthenticated, loading, switchPersona } = useAuth();
  const router = useRouter();
  const [isPersonaSwitching, setIsPersonaSwitching] = useState(false);

  // Handle authentication and persona routing
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
    }
  }, [isAuthenticated, loading, router]);

  // Auto-switch persona when route changes
  useEffect(() => {
    const switchPersonaIfNeeded = async () => {
      if (
        user && 
        persona && 
        user.currentPersona !== persona && 
        user.personas?.includes(persona) &&
        !isPersonaSwitching
      ) {
        setIsPersonaSwitching(true);
        
        try {
          const result = await switchPersona(persona);
          if (!result.success) {
            console.error('Failed to switch persona:', result.error);
          }
        } catch (error) {
          console.error('Error switching persona:', error);
        } finally {
          setIsPersonaSwitching(false);
        }
      }
    };

    switchPersonaIfNeeded();
  }, [user, persona, switchPersona, isPersonaSwitching]);

  // Check if user has access to the requested persona
  useEffect(() => {
    if (user && persona && !isPersonaSwitching && !user.personas?.includes(persona)) {
      router.push('/dashboard');
    }
  }, [user, persona, router, isPersonaSwitching]);

  const handlePersonaChange = async (newPersona) => {
    try {
      if (!user?.personas?.includes(newPersona)) {
        router.push('/dashboard');
        return;
      }

      const result = await switchPersona(newPersona);
      
      if (result.success) {
        let targetRoute;
        switch (newPersona) {
          case 'professional':
          case 'entrepreneur':
            targetRoute = `/${newPersona}/dashboard`;
            break;
          case 'student':
          case 'creator':
          case 'researcher':
            targetRoute = `/${newPersona}/home`;
            break;
          default:
            targetRoute = `/${newPersona}/home`;
        }
        
        router.push(targetRoute);
      } else {
        console.error('Failed to switch persona:', result.error);
      }
    } catch (error) {
      console.error('Error switching persona:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // Use the persona prop from the route, fallback to user's current persona
  const currentPersona = persona || user?.currentPersona || 'student';

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar 
        persona={currentPersona} 
        onPersonaChange={handlePersonaChange} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

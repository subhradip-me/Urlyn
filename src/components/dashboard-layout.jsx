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
      // Only switch if:
      // 1. User is authenticated and loaded
      // 2. We have a persona prop from the route
      // 3. User's current persona doesn't match route persona
      // 4. User has access to the requested persona
      
      console.log('DashboardLayout: Checking persona switch need', {
        user: !!user,
        persona,
        userCurrentPersona: user?.currentPersona,
        userPersonas: user?.personas,
        isPersonaSwitching
      });

      if (
        user && 
        persona && 
        user.currentPersona !== persona && 
        user.personas?.includes(persona) &&
        !isPersonaSwitching
      ) {
        console.log(`DashboardLayout: Auto-switching persona from ${user.currentPersona} to ${persona}`);
        setIsPersonaSwitching(true);
        
        try {
          const result = await switchPersona(persona);
          if (result.success) {
            console.log(`DashboardLayout: Successfully switched to ${persona} persona`);
          } else {
            console.error('DashboardLayout: Failed to switch persona:', result.error);
          }
        } catch (error) {
          console.error('DashboardLayout: Error switching persona:', error);
        } finally {
          setIsPersonaSwitching(false);
        }
      }
    };

    switchPersonaIfNeeded();
  }, [user, persona, switchPersona, isPersonaSwitching]);

  // Check if user has access to the requested persona - TEMPORARILY DISABLED for debugging
  useEffect(() => {
    // Temporarily disable this check to debug persona switching issue
    console.log('DashboardLayout: Persona access check - DISABLED for debugging', {
      user: !!user,
      persona,
      userPersonas: user?.personas,
      isPersonaSwitching
    });
    
    /* DISABLED - causing redirect issues during persona switching
    // Only redirect if we're not in the middle of switching personas
    // and the user definitely doesn't have access after a reasonable delay
    if (user && persona && !isPersonaSwitching && !user.personas?.includes(persona)) {
      // Add a small delay to allow for state updates from persona switching
      const timer = setTimeout(() => {
        if (user && persona && !user.personas?.includes(persona)) {
          console.log(`User doesn't have access to ${persona} persona, redirecting to dashboard`);
          router.push('/dashboard');
        }
      }, 1000); // Wait 1 second for persona switch to complete

      return () => clearTimeout(timer);
    }
    */
  }, [user, persona, router, isPersonaSwitching]);

  const handlePersonaChange = async (newPersona) => {
    console.log('DashboardLayout: handlePersonaChange called with:', newPersona);
    console.log('DashboardLayout: Call stack:', new Error().stack);
    
    try {
      // If user doesn't have this persona, redirect to dashboard to add it
      if (!user?.personas?.includes(newPersona)) {
        console.log('DashboardLayout: User does not have persona, redirecting to dashboard');
        router.push('/dashboard');
        return;
      }

      console.log('DashboardLayout: User has persona, switching...');
      
      // Switch persona
      const result = await switchPersona(newPersona);
      
      if (result.success) {
        console.log('DashboardLayout: Persona switch successful, navigating to persona page');
        
        // Navigate to the appropriate persona page based on persona type
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
        
        console.log('DashboardLayout: Navigating to:', targetRoute);
        router.push(targetRoute);
      } else {
        console.error('DashboardLayout: Failed to switch persona:', result.error);
        // Optionally show error message to user
      }
    } catch (error) {
      console.error('DashboardLayout: Error switching persona:', error);
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

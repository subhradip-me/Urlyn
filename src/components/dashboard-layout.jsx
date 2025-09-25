"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardLayout({ children }) {
  const { user, isAuthenticated, loading, switchPersona } = useAuth();
  const router = useRouter();

  // Handle authentication and persona routing
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
    }
  }, [isAuthenticated, loading, router]);

  const handlePersonaChange = async (newPersona) => {
    try {
      // If user doesn't have this persona, redirect to dashboard to add it
      if (!user?.personas?.includes(newPersona)) {
        router.push('/dashboard');
        return;
      }

      // Switch persona
      const result = await switchPersona(newPersona);
      
      if (result.success) {
        // Redirect to the new persona's home page
        switch (newPersona) {
          case 'student':
            router.push('/student/home');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        console.error('Failed to switch persona:', result.error);
        // Optionally show error message to user
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

  const currentPersona = user?.currentPersona || 'student';

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

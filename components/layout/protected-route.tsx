'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      router.push('/doctor/login');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
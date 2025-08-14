'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePatientAuth } from '@/contexts/patient-auth-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PatientProtectedRouteProps {
  children: React.ReactNode;
}

export function PatientProtectedRoute({ children }: PatientProtectedRouteProps) {
  const { state } = usePatientAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated && !state.isLoading) {
      router.push('/patient/login');
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
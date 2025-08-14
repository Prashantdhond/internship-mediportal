'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Patient } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = Array.isArray(params?.patientId) ? params?.patientId[0] : (params?.patientId as string);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const patients = await mockApi.getPatients();
        setPatient(patients.find((p) => p.id === patientId) || null);
      } finally {
        setIsLoading(false);
      }
    };
    if (patientId) load();
  }, [patientId]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
            {patientId && (
              <Button asChild>
                <Link href={`/patients/${patientId}/history`}>View Medical History</Link>
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-60"><LoadingSpinner /></div>
          ) : !patient ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">Patient not found.</CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-gray-700">
                <div>Email: <span className="font-medium">{patient.email}</span></div>
                <div>Phone: <span className="font-medium">{patient.phone}</span></div>
                <div>Age: <span className="font-medium">{patient.age}</span></div>
                <div>Gender: <span className="font-medium capitalize">{patient.gender}</span></div>
                <div>Last Visit: <span className="font-medium">{patient.lastVisit}</span></div>
                <div>Total Visits: <span className="font-medium">{patient.totalVisits}</span></div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}



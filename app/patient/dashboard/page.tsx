'use client';

import { PatientStatsCards } from '@/components/patient/patient-stats-cards';
import { PatientUpcomingAppointments } from '@/components/patient/patient-upcoming-appointments';
import { PatientProtectedRoute } from '@/components/patient/patient-protected-route';
import { PatientNavbar } from '@/components/patient/patient-navbar';
import { usePatientAuth } from '@/contexts/patient-auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Pill } from 'lucide-react';

export default function PatientDashboardPage() {
  const { state } = usePatientAuth();

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {state.patient?.firstName} {state.patient?.lastName}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your health appointments and medical records
            </p>
          </div>

          <div className="space-y-8">
            <PatientStatsCards />
            
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="appointments" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
                  <Pill className="h-4 w-4" />
                  <span>Prescriptions</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments" className="space-y-8">
                <PatientUpcomingAppointments />
              </TabsContent>
              
              <TabsContent value="prescriptions" className="space-y-8">
                
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
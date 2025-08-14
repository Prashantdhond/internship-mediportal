'use client';

import { useState } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentAppointments } from '@/components/dashboard/recent-appointments';
import { AppointmentCalendar } from '@/components/dashboard/appointment-calendar';
import { PrescriptionsList } from '@/components/dashboard/prescriptions-list';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Pill } from 'lucide-react';

export default function DashboardPage() {
  const { state } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Dr. {state.doctor?.firstName} {state.doctor?.lastName}
            </h1>
            <p className="text-gray-600 mt-2">
              Here's an overview of your practice today
            </p>
          </div>

          <div className="space-y-8">
            <StatsCards />
            
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="flex items-center space-x-2">
                  <Pill className="h-4 w-4" />
                  <span>Prescriptions</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <RecentAppointments />
                  </div>
                  <div className="lg:col-span-2">
                    <AppointmentCalendar />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="prescriptions" className="space-y-8">
                <PrescriptionsList />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
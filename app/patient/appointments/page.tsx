'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientProtectedRoute } from '@/components/patient/patient-protected-route';
import { PatientNavbar } from '@/components/patient/patient-navbar';
import { Appointment } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import { usePatientAuth } from '@/contexts/patient-auth-context';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { state } = usePatientAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!state.patient?.id) return;
      
      try {
        const data = await mockApi.getPatientAppointments(state.patient.id);
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [state.patient?.id]);

  const now = new Date();
  const upcomingAppointments = appointments.filter(apt => 
    new Date(`${apt.date}T${apt.time}`) > now && apt.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(apt => 
    new Date(`${apt.date}T${apt.time}`) <= now || apt.status === 'completed'
  );

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const renderAppointments = (appointmentList: Appointment[]) => {
    if (appointmentList.length === 0) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-gray-500">No appointments found</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {appointmentList.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Dr. {appointment.patientName.split(' ')[0]} {/* This would be doctor name in real app */}
                    </h3>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(`${appointment.date}T${appointment.time}`), 'EEEE, MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(`${appointment.date}T${appointment.time}`), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Heart Care Clinic</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Symptoms/Reason:</p>
                    <p className="text-gray-700">{appointment.symptoms}</p>
                  </div>
                </div>

                {appointment.status === 'confirmed' && new Date(`${appointment.date}T${appointment.time}`) > now && (
                  <div className="ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">View and manage your medical appointments</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-fit">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <LoadingSpinner />
                </div>
              ) : (
                renderAppointments(upcomingAppointments)
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <LoadingSpinner />
                </div>
              ) : (
                renderAppointments(pastAppointments)
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
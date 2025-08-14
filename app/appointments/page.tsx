'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Phone, Mail, Search, FileText, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { PrescriptionModal } from '@/components/dashboard/prescription-modal';
import { Appointment } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import Link from 'next/link';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await mockApi.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      await mockApi.updateAppointmentStatus(id, status);
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, status } : apt)
      );
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const handleCreatePrescription = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsPrescriptionModalOpen(true);
  };

  const handlePrescriptionSuccess = () => {
    console.log('Prescription created successfully');
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && appointment.status === activeTab;
  });

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-indigo-100 text-indigo-800';
      case 'emergency': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your patient appointments</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments by patient name or symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <LoadingSpinner />
                </div>
              ) : filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-48">
                    <p className="text-gray-500">No appointments found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredAppointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.patientName}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className={getTypeColor(appointment.type)}>
                                {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
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
                                <Phone className="h-4 w-4" />
                                <span>{appointment.patientPhone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Mail className="h-4 w-4" />
                                <span>{appointment.patientEmail}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">Symptoms/Reason:</p>
                              <p className="text-gray-700">{appointment.symptoms}</p>
                            </div>
                          </div>

                          {appointment.status === 'pending' && (
                            <div className="flex flex-col space-y-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                Cancel
                              </Button>
                              <Button asChild size="sm" variant="outline" className="mt-2">
                                <Link href={`/patients/${appointment.patientId}/history`}>
                                  <History className="h-4 w-4 mr-1" /> Medical History
                                </Link>
                              </Button>
                            </div>
                          )}

                          {appointment.status === 'confirmed' && (
                            <div className="flex flex-col space-y-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Mark Complete
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/patients/${appointment.patientId}/history`}>
                                  <History className="h-4 w-4 mr-1" /> Medical History
                                </Link>
                              </Button>
                            </div>
                          )}

                          {appointment.status === 'completed' && (
                            <div className="flex flex-col space-y-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => handleCreatePrescription(appointment)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Create Prescription
                              </Button>
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/patients/${appointment.patientId}/history`}>
                                  <History className="h-4 w-4 mr-1" /> Medical History
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        <PrescriptionModal
          appointment={selectedAppointment}
          isOpen={isPrescriptionModalOpen}
          onClose={() => {
            setIsPrescriptionModalOpen(false);
            setSelectedAppointment(null);
          }}
          onSuccess={handlePrescriptionSuccess}
        />
      </div>
    </ProtectedRoute>
  );
}
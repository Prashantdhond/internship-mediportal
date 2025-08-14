'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PrescriptionModal } from './prescription-modal';
import { Appointment } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import Link from 'next/link';

export function RecentAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await mockApi.getAppointments();
        setAppointments(data.slice(0, 5)); // Show only recent 5
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
    // Refresh appointments or show success message
    console.log('Prescription created successfully');
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No appointments found</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(`${appointment.date}T${appointment.time}`), 'MMM d, yyyy - h:mm a')}
                      </p>

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
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {appointment.symptoms}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(appointment.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </Badge>
                  
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700 text-white"
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
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <PrescriptionModal
        appointment={selectedAppointment}
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handlePrescriptionSuccess}
      />
    </Card>
  );
}
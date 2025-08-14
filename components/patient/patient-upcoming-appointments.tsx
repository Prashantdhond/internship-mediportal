'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Appointment } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import { usePatientAuth } from '@/contexts/patient-auth-context';

export function PatientUpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = usePatientAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!state.patient?.id) return;
      
      try {
        const data = await mockApi.getPatientAppointments(state.patient.id);
        const upcoming = data.filter(apt => 
          new Date(`${apt.date}T${apt.time}`) > new Date() && apt.status !== 'cancelled'
        ).slice(0, 3);
        setAppointments(upcoming);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [state.patient?.id]);

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
          <CardTitle>Upcoming Appointments</CardTitle>
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
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
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
                        Dr. John Smith {/* This would be actual doctor name */}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(`${appointment.date}T${appointment.time}`), 'MMM d, yyyy - h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span>Heart Care Clinic</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {appointment.symptoms}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(appointment.status)}>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="capitalize">{appointment.status}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
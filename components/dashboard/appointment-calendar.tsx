'use client';

import { useEffect, useState, useCallback } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PrescriptionModal } from './prescription-modal';
import { Appointment } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from '@/contexts/auth-context';
import { format, addDays, subDays } from 'date-fns';
import { Clock, User, Phone, Mail, Trash2, Calendar as CalendarIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Appointment;
}

interface NewAppointment {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  symptoms: string;
  type: 'consultation' | 'follow-up' | 'emergency';
}

export function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('month');
  const [showPastAppointments, setShowPastAppointments] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const { state } = useAuth();
  const [prescriptionAppointment, setPrescriptionAppointment] = useState<Appointment | null>(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedAppointmentId) return;

      const selectedEvent = events.find(e => e.id === selectedAppointmentId);
      if (!selectedEvent) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          moveAppointmentEarlier(selectedEvent);
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveAppointmentLater(selectedEvent);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          moveAppointmentBack(selectedEvent);
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveAppointmentForward(selectedEvent);
          break;
        case 'Escape':
          event.preventDefault();
          setSelectedAppointmentId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAppointmentId]);

  const fetchAppointments = async () => {
    try {
      const data = await mockApi.getAppointments('1'); // Current doctor's appointments
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const events: CalendarEvent[] = appointments
    .filter(appointment => {
      if (showPastAppointments) return true;
      // Only show future appointments if past appointments are hidden
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      return appointmentDate >= new Date();
    })
    .map(appointment => {
      const startDate = new Date(`${appointment.date}T${appointment.time}`);
      const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes duration

      return {
        id: appointment.id,
        title: `${appointment.patientName}`,
        start: startDate,
        end: endDate,
        resource: appointment,
      };
    });

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const isPast = event.start < new Date();
    const isToday = format(event.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const isSelected = selectedAppointmentId === event.id;
    
    return {
      style: {
        backgroundColor: isPast ? '#f3f4f6' : isSelected ? '#fbbf24' : '#dcfce7',
        border: isPast ? '1px solid #d1d5db' : isSelected ? '3px solid #f59e0b' : '1px solid #22c55e',
        borderRadius: '8px',
        color: isPast ? '#6b7280' : isSelected ? '#92400e' : '#166534',
        opacity: isPast ? 0.7 : isSelected ? 1 : 1,
        fontWeight: '600',
        fontSize: '12px',
        padding: '6px',
        margin: '2px',
        cursor: 'pointer',
        textDecoration: isPast ? 'line-through' : 'none',
        boxShadow: isToday ? '0 2px 4px rgba(34, 197, 94, 0.3)' : isSelected ? '0 4px 8px rgba(251, 191, 36, 0.4)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
        pointerEvents: 'auto',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        zIndex: isSelected ? 10 : 1,
      }
    };
  }, [selectedAppointmentId]);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  }, []);

  // Move appointment to previous day
  const moveAppointmentBack = async (event: CalendarEvent) => {
    if (event.start < new Date()) {
      alert('Cannot move past appointments');
      return;
    }

    const newDate = subDays(event.start, 1);
    const hour = newDate.getHours();
    
    if (hour < 8 || hour >= 18) {
      alert('Appointments can only be scheduled between 8 AM and 6 PM');
      return;
    }

    try {
      // Optimistically update the local state first
      const updatedAppointment = {
        ...event.resource,
        date: format(newDate, 'yyyy-MM-dd'),
        time: format(newDate, 'HH:mm'),
      };

      // Update local state immediately for better UX
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === event.resource.id ? updatedAppointment : apt
        )
      );

      // Clear selection
      setSelectedAppointmentId(null);

      // Call API to update appointment
      await mockApi.updateAppointment(event.resource.id, updatedAppointment);
      
      // Refresh to ensure consistency
      await fetchAppointments();
      
      alert(`Appointment moved to ${format(newDate, 'MMM d, yyyy at h:mm a')}`);
    } catch (error) {
      console.error('Failed to move appointment:', error);
      alert('Failed to move appointment. Please try again.');
      // Revert local state on error
      await fetchAppointments();
    }
  };

  // Move appointment to next day
  const moveAppointmentForward = async (event: CalendarEvent) => {
    if (event.start < new Date()) {
      alert('Cannot move past appointments');
      return;
    }

    const newDate = addDays(event.start, 1);
    const hour = newDate.getHours();
    
    if (hour < 8 || hour >= 18) {
      alert('Appointments can only be scheduled between 8 AM and 6 PM');
      return;
    }

    try {
      // Optimistically update the local state first
      const updatedAppointment = {
        ...event.resource,
        date: format(newDate, 'yyyy-MM-dd'),
        time: format(newDate, 'HH:mm'),
      };

      // Update local state immediately for better UX
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === event.resource.id ? updatedAppointment : apt
        )
      );

      // Clear selection
      setSelectedAppointmentId(null);

      // Call API to update appointment
      await mockApi.updateAppointment(event.resource.id, updatedAppointment);
      
      // Refresh to ensure consistency
      await fetchAppointments();
      
      alert(`Appointment moved to ${format(newDate, 'MMM d, yyyy at h:mm a')}`);
    } catch (error) {
      console.error('Failed to move appointment:', error);
      alert('Failed to move appointment. Please try again.');
      // Revert local state on error
      await fetchAppointments();
    }
  };

  // Move appointment to earlier time
  const moveAppointmentEarlier = async (event: CalendarEvent) => {
    if (event.start < new Date()) {
      alert('Cannot move past appointments');
      return;
    }

    const newDate = new Date(event.start.getTime() - 30 * 60000); // 30 minutes earlier
    const hour = newDate.getHours();
    
    if (hour < 8 || hour >= 18) {
      alert('Appointments can only be scheduled between 8 AM and 6 PM');
      return;
    }

    try {
      // Optimistically update the local state first
      const updatedAppointment = {
        ...event.resource,
        date: format(newDate, 'yyyy-MM-dd'),
        time: format(newDate, 'HH:mm'),
      };

      // Update local state immediately for better UX
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === event.resource.id ? updatedAppointment : apt
        )
      );

      // Clear selection
      setSelectedAppointmentId(null);

      // Call API to update appointment
      await mockApi.updateAppointment(event.resource.id, updatedAppointment);
      
      // Refresh to ensure consistency
      await fetchAppointments();
      
      alert(`Appointment moved to ${format(newDate, 'MMM d, yyyy at h:mm a')}`);
    } catch (error) {
      console.error('Failed to move appointment:', error);
      alert('Failed to move appointment. Please try again.');
      // Revert local state on error
      await fetchAppointments();
    }
  };

  // Move appointment to later time
  const moveAppointmentLater = async (event: CalendarEvent) => {
    if (event.start < new Date()) {
      alert('Cannot move past appointments');
      return;
    }

    const newDate = new Date(event.start.getTime() + 30 * 60000); // 30 minutes later
    const hour = newDate.getHours();
    
    if (hour < 8 || hour >= 18) {
      alert('Appointments can only be scheduled between 8 AM and 6 PM');
      return;
    }

    try {
      // Optimistically update the local state first
      const updatedAppointment = {
        ...event.resource,
        date: format(newDate, 'yyyy-MM-dd'),
        time: format(newDate, 'HH:mm'),
      };

      // Update local state immediately for better UX
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === event.resource.id ? updatedAppointment : apt
        )
      );

      // Clear selection
      setSelectedAppointmentId(null);

      // Call API to update appointment
      await mockApi.updateAppointment(event.resource.id, updatedAppointment);
      
      // Refresh to ensure consistency
      await fetchAppointments();
      
      alert(`Appointment moved to ${format(newDate, 'MMM d, yyyy at h:mm a')}`);
    } catch (error) {
      console.error('Failed to move appointment:', error);
      alert('Failed to move appointment. Please try again.');
      // Revert local state on error
      await fetchAppointments();
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    try {
      await mockApi.updateAppointmentStatus(appointmentId, status);
      await fetchAppointments(); // Refresh appointments
      setIsEventModalOpen(false);
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }
    
    try {
      await mockApi.deleteAppointment(appointmentId);
      await fetchAppointments();
      setIsEventModalOpen(false);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  const handleCreatePrescription = (appointment: Appointment) => {
    setPrescriptionAppointment(appointment);
    setIsPrescriptionModalOpen(true);
    setIsEventModalOpen(false);
  };

  const handlePrescriptionSuccess = () => {
    console.log('Prescription created successfully');
  };

  const CustomEvent = useCallback(({ event }: { event: CalendarEvent }) => {
    const isPast = event.start < new Date();
    const time = format(event.start, 'h:mm a');
    const isFuture = event.start >= new Date();
    const isSelected = selectedAppointmentId === event.id;
    
    return (
      <div className="p-1 h-full">
        <div 
          className={`
            border rounded-md p-2 h-full transition-all duration-200 relative
            ${isPast ? 'bg-gray-100 border-gray-200' : 
              isSelected ? 'bg-yellow-100 border-yellow-300' : 
              'bg-green-100 border-green-200'}
          `}
          onClick={(e) => {
            e.stopPropagation();
            if (isFuture) {
              setSelectedAppointmentId(event.id);
            }
          }}
        >
          <div className={`font-semibold text-xs truncate ${
            isPast ? 'text-gray-600' : 
            isSelected ? 'text-yellow-800' : 
            'text-green-800'
          }`}>
            {event.resource.patientName}
          </div>
          <div className={`text-xs font-medium ${
            isPast ? 'text-gray-500' : 
            isSelected ? 'text-yellow-700' : 
            'text-green-700'
          }`}>
            {time}
          </div>
          <div className={`text-xs capitalize ${
            isPast ? 'text-gray-400' : 
            isSelected ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {event.resource.type}
          </div>
          {isPast && (
            <div className="text-xs text-gray-400">(Past)</div>
          )}
          {isSelected && (
            <div className="text-xs text-yellow-600 font-bold">SELECTED - Use Arrow Keys</div>
          )}
        </div>
      </div>
    );
  }, [selectedAppointmentId]);

  const CustomToolbar = useCallback(({ label, onNavigate, onView }: any) => (
    <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('PREV')}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('NEXT')}
        >
          →
        </Button>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      
      <div className="flex items-center space-x-2">
        <Button
          variant={currentView === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCurrentView('month');
            onView('month');
          }}
        >
          Month
        </Button>
        <Button
          variant={currentView === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCurrentView('week');
            onView('week');
          }}
        >
          Week
        </Button>
        <Button
          variant={currentView === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCurrentView('day');
            onView('day');
          }}
        >
          Day
        </Button>
      </div>
    </div>
  ), [currentView]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Appointment Calendar
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={showPastAppointments ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowPastAppointments(!showPastAppointments)}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {showPastAppointments ? 'Hide Past' : 'Show Past'}
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showInstructions && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Keyboard Navigation Instructions:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex items-center space-x-2">
                      <ArrowUp className="h-4 w-4" />
                      <span>• <strong>Click any future appointment</strong> to select it (turns yellow)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowUp className="h-4 w-4" />
                      <span>• <strong>↑ Arrow Up</strong> - Move appointment 30 minutes earlier</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowDown className="h-4 w-4" />
                      <span>• <strong>↓ Arrow Down</strong> - Move appointment 30 minutes later</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowLeft className="h-4 w-4" />
                      <span>• <strong>← Arrow Left</strong> - Move to previous day</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="h-4 w-4" />
                      <span>• <strong>→ Arrow Right</strong> - Move to next day</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>• <strong>Escape</strong> - Deselect appointment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>• <strong>Double-click</strong> to view appointment details</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-blue-600 border-blue-300 hover:bg-blue-50"
                    onClick={() => setShowInstructions(false)}
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div style={{ height: '800px' }} className="w-full">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              onSelectEvent={handleSelectEvent}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar,
              }}
              views={['month', 'week', 'day']}
              view={currentView}
              onView={(view: string) => setCurrentView(view as View)}
              date={currentDate}
              onNavigate={setCurrentDate}
              popup
              className="bg-white w-full h-full"
              step={30}
              timeslots={2}
              min={new Date(2024, 0, 1, 8, 0)} // 8 AM
              max={new Date(2024, 0, 1, 18, 0)} // 6 PM
              selectable
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedEvent.resource.patientName}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedEvent.resource.type}
                  </p>
                  {selectedEvent.start < new Date() && (
                    <p className="text-xs text-gray-500">(Past Appointment)</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(selectedEvent.start, 'EEEE, MMM d, yyyy - h:mm a')}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{selectedEvent.resource.patientPhone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{selectedEvent.resource.patientEmail}</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Symptoms/Reason:</span>
                <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">
                  {selectedEvent.resource.symptoms}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Badge className={
                  selectedEvent.resource.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedEvent.resource.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  selectedEvent.resource.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }>
                  {selectedEvent.resource.status.charAt(0).toUpperCase() + selectedEvent.resource.status.slice(1)}
                </Badge>
              </div>

              {selectedEvent.start >= new Date() && (
                <div className="flex space-x-2 pt-4">
                  {selectedEvent.resource.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleUpdateAppointmentStatus(selectedEvent.resource.id, 'confirmed')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Confirm
                      </Button>
                      <Button
                        onClick={() => handleUpdateAppointmentStatus(selectedEvent.resource.id, 'cancelled')}
                        variant="outline"
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {selectedEvent.resource.status === 'confirmed' && (
                    <Button
                      onClick={() => handleUpdateAppointmentStatus(selectedEvent.resource.id, 'completed')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Complete
                    </Button>
                  )}
                  {selectedEvent.resource.status === 'completed' && (
                    <Button
                      onClick={() => handleCreatePrescription(selectedEvent.resource)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Create Prescription
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteAppointment(selectedEvent.resource.id)}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PrescriptionModal
        appointment={prescriptionAppointment}
        isOpen={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          setPrescriptionAppointment(null);
        }}
        onSuccess={handlePrescriptionSuccess}
      />
    </>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { format, addDays, isAfter, isBefore, startOfDay, subDays } from 'date-fns';
import { Calendar, Clock, X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DoctorListing } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import { usePatientAuth } from '@/contexts/patient-auth-context';
import { cn } from '@/lib/utils';

interface BookingModalProps {
  doctor: DoctorListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ doctor, isOpen, onClose }: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { state } = usePatientAuth();

  // Simple form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    symptoms: '',
    type: 'consultation' as 'consultation' | 'follow-up' | 'emergency'
  });

  const generateAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      dates.push({
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEEE, MMM d, yyyy'),
        date: date
      });
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Check if a date is available
  const isDateAvailable = (date: Date) => {
    return availableDates.some(available => 
      format(available.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Get current selected date index
  const getCurrentDateIndex = () => {
    if (!formData.date) return 0;
    return availableDates.findIndex(d => d.value === formData.date);
  };

  // Navigate to next available date
  const goToNextDate = () => {
    const currentIndex = getCurrentDateIndex();
    if (currentIndex < availableDates.length - 1) {
      const nextDate = availableDates[currentIndex + 1];
      handleInputChange('date', nextDate.value);
      setSelectedDate(nextDate.date);
    }
  };

  // Navigate to previous available date
  const goToPreviousDate = () => {
    const currentIndex = getCurrentDateIndex();
    if (currentIndex > 0) {
      const prevDate = availableDates[currentIndex - 1];
      handleInputChange('date', prevDate.value);
      setSelectedDate(prevDate.date);
    }
  };

  // Quick date selection buttons
  const quickDateOptions = [
    { label: 'Tomorrow', days: 1 },
    { label: 'Day After', days: 2 },
    { label: 'This Week', days: 3 },
    { label: 'Next Week', days: 7 },
  ];

  const selectQuickDate = (days: number) => {
    const targetDate = addDays(new Date(), days);
    const availableDate = availableDates.find(d => 
      format(d.date, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd')
    );
    
    if (availableDate) {
      handleInputChange('date', availableDate.value);
      setSelectedDate(availableDate.date);
    }
  };

  // Simple validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time slot';
    }
    if (!formData.symptoms || formData.symptoms.length < 10) {
      newErrors.symptoms = 'Please describe your symptoms (minimum 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!doctor || !state.patient) return;

    setIsLoading(true);
    try {
      await mockApi.bookAppointment({
        doctorId: doctor.id,
        patientId: state.patient.id,
        patientName: `${state.patient.firstName} ${state.patient.lastName}`,
        patientEmail: state.patient.email,
        patientPhone: state.patient.phone,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        type: formData.type,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to book appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      symptoms: '',
      type: 'consultation'
    });
    setErrors({});
    setSelectedDate(null);
  };

  const handleClose = () => {
    resetForm();
    setSuccess(false);
    onClose();
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Book Appointment
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Booked!</h3>
            <p className="text-gray-600">Your appointment request has been sent to the doctor.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={doctor.avatar} alt={`Dr. ${doctor.firstName} ${doctor.lastName}`} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {doctor.firstName[0]}{doctor.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">Fee: ${doctor.consultationFee}</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-4">
                <Label htmlFor="date">Preferred Date</Label>
                
                {/* Quick Date Selection */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Quick Select:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickDateOptions.map((option) => (
                      <Button
                        key={option.days}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectQuickDate(option.days)}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Date Navigation */}
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousDate}
                    disabled={getCurrentDateIndex() <= 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.date ? format(new Date(formData.date), 'EEEE, MMM d, yyyy') : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={formData.date ? new Date(formData.date) : undefined}
                          onSelect={(date) => {
                            if (date && isDateAvailable(date)) {
                              handleInputChange('date', format(date, 'yyyy-MM-dd'));
                              setSelectedDate(date);
                            }
                          }}
                          disabled={(date) => !isDateAvailable(date)}
                          className="rounded-md border"
                          classNames={{
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 cursor-pointer",
                            day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                            day_today: "bg-blue-100 text-blue-900",
                            day_disabled: "text-gray-400 cursor-not-allowed opacity-50",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToNextDate}
                    disabled={getCurrentDateIndex() >= availableDates.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Available Dates List */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Available dates:</p>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {availableDates.map((date) => (
                      <Button
                        key={date.value}
                        type="button"
                        variant={formData.date === date.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          handleInputChange('date', date.value);
                          setSelectedDate(date.date);
                        }}
                        className="text-xs justify-start"
                      >
                        {format(date.date, 'MMM d')}
                      </Button>
                    ))}
                  </div>
                </div>

                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time Slot</Label>
                <Select onValueChange={(value) => handleInputChange('time', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctor.availableSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && (
                  <p className="text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select onValueChange={(value) => handleInputChange('type', value as 'consultation' | 'follow-up' | 'emergency')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms / Reason for Visit</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                  className="min-h-[80px]"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange('symptoms', e.target.value)}
                />
                {errors.symptoms && (
                  <p className="text-sm text-red-600">{errors.symptoms}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Booking...</span>
                    </div>
                  ) : (
                    'Book Appointment'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
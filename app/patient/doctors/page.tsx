'use client';

import { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientProtectedRoute } from '@/components/patient/patient-protected-route';
import { PatientNavbar } from '@/components/patient/patient-navbar';
import { BookingModal } from '@/components/patient/booking-modal';
import { DoctorListing } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

const specializations = [
  'All Specializations',
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Pediatric',
  'Gynecologist',
  'Psychiatrist',
  'ENT Specialist',
  'Ophthalmologist',
  'Urologist',
  'Gastroenterologist'
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorListing | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const specialization = selectedSpecialization === 'All Specializations' ? undefined : selectedSpecialization;
        const data = await mockApi.getDoctors(specialization);
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.clinicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = (doctor: DoctorListing) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
            <p className="text-gray-600 mt-2">Book appointments with qualified healthcare professionals</p>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, specialization, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <p className="text-gray-500">No doctors found matching your criteria</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={doctor.avatar} alt={`Dr. ${doctor.firstName} ${doctor.lastName}`} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                          {doctor.firstName[0]}{doctor.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </CardTitle>
                        <Badge className="bg-blue-100 text-blue-800 mt-1">
                          {doctor.specialization}
                        </Badge>
                        <div className="flex items-center space-x-1 mt-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{doctor.rating}</span>
                          <span className="text-sm text-gray-500">({doctor.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{doctor.clinicName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>Consultation: ${doctor.consultationFee}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => handleBookAppointment(doctor)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <BookingModal
            doctor={selectedDoctor}
            isOpen={isBookingModalOpen}
            onClose={() => {
              setIsBookingModalOpen(false);
              setSelectedDoctor(null);
            }}
          />
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
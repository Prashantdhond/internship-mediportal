'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Users, Phone, Mail, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Patient } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await mockApi.getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGenderColor = (gender: Patient['gender']) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      case 'other': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-2">Manage your patient records</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <LoadingSpinner />
            </div>
          ) : filteredPatients.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No patients found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{patient.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getGenderColor(patient.gender)}>
                            {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">{patient.age} years</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Last visit: {format(new Date(patient.lastVisit), 'MMM d, yyyy')}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Visits:</span>
                        <span className="font-medium text-gray-900">{patient.totalVisits}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/patients/${patient.id}`}>View Profile</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/patients/${patient.id}/history`}>Medical History</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
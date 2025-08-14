'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Calendar, Clock, FileText, Pill, Stethoscope, User } from 'lucide-react';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Appointment, Patient, Prescription } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

export default function PatientMedicalHistoryPage() {
  const params = useParams();
  const patientId = Array.isArray(params?.patientId) ? params?.patientId[0] : (params?.patientId as string);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsList, patientAppointments, patientPrescriptions] = await Promise.all([
          mockApi.getPatients(),
          mockApi.getPatientAppointments(patientId),
          mockApi.getPrescriptions(patientId),
        ]);
        setPatient(patientsList.find((p) => p.id === patientId) || null);
        setAppointments(patientAppointments);
        setPrescriptions(patientPrescriptions);
      } catch (error) {
        console.error('Failed to load patient medical history', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (patientId) loadData();
  }, [patientId]);

  const historyEntries = useMemo(() => {
    // Build entries from past/completed appointments, newest first
    const now = new Date();
    const pastAppointments = appointments
      .filter((apt) => new Date(`${apt.date}T${apt.time}`) < now || apt.status === 'completed')
      .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

    return pastAppointments.map((apt) => {
      const matchedPrescription = prescriptions.find((p) => p.appointmentId === apt.id) ||
        prescriptions.find((p) => p.date === apt.date);
      return { appointment: apt, prescription: matchedPrescription } as { appointment: Appointment; prescription?: Prescription };
    });
  }, [appointments, prescriptions]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Medical History</h1>
              <p className="text-gray-600 mt-2">Chronological view of past visits, diagnoses, and prescriptions</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/patients">
                  <Stethoscope className="h-4 w-4 mr-2" /> Patients
                </Link>
              </Button>
              {patientId && (
                <Button asChild>
                  <Link href={`/patients/${patientId}`}>
                    <User className="h-4 w-4 mr-2" /> View Profile
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-60"><LoadingSpinner /></div>
          ) : !patient ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">Patient not found.</CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{patient.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-700">
                  <div>Age: <span className="font-medium">{patient.age}</span></div>
                  <div>Gender: <span className="font-medium capitalize">{patient.gender}</span></div>
                  <div>Email: <span className="font-medium">{patient.email}</span></div>
                  <div>Phone: <span className="font-medium">{patient.phone}</span></div>
                </CardContent>
              </Card>

              {historyEntries.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-600">No past medical history available.</CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {historyEntries.map(({ appointment, prescription }) => (
                    <Card key={appointment.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(`${appointment.date}T${appointment.time}`), 'EEEE, MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(`${appointment.date}T${appointment.time}`), 'h:mm a')}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500 mb-1">Symptoms/Reason</p>
                            <p className="text-gray-800">{appointment.symptoms}</p>
                          </div>

                          {prescription ? (
                            <div className="border rounded-md">
                              <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                                <div className="font-medium flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Diagnosis
                                </div>
                                <div className="text-sm text-gray-500">{format(new Date(prescription.createdAt), 'MMM d, yyyy')}</div>
                              </div>
                              <div className="p-4 space-y-4">
                                <div>
                                  <p className="text-gray-800">{prescription.diagnosis}</p>
                                  {prescription.instructions && (
                                    <p className="text-sm text-gray-600 mt-1">{prescription.instructions}</p>
                                  )}
                                </div>

                                {prescription.medications?.length ? (
                                  <div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                      <Pill className="h-4 w-4" /> Medications
                                    </div>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Name</TableHead>
                                          <TableHead>Dosage</TableHead>
                                          <TableHead>Frequency</TableHead>
                                          <TableHead>Duration</TableHead>
                                          <TableHead>Instructions</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {prescription.medications.map((med) => (
                                          <TableRow key={med.id}>
                                            <TableCell className="font-medium">{med.name}</TableCell>
                                            <TableCell>{med.dosage}</TableCell>
                                            <TableCell>{med.frequency}</TableCell>
                                            <TableCell>{med.duration}</TableCell>
                                            <TableCell>{med.instructions}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600">No prescription recorded for this visit.</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}



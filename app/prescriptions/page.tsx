'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Pill, Calendar, User, Search, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { Prescription } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await mockApi.getPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error('Failed to fetch prescriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications.some(med => med.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && prescription.status === activeTab;
  });

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
            <p className="text-gray-600 mt-2">Manage patient prescriptions and medications</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prescriptions by patient name, diagnosis, or medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <LoadingSpinner />
                </div>
              ) : filteredPrescriptions.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No prescriptions found</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredPrescriptions.map((prescription) => (
                    <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {prescription.patientName}
                              </h3>
                              <Badge className={getStatusColor(prescription.status)}>
                                {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {format(new Date(prescription.date), 'EEEE, MMM d, yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Pill className="h-4 w-4" />
                                <span>
                                  {prescription.medications.length} medication(s)
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <User className="h-4 w-4" />
                                <span>{prescription.patientEmail}</span>
                              </div>
                              {prescription.followUpDate && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Calendar className="h-4 w-4" />
                                  <span>Follow-up: {format(new Date(prescription.followUpDate), 'MMM d, yyyy')}</span>
                                </div>
                              )}
                            </div>

                            <div className="mb-4">
                              <p className="text-sm text-gray-500 mb-1">Diagnosis:</p>
                              <p className="text-gray-700">{prescription.diagnosis}</p>
                            </div>

                            <div>
                              <p className="text-sm text-gray-500 mb-1">Medications:</p>
                              <div className="flex flex-wrap gap-2">
                                {prescription.medications.slice(0, 3).map((medication) => (
                                  <Badge key={medication.id} variant="outline" className="text-xs">
                                    {medication.name} ({medication.dosage})
                                  </Badge>
                                ))}
                                {prescription.medications.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{prescription.medications.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPrescription(prescription)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        {/* View Prescription Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>
            
            {selectedPrescription && (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{selectedPrescription.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(selectedPrescription.date), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(selectedPrescription.status)}>
                        {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedPrescription.diagnosis}
                  </p>
                </div>

                {/* Medications */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Medications</h3>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((medication, index) => (
                      <div key={medication.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{medication.name}</h4>
                          <Badge variant="outline">{medication.dosage}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Frequency:</span> {medication.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {medication.duration}
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span> {medication.quantity} {medication.unit}
                          </div>
                        </div>
                        {medication.instructions && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Instructions:</span> {medication.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Instructions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">General Instructions</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedPrescription.instructions}
                  </p>
                </div>

                {/* Follow-up Date */}
                {selectedPrescription.followUpDate && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Follow-up Date</h3>
                    <p className="text-gray-700">
                      {format(new Date(selectedPrescription.followUpDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                      {selectedPrescription.notes}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-500">
                  <div>
                    Created: {format(new Date(selectedPrescription.createdAt), 'MMM d, yyyy h:mm a')}
                  </div>
                  <div>
                    Updated: {format(new Date(selectedPrescription.updatedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
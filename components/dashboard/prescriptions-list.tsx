'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Pill, Calendar, User, FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Prescription } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

export function PrescriptionsList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

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

  const handleViewPrescription = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsViewModalOpen(true);
  };

  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Pill className="h-5 w-5" />
            <span>Recent Prescriptions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prescriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No prescriptions found</p>
            ) : (
              prescriptions.slice(0, 5).map((prescription) => (
                <div
                  key={prescription.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {prescription.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(prescription.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {prescription.diagnosis}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {prescription.medications.length} medication(s)
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(prescription.status)}>
                      <span className="capitalize">{prescription.status}</span>
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPrescription(prescription)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Prescription Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          
          {selectedPrescription && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{selectedPrescription.patientName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(new Date(selectedPrescription.date), 'MMMM d, yyyy')}</span>
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

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <Badge className={`ml-2 ${getStatusColor(selectedPrescription.status)}`}>
                    {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Created: {format(new Date(selectedPrescription.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
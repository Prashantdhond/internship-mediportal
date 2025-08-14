'use client';

import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Appointment, Medication } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from '@/contexts/auth-context';

interface PrescriptionModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PrescriptionModal({ appointment, isOpen, onClose, onSuccess }: PrescriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state } = useAuth();

  const [formData, setFormData] = useState({
    diagnosis: '',
    instructions: '',
    followUpDate: '',
    notes: '',
    medications: [
      {
        id: '1',
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 0,
        unit: 'tablets'
      }
    ] as Medication[]
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.diagnosis || formData.diagnosis.length < 5) {
      newErrors.diagnosis = 'Diagnosis must be at least 5 characters';
    }
    if (!formData.instructions || formData.instructions.length < 10) {
      newErrors.instructions = 'Instructions must be at least 10 characters';
    }
    
    // Validate medications
    formData.medications.forEach((med, index) => {
      if (!med.name) {
        newErrors[`medication_${index}_name`] = 'Medicine name is required';
      }
      if (!med.dosage) {
        newErrors[`medication_${index}_dosage`] = 'Dosage is required';
      }
      if (!med.frequency) {
        newErrors[`medication_${index}_frequency`] = 'Frequency is required';
      }
      if (!med.duration) {
        newErrors[`medication_${index}_duration`] = 'Duration is required';
      }
      if (!med.quantity || med.quantity <= 0) {
        newErrors[`medication_${index}_quantity`] = 'Quantity must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
    
    const errorKey = `medication_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      quantity: 0,
      unit: 'tablets'
    };
    
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication]
    }));
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !appointment || !state.doctor) return;

    setIsLoading(true);
    try {
      await mockApi.createPrescription({
        doctorId: state.doctor.id,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        appointmentId: appointment.id,
        date: new Date().toISOString().split('T')[0],
        diagnosis: formData.diagnosis,
        medications: formData.medications,
        instructions: formData.instructions,
        followUpDate: formData.followUpDate || undefined,
        status: 'active',
        notes: formData.notes || undefined
      });
      
      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create prescription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      diagnosis: '',
      instructions: '',
      followUpDate: '',
      notes: '',
      medications: [
        {
          id: '1',
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          quantity: 0,
          unit: 'tablets'
        }
      ]
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Prescription</DialogTitle>
          <p className="text-sm text-gray-600">
            Patient: {appointment.patientName} | Date: {appointment.date}
          </p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Diagnosis */}
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Textarea
              id="diagnosis"
              placeholder="Enter the diagnosis..."
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              className="min-h-[80px]"
            />
            {errors.diagnosis && (
              <p className="text-sm text-red-600">{errors.diagnosis}</p>
            )}
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Medications *</Label>
              <Button
                type="button"
                onClick={addMedication}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Medicine
              </Button>
            </div>

            {formData.medications.map((medication, index) => (
              <div key={medication.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Medicine {index + 1}</h4>
                  {formData.medications.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMedication(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Medicine Name *</Label>
                    <Input
                      placeholder="e.g., Paracetamol"
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    />
                    {errors[`medication_${index}_name`] && (
                      <p className="text-sm text-red-600">{errors[`medication_${index}_name`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input
                      placeholder="e.g., 500mg"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    />
                    {errors[`medication_${index}_dosage`] && (
                      <p className="text-sm text-red-600">{errors[`medication_${index}_dosage`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency *</Label>
                    <Select onValueChange={(value) => handleMedicationChange(index, 'frequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                        <SelectItem value="Four times daily">Four times daily</SelectItem>
                        <SelectItem value="Every 4 hours">Every 4 hours</SelectItem>
                        <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                        <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors[`medication_${index}_frequency`] && (
                      <p className="text-sm text-red-600">{errors[`medication_${index}_frequency`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Duration *</Label>
                    <Input
                      placeholder="e.g., 7 days"
                      value={medication.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    />
                    {errors[`medication_${index}_duration`] && (
                      <p className="text-sm text-red-600">{errors[`medication_${index}_duration`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 14"
                      value={medication.quantity || ''}
                      onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                    {errors[`medication_${index}_quantity`] && (
                      <p className="text-sm text-red-600">{errors[`medication_${index}_quantity`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select onValueChange={(value) => handleMedicationChange(index, 'unit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tablets">Tablets</SelectItem>
                        <SelectItem value="capsules">Capsules</SelectItem>
                        <SelectItem value="ml">ML</SelectItem>
                        <SelectItem value="drops">Drops</SelectItem>
                        <SelectItem value="sachets">Sachets</SelectItem>
                        <SelectItem value="injections">Injections</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Special Instructions</Label>
                  <Input
                    placeholder="e.g., Take with food, Take before meals"
                    value={medication.instructions}
                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* General Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">General Instructions *</Label>
            <Textarea
              id="instructions"
              placeholder="General instructions for the patient..."
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              className="min-h-[80px]"
            />
            {errors.instructions && (
              <p className="text-sm text-red-600">{errors.instructions}</p>
            )}
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followUpDate">Follow-up Date (Optional)</Label>
            <Input
              id="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={(e) => handleInputChange('followUpDate', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
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
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Create Prescription</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
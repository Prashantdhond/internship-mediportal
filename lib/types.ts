export interface Doctor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experience: number;
  phone: string;
  clinicName: string;
  clinicAddress: string;
  qualifications: string[];
  avatar?: string;
  isProfileComplete: boolean;
  registrationNumber: string;
  consultationFee: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  lastVisit: string;
  totalVisits: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;
  type: 'consultation' | 'follow-up' | 'emergency';
}

export interface PatientUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  medicalHistory?: string;
  allergies?: string;
  emergencyContact?: string;
}

export interface DoctorListing {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experience: number;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  clinicName: string;
  clinicAddress: string;
  avatar?: string;
  availableSlots: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  unit: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  appointmentId?: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  instructions: string;
  followUpDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
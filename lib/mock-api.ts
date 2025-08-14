import { Doctor, Appointment, Patient, PatientUser, DoctorListing, Prescription, Medication } from './types';

// Mock data
const mockDoctor: Doctor = {
  id: '1',
  email: 'dr.smith@example.com',
  firstName: 'John',
  lastName: 'Smith',
  specialization: 'Cardiologist',
  experience: 8,
  phone: '+1234567890',
  clinicName: 'Heart Care Clinic',
  clinicAddress: '123 Medical Center, Health City',
  qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
  isProfileComplete: true,
  registrationNumber: 'MED12345',
  consultationFee: 150,
  avatar: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=400'
};

const mockDoctors: DoctorListing[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    specialization: 'Cardiologist',
    experience: 8,
    consultationFee: 150,
    rating: 4.8,
    totalReviews: 124,
    clinicName: 'Heart Care Clinic',
    clinicAddress: '123 Medical Center, Health City',
    avatar: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    specialization: 'Dermatologist',
    experience: 6,
    consultationFee: 120,
    rating: 4.9,
    totalReviews: 89,
    clinicName: 'Skin Health Center',
    clinicAddress: '456 Wellness Ave, Medical District',
    avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableSlots: ['09:30', '11:00', '13:00', '15:30', '17:00']
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    specialization: 'Neurologist',
    experience: 12,
    consultationFee: 200,
    rating: 4.7,
    totalReviews: 156,
    clinicName: 'Brain & Spine Institute',
    clinicAddress: '789 Neuro Plaza, Health City',
    avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
    availableSlots: ['08:00', '10:30', '14:00', '16:30']
  }
];

const mockPatientUser: PatientUser = {
  id: '1',
  email: 'patient@example.com',
  firstName: 'Alice',
  lastName: 'Johnson',
  phone: '+1234567891',
  age: 32,
  gender: 'female',
  medicalHistory: 'No major medical history',
  allergies: 'None known',
  emergencyContact: '+1234567899'
};

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    patientId: '1',
    patientName: 'Alice Johnson',
    patientEmail: 'alice@example.com',
    patientPhone: '+1234567891',
    date: '2025-01-20',
    time: '10:00',
    status: 'pending',
    symptoms: 'Chest pain and shortness of breath',
    type: 'consultation'
  },
  {
    id: '2',
    doctorId: '1',
    patientId: '2',
    patientName: 'Bob Wilson',
    patientEmail: 'bob@example.com',
    patientPhone: '+1234567892',
    date: '2025-01-20',
    time: '14:00',
    status: 'confirmed',
    symptoms: 'Regular checkup and blood pressure monitoring',
    type: 'follow-up'
  },
  {
    id: '3',
    doctorId: '1',
    patientId: '3',
    patientName: 'Carol Davis',
    patientEmail: 'carol@example.com',
    patientPhone: '+1234567893',
    date: '2025-01-21',
    time: '09:00',
    status: 'completed',
    symptoms: 'Heart palpitations and dizziness',
    type: 'consultation'
  },
  {
    id: '4',
    doctorId: '1',
    patientId: '4',
    patientName: 'David Miller',
    patientEmail: 'david@example.com',
    patientPhone: '+1234567894',
    date: '2025-01-22',
    time: '11:30',
    status: 'cancelled',
    symptoms: 'Annual physical examination',
    type: 'consultation'
  },
  // Current month appointments (January 2025)
  {
    id: '11',
    doctorId: '1',
    patientId: '11',
    patientName: 'Sarah Williams',
    patientEmail: 'sarah@example.com',
    patientPhone: '+1234567801',
    date: '2025-01-15',
    time: '09:30',
    status: 'completed',
    symptoms: 'Annual heart health checkup',
    type: 'consultation'
  },
  {
    id: '12',
    doctorId: '1',
    patientId: '12',
    patientName: 'Michael Brown',
    patientEmail: 'michael@example.com',
    patientPhone: '+1234567802',
    date: '2025-01-16',
    time: '14:15',
    status: 'completed',
    symptoms: 'Blood pressure monitoring',
    type: 'follow-up'
  },
  {
    id: '13',
    doctorId: '1',
    patientId: '13',
    patientName: 'Lisa Garcia',
    patientEmail: 'lisa@example.com',
    patientPhone: '+1234567803',
    date: '2025-01-17',
    time: '10:45',
    status: 'confirmed',
    symptoms: 'Chest discomfort evaluation',
    type: 'consultation'
  },
  {
    id: '14',
    doctorId: '1',
    patientId: '14',
    patientName: 'Robert Taylor',
    patientEmail: 'robert@example.com',
    patientPhone: '+1234567804',
    date: '2025-01-18',
    time: '16:00',
    status: 'pending',
    symptoms: 'Cardiac stress test',
    type: 'consultation'
  },
  {
    id: '15',
    doctorId: '1',
    patientId: '15',
    patientName: 'Jennifer Martinez',
    patientEmail: 'jennifer@example.com',
    patientPhone: '+1234567805',
    date: '2025-01-19',
    time: '11:00',
    status: 'confirmed',
    symptoms: 'EKG and heart rhythm analysis',
    type: 'consultation'
  },
  {
    id: '16',
    doctorId: '1',
    patientId: '16',
    patientName: 'Thomas Anderson',
    patientEmail: 'thomas@example.com',
    patientPhone: '+1234567806',
    date: '2025-01-23',
    time: '13:30',
    status: 'pending',
    symptoms: 'Post-surgery follow-up',
    type: 'follow-up'
  },
  {
    id: '17',
    doctorId: '1',
    patientId: '17',
    patientName: 'Amanda Clark',
    patientEmail: 'amanda@example.com',
    patientPhone: '+1234567807',
    date: '2025-01-24',
    time: '09:00',
    status: 'confirmed',
    symptoms: 'Hypertension management',
    type: 'consultation'
  },
  {
    id: '18',
    doctorId: '1',
    patientId: '18',
    patientName: 'Daniel White',
    patientEmail: 'daniel@example.com',
    patientPhone: '+1234567808',
    date: '2025-01-25',
    time: '15:45',
    status: 'pending',
    symptoms: 'Heart palpitations',
    type: 'consultation'
  },
  {
    id: '19',
    doctorId: '1',
    patientId: '19',
    patientName: 'Emily Rodriguez',
    patientEmail: 'emily@example.com',
    patientPhone: '+1234567809',
    date: '2025-01-26',
    time: '10:30',
    status: 'confirmed',
    symptoms: 'Annual physical examination',
    type: 'consultation'
  },
  {
    id: '20',
    doctorId: '1',
    patientId: '20',
    patientName: 'Christopher Lee',
    patientEmail: 'christopher@example.com',
    patientPhone: '+1234567810',
    date: '2025-01-27',
    time: '14:00',
    status: 'pending',
    symptoms: 'Chest pain evaluation',
    type: 'consultation'
  },
  {
    id: '21',
    doctorId: '1',
    patientId: '21',
    patientName: 'Nicole Johnson',
    patientEmail: 'nicole@example.com',
    patientPhone: '+1234567811',
    date: '2025-01-28',
    time: '11:15',
    status: 'confirmed',
    symptoms: 'Blood pressure check',
    type: 'follow-up'
  },
  {
    id: '22',
    doctorId: '1',
    patientId: '22',
    patientName: 'Kevin Davis',
    patientEmail: 'kevin@example.com',
    patientPhone: '+1234567812',
    date: '2025-01-29',
    time: '16:30',
    status: 'pending',
    symptoms: 'Cardiac consultation',
    type: 'consultation'
  },
  {
    id: '23',
    doctorId: '1',
    patientId: '23',
    patientName: 'Rachel Wilson',
    patientEmail: 'rachel@example.com',
    patientPhone: '+1234567813',
    date: '2025-01-30',
    time: '09:45',
    status: 'confirmed',
    symptoms: 'Heart health review',
    type: 'consultation'
  },
  // Today's appointments (January 30, 2025)
  {
    id: '32',
    doctorId: '1',
    patientId: '32',
    patientName: 'Emma Thompson',
    patientEmail: 'emma@example.com',
    patientPhone: '+1234567822',
    date: '2025-01-30',
    time: '08:00',
    status: 'confirmed',
    symptoms: 'Morning blood pressure check',
    type: 'consultation'
  },
  {
    id: '33',
    doctorId: '1',
    patientId: '33',
    patientName: 'Lucas Anderson',
    patientEmail: 'lucas@example.com',
    patientPhone: '+1234567823',
    date: '2025-01-30',
    time: '10:30',
    status: 'pending',
    symptoms: 'Chest pain evaluation',
    type: 'emergency'
  },
  {
    id: '34',
    doctorId: '1',
    patientId: '34',
    patientName: 'Isabella Garcia',
    patientEmail: 'isabella@example.com',
    patientPhone: '+1234567824',
    date: '2025-01-30',
    time: '12:15',
    status: 'confirmed',
    symptoms: 'Cardiac stress test',
    type: 'consultation'
  },
  {
    id: '35',
    doctorId: '1',
    patientId: '35',
    patientName: 'Mason Lee',
    patientEmail: 'mason@example.com',
    patientPhone: '+1234567825',
    date: '2025-01-30',
    time: '14:45',
    status: 'pending',
    symptoms: 'Heart palpitations',
    type: 'consultation'
  },
  {
    id: '36',
    doctorId: '1',
    patientId: '36',
    patientName: 'Sophia Chen',
    patientEmail: 'sophia.chen@example.com',
    patientPhone: '+1234567826',
    date: '2025-01-30',
    time: '16:00',
    status: 'confirmed',
    symptoms: 'Annual physical examination',
    type: 'consultation'
  },
  // Tomorrow's appointments (January 31, 2025)
  {
    id: '24',
    doctorId: '1',
    patientId: '24',
    patientName: 'Maria Gonzalez',
    patientEmail: 'maria@example.com',
    patientPhone: '+1234567814',
    date: '2025-01-31',
    time: '08:30',
    status: 'confirmed',
    symptoms: 'Chest pain and shortness of breath',
    type: 'emergency'
  },
  {
    id: '25',
    doctorId: '1',
    patientId: '25',
    patientName: 'James Thompson',
    patientEmail: 'james@example.com',
    patientPhone: '+1234567815',
    date: '2025-01-31',
    time: '10:15',
    status: 'pending',
    symptoms: 'Blood pressure monitoring',
    type: 'follow-up'
  },
  {
    id: '26',
    doctorId: '1',
    patientId: '26',
    patientName: 'Sophia Rodriguez',
    patientEmail: 'sophia@example.com',
    patientPhone: '+1234567816',
    date: '2025-01-31',
    time: '13:45',
    status: 'confirmed',
    symptoms: 'Cardiac stress test',
    type: 'consultation'
  },
  {
    id: '27',
    doctorId: '1',
    patientId: '27',
    patientName: 'William Chen',
    patientEmail: 'william@example.com',
    patientPhone: '+1234567817',
    date: '2025-01-31',
    time: '15:30',
    status: 'pending',
    symptoms: 'Heart palpitations evaluation',
    type: 'consultation'
  },
  // Day after tomorrow's appointments (February 1, 2025)
  {
    id: '28',
    doctorId: '1',
    patientId: '28',
    patientName: 'Olivia Martinez',
    patientEmail: 'olivia@example.com',
    patientPhone: '+1234567818',
    date: '2025-02-01',
    time: '09:00',
    status: 'confirmed',
    symptoms: 'Annual heart health checkup',
    type: 'consultation'
  },
  {
    id: '29',
    doctorId: '1',
    patientId: '29',
    patientName: 'Ethan Davis',
    patientEmail: 'ethan@example.com',
    patientPhone: '+1234567819',
    date: '2025-02-01',
    time: '11:30',
    status: 'pending',
    symptoms: 'Hypertension management',
    type: 'follow-up'
  },
  {
    id: '30',
    doctorId: '1',
    patientId: '30',
    patientName: 'Ava Johnson',
    patientEmail: 'ava@example.com',
    patientPhone: '+1234567820',
    date: '2025-02-01',
    time: '14:00',
    status: 'confirmed',
    symptoms: 'EKG and heart rhythm analysis',
    type: 'consultation'
  },
  {
    id: '31',
    doctorId: '1',
    patientId: '31',
    patientName: 'Noah Wilson',
    patientEmail: 'noah@example.com',
    patientPhone: '+1234567821',
    date: '2025-02-01',
    time: '16:15',
    status: 'pending',
    symptoms: 'Chest discomfort evaluation',
    type: 'consultation'
  },
  // August 2025 appointments
  {
    id: '37',
    doctorId: '1',
    patientId: '37',
    patientName: 'Alexander Rodriguez',
    patientEmail: 'alexander@example.com',
    patientPhone: '+1234567827',
    date: '2025-08-04',
    time: '09:00',
    status: 'confirmed',
    symptoms: 'Annual heart health checkup',
    type: 'consultation'
  },
  {
    id: '38',
    doctorId: '1',
    patientId: '38',
    patientName: 'Victoria Chen',
    patientEmail: 'victoria@example.com',
    patientPhone: '+1234567828',
    date: '2025-08-04',
    time: '11:30',
    status: 'pending',
    symptoms: 'Blood pressure monitoring',
    type: 'follow-up'
  },
  {
    id: '39',
    doctorId: '1',
    patientId: '39',
    patientName: 'Benjamin Thompson',
    patientEmail: 'benjamin@example.com',
    patientPhone: '+1234567829',
    date: '2025-08-04',
    time: '14:15',
    status: 'confirmed',
    symptoms: 'Chest pain evaluation',
    type: 'emergency'
  },
  {
    id: '40',
    doctorId: '1',
    patientId: '40',
    patientName: 'Chloe Martinez',
    patientEmail: 'chloe@example.com',
    patientPhone: '+1234567830',
    date: '2025-08-04',
    time: '16:00',
    status: 'pending',
    symptoms: 'Cardiac stress test',
    type: 'consultation'
  },
  {
    id: '41',
    doctorId: '1',
    patientId: '41',
    patientName: 'Daniel Garcia',
    patientEmail: 'daniel.garcia@example.com',
    patientPhone: '+1234567831',
    date: '2025-08-06',
    time: '08:30',
    status: 'confirmed',
    symptoms: 'Heart palpitations evaluation',
    type: 'consultation'
  },
  {
    id: '42',
    doctorId: '1',
    patientId: '42',
    patientName: 'Sophia Lee',
    patientEmail: 'sophia.lee@example.com',
    patientPhone: '+1234567832',
    date: '2025-08-06',
    time: '10:45',
    status: 'pending',
    symptoms: 'Hypertension management',
    type: 'follow-up'
  },
  {
    id: '43',
    doctorId: '1',
    patientId: '43',
    patientName: 'Michael Johnson',
    patientEmail: 'michael.j@example.com',
    patientPhone: '+1234567833',
    date: '2025-08-08',
    time: '13:00',
    status: 'confirmed',
    symptoms: 'EKG and heart rhythm analysis',
    type: 'consultation'
  },
  {
    id: '44',
    doctorId: '1',
    patientId: '44',
    patientName: 'Emma Davis',
    patientEmail: 'emma.davis@example.com',
    patientPhone: '+1234567834',
    date: '2025-08-08',
    time: '15:30',
    status: 'pending',
    symptoms: 'Annual physical examination',
    type: 'consultation'
  },
  {
    id: '45',
    doctorId: '1',
    patientId: '45',
    patientName: 'William Brown',
    patientEmail: 'william.brown@example.com',
    patientPhone: '+1234567835',
    date: '2025-08-11',
    time: '09:15',
    status: 'confirmed',
    symptoms: 'Chest discomfort evaluation',
    type: 'consultation'
  },
  {
    id: '46',
    doctorId: '1',
    patientId: '46',
    patientName: 'Olivia Wilson',
    patientEmail: 'olivia.wilson@example.com',
    patientPhone: '+1234567836',
    date: '2025-08-11',
    time: '11:00',
    status: 'pending',
    symptoms: 'Blood pressure check',
    type: 'follow-up'
  },
  {
    id: '47',
    doctorId: '1',
    patientId: '47',
    patientName: 'James Anderson',
    patientEmail: 'james.anderson@example.com',
    patientPhone: '+1234567837',
    date: '2025-08-13',
    time: '14:45',
    status: 'confirmed',
    symptoms: 'Cardiac consultation',
    type: 'consultation'
  },
  {
    id: '48',
    doctorId: '1',
    patientId: '48',
    patientName: 'Ava Taylor',
    patientEmail: 'ava.taylor@example.com',
    patientPhone: '+1234567838',
    date: '2025-08-13',
    time: '16:30',
    status: 'pending',
    symptoms: 'Heart health review',
    type: 'consultation'
  },
  {
    id: '49',
    doctorId: '1',
    patientId: '49',
    patientName: 'Lucas Martinez',
    patientEmail: 'lucas.martinez@example.com',
    patientPhone: '+1234567839',
    date: '2025-08-15',
    time: '08:00',
    status: 'confirmed',
    symptoms: 'Morning blood pressure check',
    type: 'consultation'
  },
  {
    id: '50',
    doctorId: '1',
    patientId: '50',
    patientName: 'Isabella Clark',
    patientEmail: 'isabella.clark@example.com',
    patientPhone: '+1234567840',
    date: '2025-08-15',
    time: '10:30',
    status: 'pending',
    symptoms: 'Chest pain evaluation',
    type: 'emergency'
  },
  // Past appointments for demonstration
  {
    id: '5',
    doctorId: '1',
    patientId: '5',
    patientName: 'Emma Thompson',
    patientEmail: 'emma@example.com',
    patientPhone: '+1234567895',
    date: '2024-12-15',
    time: '10:00',
    status: 'completed',
    symptoms: 'Chest pain evaluation',
    type: 'consultation'
  },
  {
    id: '6',
    doctorId: '1',
    patientId: '6',
    patientName: 'Frank Anderson',
    patientEmail: 'frank@example.com',
    patientPhone: '+1234567896',
    date: '2024-12-10',
    time: '14:30',
    status: 'completed',
    symptoms: 'Post-surgery follow-up',
    type: 'follow-up'
  },
  {
    id: '7',
    doctorId: '1',
    patientId: '7',
    patientName: 'Grace Lee',
    patientEmail: 'grace@example.com',
    patientPhone: '+1234567897',
    date: '2024-12-05',
    time: '09:15',
    status: 'completed',
    symptoms: 'Blood pressure check',
    type: 'consultation'
  },
  {
    id: '8',
    doctorId: '1',
    patientId: '8',
    patientName: 'Henry Brown',
    patientEmail: 'henry@example.com',
    patientPhone: '+1234567898',
    date: '2024-11-28',
    time: '16:00',
    status: 'completed',
    symptoms: 'Cardiac stress test',
    type: 'consultation'
  },
  {
    id: '9',
    doctorId: '1',
    patientId: '9',
    patientName: 'Ivy Chen',
    patientEmail: 'ivy@example.com',
    patientPhone: '+1234567899',
    date: '2024-11-20',
    time: '11:00',
    status: 'completed',
    symptoms: 'EKG and heart monitoring',
    type: 'consultation'
  },
  {
    id: '10',
    doctorId: '1',
    patientId: '10',
    patientName: 'Jack Smith',
    patientEmail: 'jack@example.com',
    patientPhone: '+1234567800',
    date: '2024-11-15',
    time: '13:45',
    status: 'completed',
    symptoms: 'Annual physical and heart health review',
    type: 'consultation'
  }
];

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+1234567891',
    age: 32,
    gender: 'female',
    lastVisit: '2025-01-15',
    totalVisits: 3
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1234567892',
    age: 52,
    gender: 'male',
    lastVisit: '2025-01-10',
    totalVisits: 7
  }
];

// Mock Prescription Data
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    doctorId: '1',
    patientId: '1',
    patientName: 'Alice Johnson',
    patientEmail: 'alice@example.com',
    appointmentId: '1',
    date: '2025-01-20',
    diagnosis: 'Hypertension and mild chest pain',
    medications: [
      {
        id: 'med1',
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning with food',
        quantity: 30,
        unit: 'tablets'
      },
      {
        id: 'med2',
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with water after meals',
        quantity: 30,
        unit: 'tablets'
      }
    ],
    instructions: 'Monitor blood pressure daily. Avoid high-sodium foods. Exercise regularly.',
    followUpDate: '2025-02-20',
    status: 'active',
    notes: 'Patient shows improvement in blood pressure readings',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z'
  },
  {
    id: '2',
    doctorId: '1',
    patientId: '2',
    patientName: 'Bob Wilson',
    patientEmail: 'bob@example.com',
    appointmentId: '2',
    date: '2025-01-20',
    diagnosis: 'Atrial fibrillation',
    medications: [
      {
        id: 'med3',
        name: 'Warfarin',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take at the same time daily. Regular INR monitoring required.',
        quantity: 90,
        unit: 'tablets'
      },
      {
        id: 'med4',
        name: 'Metoprolol',
        dosage: '25mg',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with meals',
        quantity: 180,
        unit: 'tablets'
      }
    ],
    instructions: 'Regular INR testing every 2 weeks. Avoid alcohol and certain foods.',
    followUpDate: '2025-04-20',
    status: 'active',
    notes: 'Patient needs close monitoring for INR levels',
    createdAt: '2025-01-20T14:00:00Z',
    updatedAt: '2025-01-20T14:00:00Z'
  },
  {
    id: '3',
    doctorId: '1',
    patientId: '3',
    patientName: 'Carol Davis',
    patientEmail: 'carol@example.com',
    appointmentId: '3',
    date: '2025-01-21',
    diagnosis: 'Heart palpitations and anxiety',
    medications: [
      {
        id: 'med5',
        name: 'Propranolol',
        dosage: '10mg',
        frequency: 'Three times daily',
        duration: '14 days',
        instructions: 'Take 30 minutes before meals',
        quantity: 42,
        unit: 'tablets'
      }
    ],
    instructions: 'Reduce caffeine intake. Practice stress management techniques.',
    followUpDate: '2025-02-04',
    status: 'active',
    notes: 'Patient reports reduced palpitations',
    createdAt: '2025-01-21T09:00:00Z',
    updatedAt: '2025-01-21T09:00:00Z'
  },
  {
    id: '4',
    doctorId: '1',
    patientId: '11',
    patientName: 'Sarah Williams',
    patientEmail: 'sarah@example.com',
    appointmentId: '11',
    date: '2025-01-15',
    diagnosis: 'High cholesterol',
    medications: [
      {
        id: 'med6',
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the evening',
        quantity: 30,
        unit: 'tablets'
      }
    ],
    instructions: 'Low-fat diet recommended. Regular exercise.',
    followUpDate: '2025-02-15',
    status: 'completed',
    notes: 'Cholesterol levels improved',
    createdAt: '2025-01-15T09:30:00Z',
    updatedAt: '2025-01-15T09:30:00Z'
  }
];

// Mock API functions
export const mockApi = {
  // Doctor Authentication
  login: async (email: string, password: string): Promise<{ doctor: Doctor; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'dr.smith@example.com' && password === 'password123') {
      return {
        doctor: mockDoctor,
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  signup: async (doctorData: Partial<Doctor> & { password: string }): Promise<{ doctor: Doctor; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      email: doctorData.email!,
      firstName: doctorData.firstName!,
      lastName: doctorData.lastName!,
      specialization: doctorData.specialization!,
      experience: doctorData.experience!,
      phone: doctorData.phone!,
      clinicName: doctorData.clinicName!,
      clinicAddress: doctorData.clinicAddress!,
      qualifications: doctorData.qualifications || [],
      registrationNumber: doctorData.registrationNumber!,
      consultationFee: doctorData.consultationFee!,
      isProfileComplete: false
    };
    
    return {
      doctor: newDoctor,
      token: 'mock-jwt-token'
    };
  },

  // Patient Authentication
  patientLogin: async (email: string, password: string): Promise<{ patient: PatientUser; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'patient@example.com' && password === 'password123') {
      return {
        patient: mockPatientUser,
        token: 'mock-patient-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  patientSignup: async (patientData: Partial<PatientUser> & { password: string }): Promise<{ patient: PatientUser; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPatient: PatientUser = {
      id: Date.now().toString(),
      email: patientData.email!,
      firstName: patientData.firstName!,
      lastName: patientData.lastName!,
      phone: patientData.phone!,
      age: patientData.age!,
      gender: patientData.gender!,
      medicalHistory: patientData.medicalHistory || '',
      allergies: patientData.allergies || '',
      emergencyContact: patientData.emergencyContact || ''
    };
    
    return {
      patient: newPatient,
      token: 'mock-patient-jwt-token'
    };
  },

  // Doctor Profile
  getProfile: async (): Promise<Doctor> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDoctor;
  },

  updateProfile: async (updates: Partial<Doctor>): Promise<Doctor> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...mockDoctor, ...updates };
  },

  // Patient Profile
  getPatientProfile: async (): Promise<PatientUser> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPatientUser;
  },

  updatePatientProfile: async (updates: Partial<PatientUser>): Promise<PatientUser> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...mockPatientUser, ...updates };
  },

  // Doctor Listings for Patients
  getDoctors: async (specialization?: string): Promise<DoctorListing[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (specialization) {
      return mockDoctors.filter(doc => doc.specialization.toLowerCase().includes(specialization.toLowerCase()));
    }
    return mockDoctors;
  },

  getDoctorById: async (id: string): Promise<DoctorListing | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDoctors.find(doc => doc.id === id) || null;
  },

  // Appointments
  getAppointments: async (doctorId?: string): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (doctorId) {
      return mockAppointments.filter(apt => apt.doctorId === doctorId);
    }
    return mockAppointments;
  },

  getPatientAppointments: async (patientId: string): Promise<Appointment[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockAppointments.filter(apt => apt.patientId === patientId);
  },

  bookAppointment: async (appointmentData: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...appointmentData,
      status: 'pending'
    };
    
    mockAppointments.push(newAppointment);
    return newAppointment;
  },

  updateAppointmentStatus: async (id: string, status: Appointment['status']): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const appointment = mockAppointments.find(apt => apt.id === id);
    if (appointment) {
      appointment.status = status;
    }
    return appointment!;
  },

  updateAppointment: async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const appointment = mockAppointments.find(apt => apt.id === id);
    if (appointment) {
      Object.assign(appointment, updates);
    }
    return appointment!;
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockAppointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      mockAppointments.splice(index, 1);
    }
  },

  // Patients
  getPatients: async (): Promise<Patient[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockPatients;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      totalPatients: mockPatients.length,
      todayAppointments: mockAppointments.filter(apt => apt.date === '2025-01-20').length,
      pendingAppointments: mockAppointments.filter(apt => apt.status === 'pending').length,
      monthlyRevenue: 4500
    };
  },

  getPatientDashboardStats: async (patientId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const patientAppointments = mockAppointments.filter(apt => apt.patientId === patientId);
    return {
      totalAppointments: patientAppointments.length,
      upcomingAppointments: patientAppointments.filter(apt => 
        new Date(`${apt.date}T${apt.time}`) > new Date() && apt.status !== 'cancelled'
      ).length,
      completedAppointments: patientAppointments.filter(apt => apt.status === 'completed').length,
      totalDoctors: new Set(patientAppointments.map(apt => apt.doctorId)).size
    };
  },

  // Prescriptions
  getPrescriptions: async (patientId?: string): Promise<Prescription[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (patientId) {
      return mockPrescriptions.filter(pres => pres.patientId === patientId);
    }
    return mockPrescriptions;
  },

  getPrescriptionById: async (id: string): Promise<Prescription | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPrescriptions.find(pres => pres.id === id) || null;
  },

  createPrescription: async (prescriptionData: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prescription> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      ...prescriptionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPrescriptions.push(newPrescription);
    return newPrescription;
  },

  updatePrescription: async (id: string, updates: Partial<Prescription>): Promise<Prescription> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const prescription = mockPrescriptions.find(pres => pres.id === id);
    if (prescription) {
      Object.assign(prescription, updates);
      prescription.updatedAt = new Date().toISOString();
    }
    return prescription!;
  },

  deletePrescription: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPrescriptions.findIndex(pres => pres.id === id);
    if (index !== -1) {
      mockPrescriptions.splice(index, 1);
    }
  }
};
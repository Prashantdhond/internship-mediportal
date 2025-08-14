'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientUser } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

interface PatientAuthState {
  patient: PatientUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const PatientAuthContext = createContext<{
  state: PatientAuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (patientData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<PatientUser>) => Promise<void>;
} | null>(null);

export function PatientAuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PatientAuthState>({
    patient: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('patient-token');
    const patientData = localStorage.getItem('patient-data');
    
    if (token && patientData) {
      try {
        const patient = JSON.parse(patientData);
        setState({
          patient,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('patient-token');
        localStorage.removeItem('patient-data');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { patient, token } = await mockApi.patientLogin(email, password);
      localStorage.setItem('patient-token', token);
      localStorage.setItem('patient-data', JSON.stringify(patient));
      setState({
        patient,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      throw error;
    }
  };

  const signup = async (patientData: any) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { patient, token } = await mockApi.patientSignup(patientData);
      localStorage.setItem('patient-token', token);
      localStorage.setItem('patient-data', JSON.stringify(patient));
      setState({
        patient,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('patient-token');
    localStorage.removeItem('patient-data');
    setState({
      patient: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateProfile = async (updates: Partial<PatientUser>) => {
    try {
      const updatedPatient = await mockApi.updatePatientProfile(updates);
      localStorage.setItem('patient-data', JSON.stringify(updatedPatient));
      setState(prev => ({ ...prev, patient: updatedPatient }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <PatientAuthContext.Provider value={{ state, login, signup, logout, updateProfile }}>
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
}
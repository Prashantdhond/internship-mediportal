'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Doctor } from '@/lib/types';
import { mockApi } from '@/lib/mock-api';

interface AuthState {
  doctor: Doctor | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (doctorData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Doctor>) => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    doctor: null,
    token: null,
    isLoading: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for stored auth data on mount
    const token = localStorage.getItem('doctor-token');
    const doctorData = localStorage.getItem('doctor-data');
    
    if (token && doctorData) {
      try {
        const doctor = JSON.parse(doctorData);
        setState({
          doctor,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('doctor-token');
        localStorage.removeItem('doctor-data');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { doctor, token } = await mockApi.login(email, password);
      localStorage.setItem('doctor-token', token);
      localStorage.setItem('doctor-data', JSON.stringify(doctor));
      setState({
        doctor,
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      throw error;
    }
  };

  const signup = async (doctorData: any) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { doctor, token } = await mockApi.signup(doctorData);
      localStorage.setItem('doctor-token', token);
      localStorage.setItem('doctor-data', JSON.stringify(doctor));
      setState({
        doctor,
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
    localStorage.removeItem('doctor-token');
    localStorage.removeItem('doctor-data');
    setState({
      doctor: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateProfile = async (updates: Partial<Doctor>) => {
    try {
      const updatedDoctor = await mockApi.updateProfile(updates);
      localStorage.setItem('doctor-data', JSON.stringify(updatedDoctor));
      setState(prev => ({ ...prev, doctor: updatedDoctor }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
'use client';

import { useState } from 'react';
import { User, Mail, Phone, Heart, AlertTriangle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientProtectedRoute } from '@/components/patient/patient-protected-route';
import { PatientNavbar } from '@/components/patient/patient-navbar';
import { usePatientAuth } from '@/contexts/patient-auth-context';

export default function PatientProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, updateProfile } = usePatientAuth();

  // Simple form state
  const [formData, setFormData] = useState({
    firstName: state.patient?.firstName || '',
    lastName: state.patient?.lastName || '',
    email: state.patient?.email || '',
    phone: state.patient?.phone || '',
    age: state.patient?.age?.toString() || '',
    gender: state.patient?.gender || 'male',
    medicalHistory: state.patient?.medicalHistory || '',
    allergies: state.patient?.allergies || '',
    emergencyContact: state.patient?.emergencyContact || '',
  });

  // Simple validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.age) {
      newErrors.age = 'Please enter your age';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');
    
    try {
      const updatedData = {
        ...formData,
        age: parseInt(formData.age),
      };
      
      await updateProfile(updatedData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PatientNavbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your personal and medical information</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/default-avatar.png" alt={`${state.patient?.firstName} ${state.patient?.lastName}`} />
                      <AvatarFallback className="bg-green-100 text-green-600 text-lg">
                        {state.patient?.firstName?.[0]}{state.patient?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {state.patient?.firstName} {state.patient?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">Patient</p>
                      <p className="text-sm text-gray-500">{state.patient?.age} years old</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{state.patient?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{state.patient?.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="firstName"
                              placeholder="John"
                              className="pl-10"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                            />
                          </div>
                          {errors.firstName && (
                            <p className="text-sm text-red-600">{errors.firstName}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              className="pl-10"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                          </div>
                          {errors.lastName && (
                            <p className="text-sm text-red-600">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="patient@example.com"
                              className="pl-10"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              placeholder="+1 (555) 123-4567"
                              className="pl-10"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            placeholder="25"
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                          />
                          {errors.age && (
                            <p className="text-sm text-red-600">{errors.age}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select onValueChange={(value) => handleInputChange('gender', value as 'male' | 'female' | 'other')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <p className="text-sm text-red-600">{errors.gender}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="medicalHistory">Medical History</Label>
                        <Textarea
                          id="medicalHistory"
                          placeholder="Any previous medical conditions, surgeries, or chronic illnesses..."
                          value={formData.medicalHistory}
                          onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                        />
                        {errors.medicalHistory && (
                          <p className="text-sm text-red-600">{errors.medicalHistory}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          placeholder="Any known allergies to medications, foods, or environmental factors..."
                          value={formData.allergies}
                          onChange={(e) => handleInputChange('allergies', e.target.value)}
                        />
                        {errors.allergies && (
                          <p className="text-sm text-red-600">{errors.allergies}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          placeholder="Name and phone number of emergency contact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        />
                        {errors.emergencyContact && (
                          <p className="text-sm text-red-600">{errors.emergencyContact}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="sm" />
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </PatientProtectedRoute>
  );
}
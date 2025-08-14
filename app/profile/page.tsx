'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Stethoscope, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/contexts/auth-context';

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatric', 'Gynecologist', 'Psychiatrist', 'ENT Specialist',
  'Ophthalmologist', 'Urologist', 'Gastroenterologist'
];

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, updateProfile } = useAuth();

  // Simple form state
  const [formData, setFormData] = useState({
    firstName: state.doctor?.firstName || '',
    lastName: state.doctor?.lastName || '',
    email: state.doctor?.email || '',
    phone: state.doctor?.phone || '',
    specialization: state.doctor?.specialization || '',
    experience: state.doctor?.experience?.toString() || '',
    registrationNumber: state.doctor?.registrationNumber || '',
    clinicName: state.doctor?.clinicName || '',
    clinicAddress: state.doctor?.clinicAddress || '',
    consultationFee: state.doctor?.consultationFee?.toString() || '',
    qualifications: state.doctor?.qualifications?.join(', ') || '',
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
    if (!formData.specialization) {
      newErrors.specialization = 'Please select your specialization';
    }
    if (!formData.experience) {
      newErrors.experience = 'Please enter your experience';
    }
    if (!formData.registrationNumber || formData.registrationNumber.length < 5) {
      newErrors.registrationNumber = 'Please enter a valid registration number';
    }
    if (!formData.clinicName || formData.clinicName.length < 2) {
      newErrors.clinicName = 'Clinic name must be at least 2 characters';
    }
    if (!formData.clinicAddress || formData.clinicAddress.length < 10) {
      newErrors.clinicAddress = 'Please enter a complete address';
    }
    if (!formData.consultationFee) {
      newErrors.consultationFee = 'Please enter consultation fee';
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
        experience: parseInt(formData.experience),
        consultationFee: parseInt(formData.consultationFee),
        qualifications: formData.qualifications ? formData.qualifications.split(',').map(q => q.trim()) : [],
        isProfileComplete: true,
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your professional information</p>
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
                      <AvatarImage src={state.doctor?.avatar} alt={`Dr. ${state.doctor?.firstName} ${state.doctor?.lastName}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {state.doctor?.firstName?.[0]}{state.doctor?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Dr. {state.doctor?.firstName} {state.doctor?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{state.doctor?.specialization}</p>
                      <p className="text-sm text-gray-500">{state.doctor?.experience} years experience</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{state.doctor?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{state.doctor?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{state.doctor?.clinicName}</span>
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
                    <Stethoscope className="h-5 w-5" />
                    <span>Professional Information</span>
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
                              placeholder="doctor@example.com"
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
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Select onValueChange={(value) => handleInputChange('specialization', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              {specializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.specialization && (
                            <p className="text-sm text-red-600">{errors.specialization}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            type="number"
                            placeholder="5"
                            value={formData.experience}
                            onChange={(e) => handleInputChange('experience', e.target.value)}
                          />
                          {errors.experience && (
                            <p className="text-sm text-red-600">{errors.experience}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Medical Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="MED12345"
                            value={formData.registrationNumber}
                            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                          />
                          {errors.registrationNumber && (
                            <p className="text-sm text-red-600">{errors.registrationNumber}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                          <Input
                            id="consultationFee"
                            type="number"
                            placeholder="150"
                            value={formData.consultationFee}
                            onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                          />
                          {errors.consultationFee && (
                            <p className="text-sm text-red-600">{errors.consultationFee}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="qualifications">Qualifications</Label>
                        <Textarea
                          id="qualifications"
                          placeholder="MBBS, MD, FRCS, etc. (comma separated)"
                          value={formData.qualifications}
                          onChange={(e) => handleInputChange('qualifications', e.target.value)}
                        />
                        {errors.qualifications && (
                          <p className="text-sm text-red-600">{errors.qualifications}</p>
                        )}
                      </div>
                    </div>

                    {/* Clinic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Clinic Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clinicName">Clinic/Hospital Name</Label>
                        <Input
                          id="clinicName"
                          placeholder="Heart Care Medical Center"
                          value={formData.clinicName}
                          onChange={(e) => handleInputChange('clinicName', e.target.value)}
                        />
                        {errors.clinicName && (
                          <p className="text-sm text-red-600">{errors.clinicName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicAddress">Clinic Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Textarea
                            id="clinicAddress"
                            placeholder="123 Medical Center Drive, Health City, HC 12345"
                            className="pl-10"
                            value={formData.clinicAddress}
                            onChange={(e) => handleInputChange('clinicAddress', e.target.value)}
                          />
                        </div>
                        {errors.clinicAddress && (
                          <p className="text-sm text-red-600">{errors.clinicAddress}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
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
    </ProtectedRoute>
  );
}
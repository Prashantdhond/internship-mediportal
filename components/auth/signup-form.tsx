'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/auth-context';

const specializations = [
  'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist',
  'Orthopedic', 'Pediatric', 'Gynecologist', 'Psychiatrist', 'ENT Specialist',
  'Ophthalmologist', 'Urologist', 'Gastroenterologist'
];

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { signup, state } = useAuth();

  // Simple form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    experience: '',
    registrationNumber: '',
    clinicName: '',
    clinicAddress: '',
    consultationFee: ''
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
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
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

    try {
      setError('');
      const doctorData = {
        ...formData,
        experience: parseInt(formData.experience),
        consultationFee: parseInt(formData.consultationFee),
        qualifications: [], // Will be added in profile setup
      };
      await signup(doctorData);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Doctor Registration</CardTitle>
            <CardDescription className="text-gray-600">
              Join our platform and start managing your practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        className="pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        className="pr-10"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
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
                    <Input
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

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={state.isLoading}
              >
                {state.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/doctor/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Are you a patient?{' '}
                <Link href="/patient/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Patient Registration
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Heart } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to doctor signup by default
    router.push('/doctor/signup');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Join Medicare</CardTitle>
          <CardDescription className="text-gray-600">
            Choose your registration type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => router.push('/doctor/signup')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
          >
            <Stethoscope className="h-5 w-5 mr-2" />
            Doctor Registration
          </Button>
          <Button
            onClick={() => router.push('/patient/signup')}
            className="w-full bg-green-600 hover:bg-green-700 h-12"
          >
            <Heart className="h-5 w-5 mr-2" />
            Patient Registration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
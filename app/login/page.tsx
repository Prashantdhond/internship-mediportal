'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Heart } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to doctor login by default
    router.push('/doctor/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Medicare</CardTitle>
          <CardDescription className="text-gray-600">
            Choose your login type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => router.push('/doctor/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 h-12"
          >
            <Stethoscope className="h-5 w-5 mr-2" />
            Doctor Login
          </Button>
          <Button
            onClick={() => router.push('/patient/login')}
            className="w-full bg-green-600 hover:bg-green-700 h-12"
          >
            <Heart className="h-5 w-5 mr-2" />
            Patient Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
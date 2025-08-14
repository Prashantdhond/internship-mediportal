'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { mockApi } from '@/lib/mock-api';
import { usePatientAuth } from '@/contexts/patient-auth-context';

interface PatientDashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  totalDoctors: number;
}

export function PatientStatsCards() {
  const [stats, setStats] = useState<PatientDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = usePatientAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!state.patient?.id) return;
      
      try {
        const data = await mockApi.getPatientDashboardStats(state.patient.id);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [state.patient?.id]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32">
            <CardContent className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Completed',
      value: stats.completedAppointments,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Doctors Consulted',
      value: stats.totalDoctors,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
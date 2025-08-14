import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { PatientAuthProvider } from '@/contexts/patient-auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MedPortal - Doctor Portal',
  description: 'Complete doctor onboarding and practice management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PatientAuthProvider>
            {children}
          </PatientAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
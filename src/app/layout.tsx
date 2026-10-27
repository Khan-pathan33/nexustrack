import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexusTrack — Team & Trainee Management Hub',
  description: 'NexusTrack is a full-stack MERN + Next.js platform for managing team meetings, communications, trainee assessments, project progress, and GitHub activity.',
  keywords: 'team tracker, trainee management, meeting tracker, project progress, assessment portal, MERN, Next.js, GitHub tracker',
  openGraph: {
    title: 'NexusTrack — Team & Trainee Management Hub',
    description: 'Manage meetings, mail, trainee assessments, projects, and GitHub activity in one unified dashboard.',
    type: 'website',
  },
};

import { ToastProvider } from '@/components/Toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}

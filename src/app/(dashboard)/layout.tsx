'use client'; // This is necessary because FirebaseClientProvider is a client component

import { Suspense } from 'react';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}

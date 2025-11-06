'use client';

import { ReactNode, useEffect, useState } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase/index';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    const firebaseInstances = initializeFirebase();
    setFirebase(firebaseInstances);
  }, []);

  if (!firebase) {
    // You can return a loader here if you want
    return null;
  }

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}

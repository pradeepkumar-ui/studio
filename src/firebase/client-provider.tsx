'use client';

import { ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

/**
 * A client-side wrapper that initializes Firebase services only once 
 * after the component has mounted in the browser.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<{
    app: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    // Initialize Firebase only on the client
    const { app, auth, firestore } = initializeFirebase();
    if (app && auth && firestore) {
      setInstances({ app, auth, firestore });
    }
  }, []);

  // During SSR or until Firebase is initialized on the client,
  // we return null to ensure child components that depend on Firebase 
  // do not attempt to access instances before they are available.
  if (!instances) {
    return null;
  }

  return (
    <FirebaseProvider
      app={instances.app}
      auth={instances.auth}
      firestore={instances.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}

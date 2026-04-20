'use client';

import { ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './init';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<{
    app: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    const instances = initializeFirebase();
    if (instances.app && instances.auth && instances.firestore) {
      setFirebase({
        app: instances.app,
        auth: instances.auth,
        firestore: instances.firestore,
      });
    }
  }, []);

  if (!firebase || !firebase.app || !firebase.auth || !firebase.firestore) {
    return null;
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}

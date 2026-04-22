import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

/**
 * Initializes Firebase services on the client side.
 * Ensures that initialization only happens once.
 */
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }
    
    if (!auth) auth = getAuth(app);
    if (!firestore) firestore = getFirestore(app);
  }
  
  return { app, auth, firestore };
}

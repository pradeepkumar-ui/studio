import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
import { FirebaseProvider, useAuth, useFirebase, useFirebaseApp, useFirestore } from './provider';
import { FirebaseClientProvider } from './client-provider';


let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  }
  
  if (!app || !auth || !firestore) {
    throw new Error("Firebase has not been initialized. Please call initializeFirebase first.");
  }

  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};

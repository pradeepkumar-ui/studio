import { FirebaseOptions } from 'firebase/app';

// This file is replaced by the content of firebaseConfig.json during build
export const firebaseConfig: FirebaseOptions =
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG
    ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
    : {
        apiKey: 'your-api-key',
        authDomain: 'your-auth-domain',
        projectId: 'your-project-id',
        storageBucket: 'your-storage-bucket',
        messagingSenderId: 'your-messaging-sender-id',
        appId: 'your-app-id',
      };

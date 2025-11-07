'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  DocumentReference,
  DocumentData,
  DocumentSnapshot,
} from 'firebase/firestore';

export const useDoc = (docRef: DocumentReference<DocumentData> | undefined) => {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedRef = useMemo(() => docRef, [docRef]);

  useEffect(() => {
    if (!memoizedRef) {
        setLoading(false);
        setData(null);
        return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() });
        } else {
            setData(null);
        }
        setLoading(false);
      },
      (err: Error) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching document: ", err);
      }
    );

    return () => unsubscribe();
  }, [memoizedRef]);

  return { data, loading, error };
};

'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
} from 'firebase/firestore';

export const useSubcollection = (subcollectionQuery: Query<DocumentData> | undefined) => {
  const [data, setData] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!subcollectionQuery) {
        setLoading(false);
        setData([]);
        return;
    }
    
    setLoading(true);

    const unsubscribe = onSnapshot(
      subcollectionQuery,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching subcollection: ", err);
      }
    );

    return () => unsubscribe();
  }, [subcollectionQuery]);

  return [data, loading, error] as const;
};

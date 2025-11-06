'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  // This will be shown briefly before redirection, or if redirection fails.
  return null;
}

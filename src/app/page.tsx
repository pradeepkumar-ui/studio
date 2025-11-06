'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  // This component will be rendered by the layout, which handles the dashboard view.
  // The redirection ensures that any direct access to the root path is handled gracefully
  // and the user is presented with the main dashboard.
  return null;
}

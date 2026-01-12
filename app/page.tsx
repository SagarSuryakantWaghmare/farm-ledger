'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [token, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-950 dark:to-emerald-950">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading FarmLedger...</p>
      </div>
    </div>
  );
}

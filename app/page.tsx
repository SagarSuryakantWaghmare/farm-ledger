'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Sprout,
  TrendingUp,
  Users,
  FileText,
  Image as ImageIcon,
  Shield,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { LoaderFive } from '@/components/ui/loader';

import { HeroParallax } from '@/components/ui/hero-parallax';

const products = [
  {
    title: "Farm Management",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Expense Tracking",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Worker Registry",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Financial Overview",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Harvest Analytics",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Digital Ledger",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "AgriTech Solutions",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Smart Farming",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Real-time Data",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Secure Storage",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Cloud Reports",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Worker Payments",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1595475204848-9f8934d6424b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Bilingual Interface",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Farm Analytics",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1591123720164-de1348028a31?q=80&w=2000&auto=format&fit=crop",
  },
  {
    title: "Precision Agri",
    link: "#",
    thumbnail: "https://images.unsplash.com/photo-1598114852902-86ec10862025?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { token, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && token) {
      router.push('/dashboard');
    }
  }, [token, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <LoaderFive text="FarmLedger" />
      </div>
    );
  }

  if (token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
      <nav className="fixed top-0 z-[60] w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80">
        <div className="max-w-7xl mx-auto w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
              <Sprout size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              FarmLedger
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/login')} className="font-semibold">
              Login
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-md shadow-emerald-100" onClick={() => router.push('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative w-full">
        <HeroParallax products={products} />
        <div className="absolute top-[85%] left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-6">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 h-16 px-10 text-xl font-bold rounded-2xl shadow-xl shadow-emerald-100 transition-all hover:scale-105 active:scale-95 border-0"
            onClick={() => router.push('/signup')}
          >
            Start Free Today
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-16 px-10 text-xl font-bold rounded-2xl border-2 transition-all hover:bg-gray-50 bg-white shadow-lg active:scale-95"
            onClick={() => router.push('/login')}
          >
            Sign In
          </Button>
        </div>
      </section>


      <footer className="bg-gray-950 text-gray-400 py-20 border-t border-gray-900">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600 text-white">
                <Sprout size={24} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">FarmLedger</span>
            </div>

            <p className="text-sm font-bold tracking-tight">© 2026 FarmLedger. All rights reserved.</p>

            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors"><Shield className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Zap className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

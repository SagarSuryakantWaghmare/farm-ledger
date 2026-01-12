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
  Menu,
  X
} from 'lucide-react';
import { LoaderFive } from '@/components/ui/loader';
import { Navbar as ResizableNav, NavBody, NavItems, NavbarLogo, NavbarButton, MobileNav, MobileNavHeader, MobileNavToggle, MobileNavMenu } from '@/components/ui/resizable-navbar';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <ResizableNav className="top-4">
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={[
              { name: "Home", link: "/" },
              { name: "Dashboard", link: "/dashboard" },
              { name: "Workers", link: "/dashboard/workers" },
              { name: "Farms", link: "/dashboard/farms" },
            ]}
          />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary" onClick={() => router.push('/login')}>
              Login
            </NavbarButton>
            <NavbarButton className="bg-emerald-600 dark:bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => router.push('/signup')}>
              Sign Up
            </NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col gap-4 w-full">
              <a href="/" className="text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-xl">Home</a>
              <a href="/dashboard" className="text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-xl">Dashboard</a>
              <a href="/dashboard/workers" className="text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-xl">Workers</a>
              <a href="/dashboard/farms" className="text-lg font-semibold px-4 py-2 hover:bg-gray-100 rounded-xl">Farms</a>
              <hr className="my-2" />
              <Button variant="ghost" className="w-full justify-start text-lg h-12 rounded-xl" onClick={() => router.push('/login')}>
                Login
              </Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg h-12 rounded-xl" onClick={() => router.push('/signup')}>
                Get Started
              </Button>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNav>

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

      <section className="py-24 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features to manage your farm expenses efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Users,
                title: 'Worker Management',
                description: 'Maintain detailed records of your entire workforce. Track attendance and manage profiles with ease.',
                iconBg: 'bg-emerald-50 dark:bg-emerald-900/10',
                iconColor: 'text-emerald-600',
                borderColor: 'border-emerald-100 dark:border-emerald-900/10'
              },
              {
                icon: FileText,
                title: 'Transaction Tracking',
                description: 'Record every financial movement. Complete transparency for both credit and debit operations.',
                iconBg: 'bg-blue-50 dark:bg-blue-900/10',
                iconColor: 'text-blue-600',
                borderColor: 'border-blue-100 dark:border-blue-900/10'
              },
              {
                icon: ImageIcon,
                title: 'Bill Management',
                description: 'Go paperless. Securely upload and store digital copies of all your farm bills and receipts.',
                iconBg: 'bg-purple-50 dark:bg-purple-900/10',
                iconColor: 'text-purple-600',
                borderColor: 'border-purple-100 dark:border-purple-900/10'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: 'Your data is protected with 4-digit PIN authentication and industry-standard encryption.',
                iconBg: 'bg-red-50 dark:bg-red-900/10',
                iconColor: 'text-red-600',
                borderColor: 'border-red-100 dark:border-red-900/10'
              },
              {
                icon: Globe,
                title: 'Bilingual Support',
                description: 'Breaking language barriers. Use the platform seamlessly in either English or Marathi.',
                iconBg: 'bg-amber-50 dark:bg-amber-900/10',
                iconColor: 'text-amber-600',
                borderColor: 'border-amber-100 dark:border-amber-900/10'
              },
              {
                icon: Zap,
                title: 'Real-time Sync',
                description: 'Multi-device support with instant updates. Keep all owners in sync without any delay.',
                iconBg: 'bg-cyan-50 dark:bg-cyan-900/10',
                iconColor: 'text-cyan-600',
                borderColor: 'border-cyan-100 dark:border-cyan-900/10'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`h-full hover:shadow-2xl transition-all duration-300 border-2 ${feature.borderColor} rounded-[2.5rem] overflow-hidden group bg-white dark:bg-gray-900`}>
                  <CardContent className="p-10">
                    <div className={`w-16 h-16 rounded-3xl ${feature.iconBg} flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
                      <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-bold text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-24 bg-emerald-600 dark:bg-emerald-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto w-full px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-12 text-emerald-50 max-w-2xl mx-auto font-medium">
              Join thousands of farmers who are already managing their expenses efficiently with FarmLedger.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 h-16 px-10 text-xl font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 border-0"
              onClick={() => router.push('/signup')}
            >
              Create Free Account
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
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
          </div>
        </div>
      </footer>

    </div>
  );
}

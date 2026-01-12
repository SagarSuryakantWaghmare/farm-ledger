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
  Loader2
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-950 dark:to-emerald-950">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950">
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white">
              <Sprout size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              FarmLedger
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 mb-6">
              <Zap size={16} />
              <span className="text-sm font-medium">Modern Farm Management</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Manage Your Farm
              <span className="block text-emerald-600">Expenses Smartly</span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Track workers, monitor transactions, and keep your farm finances organized with our powerful expense management platform.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8"
                onClick={() => router.push('/signup')}
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">No Credit Card</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Debit</p>
                        <p className="text-2xl font-bold text-red-600">₹25,450</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-red-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Credit</p>
                        <p className="text-2xl font-bold text-green-600">₹18,900</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
                        <p className="text-2xl font-bold text-blue-600">₹6,550</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 blur-3xl opacity-20 -z-10" />
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features to manage your farm expenses efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Worker Management',
                description: 'Track and manage all your farm workers in one place with detailed records.',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: FileText,
                title: 'Transaction Tracking',
                description: 'Record every debit and credit transaction with complete transparency.',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: ImageIcon,
                title: 'Bill Management',
                description: 'Upload and store bill images securely with Cloudinary integration.',
                color: 'from-purple-500 to-pink-600'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                description: '4-digit PIN authentication with encrypted data storage for security.',
                color: 'from-red-500 to-orange-600'
              },
              {
                icon: Globe,
                title: 'Bilingual Support',
                description: 'Use the app in English or Marathi - whatever you prefer.',
                color: 'from-yellow-500 to-amber-600'
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                description: 'Multi-owner support with instant synchronization across devices.',
                color: 'from-cyan-500 to-blue-600'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto">
              Join thousands of farmers who are already managing their expenses efficiently with FarmLedger.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 h-14 px-8"
              onClick={() => router.push('/signup')}
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white">
                  <Sprout size={24} />
                </div>
                <span className="text-xl font-bold text-white">FarmLedger</span>
              </div>
              <p className="text-sm">
                Modern farm expense management for the digital age.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2026 FarmLedger. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Facebook</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

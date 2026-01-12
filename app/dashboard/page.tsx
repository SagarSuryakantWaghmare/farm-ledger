'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Receipt, Users, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    description: string;
    workerId: { name: string } | null;
    farmId: { name: string } | null;
    billImageUrl: string | null;
    date: string;
    createdBy: { name: string };
}

interface Summary {
    totalDebit: number;
    totalCredit: number;
    netBalance: number;
    count: number;
}

export default function DashboardPage() {
    const { user, token } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<Summary>({
        totalDebit: 0,
        totalCredit: 0,
        netBalance: 0,
        count: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        try {
            const response = await axios.get('/api/transactions', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTransactions(response.data.transactions || []);
            setSummary(response.data.summary || {
                totalDebit: 0,
                totalCredit: 0,
                netBalance: 0,
                count: 0,
            });
        } catch (error: unknown) {
            console.error('Dashboard data fetch error:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, [token, fetchDashboardData, router]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
            <Navbar />

            <div className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.dashboard.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t.dashboard.overview}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title={t.dashboard.totalDebit}
                        value={summary.totalDebit}
                        type="debit"
                        index={0}
                    />
                    <StatsCard
                        title={t.dashboard.totalCredit}
                        value={summary.totalCredit}
                        type="credit"
                        index={1}
                    />
                    <StatsCard
                        title={t.dashboard.netBalance}
                        value={summary.netBalance}
                        type="net"
                        index={2}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Button
                            className="w-full h-24 bg-white dark:bg-gray-900 border-emerald-200 dark:border-emerald-800 border-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm"
                            onClick={() => router.push('/dashboard/transactions')}
                        >
                            <div className="flex flex-col items-center">
                                <Receipt className="h-8 w-8 mb-2" />
                                <span className="font-semibold">{t.transactions.title}</span>
                            </div>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            className="w-full h-24 bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800 border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm"
                            onClick={() => router.push('/dashboard/workers')}
                        >
                            <div className="flex flex-col items-center">
                                <Users className="h-8 w-8 mb-2" />
                                <span className="font-semibold">{t.workers.title}</span>
                            </div>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button
                            className="w-full h-24 bg-white dark:bg-gray-900 border-purple-200 dark:border-purple-800 border-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-400 shadow-sm"
                            onClick={() => router.push('/dashboard/farms')}
                        >
                            <div className="flex flex-col items-center">
                                <MapPin className="h-8 w-8 mb-2" />
                                <span className="font-semibold">{t.farms.title}</span>
                            </div>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Button
                            className="w-full h-24 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md border-0"
                            onClick={() => router.push('/dashboard/transactions/new')}
                        >
                            <div className="flex flex-col items-center">
                                <Plus className="h-8 w-8 mb-2" />
                                <span className="font-semibold">{t.transactions.addNew}</span>
                            </div>
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="text-xl">{t.dashboard.recentTransactions}</CardTitle>
                            <CardDescription>
                                Your latest {transactions.slice(0, 5).length} transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Loading transactions...
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-12">
                                    <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">No transactions yet</p>
                                    <Button
                                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => router.push('/dashboard/transactions/new')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add First Transaction
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.slice(0, 5).map((txn, idx) => (
                                        <motion.div
                                            key={txn._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${txn.type === 'DEBIT'
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                                                    : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                                                    }`}>
                                                    {txn.type === 'DEBIT' ? '↓' : '↑'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {txn.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {txn.workerId?.name} • {new Date(txn.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${txn.type === 'DEBIT' ? 'text-red-500' : 'text-emerald-500'
                                                    }`}>
                                                    {txn.type === 'DEBIT' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>


            <Footer />
        </div>
    );
}


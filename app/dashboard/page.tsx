'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Receipt, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    description: string;
    workerId: any;
    farmId: any;
    billImageUrl: string | null;
    date: string;
    createdBy: any;
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

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, [token]);

    const fetchDashboardData = async () => {
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
        } catch (error: any) {
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
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
                            className="w-full h-24 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
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
                            className="w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
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
                            className="w-full h-24 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
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
                            className="w-full h-24 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg"
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
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.dashboard.recentTransactions}</CardTitle>
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
                                        className="mt-4"
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
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'DEBIT'
                                                        ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                                                        : 'bg-green-100 dark:bg-green-900/20 text-green-600'
                                                    }`}>
                                                    {txn.type === 'DEBIT' ? '↓' : '↑'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {txn.description}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {txn.workerId?.name} • {new Date(txn.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`font-semibold ${txn.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                {txn.type === 'DEBIT' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

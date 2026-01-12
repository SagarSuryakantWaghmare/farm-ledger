'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users } from 'lucide-react';
import { LoaderTwo } from '@/components/ui/loader';
import { StatefulButton } from '@/components/ui/stateful-button';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Worker {
    _id: string;
    name: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
}

export default function WorkersPage() {
    const { token } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newWorker, setNewWorker] = useState({ name: '', phone: '' });

    const fetchWorkers = useCallback(async () => {
        try {
            const response = await axios.get('/api/workers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorkers(response.data.workers || []);
        } catch (error: unknown) {
            console.error('Fetch workers error:', error);
            toast.error('Failed to load workers');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchWorkers();
    }, [token, fetchWorkers, router]);

    const handleAddWorker = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorker.name.trim()) {
            toast.error('Worker name is required');
            return;
        }

        setIsAdding(true);
        try {
            await axios.post('/api/workers', newWorker, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Worker added successfully!');
            setNewWorker({ name: '', phone: '' });
            setShowAddForm(false);
            fetchWorkers();
        } catch (error: unknown) {
            const message = axios.isAxiosError(error) ? error.response?.data?.error : 'Failed to add worker';
            toast.error(message || 'Failed to add worker');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto w-full px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t.workers.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your farm workers
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t.workers.addWorker}
                    </Button>
                </div>

                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.workers.addWorker}</CardTitle>
                                <CardDescription>Add a new worker to your farm</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddWorker} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="workerName">{t.workers.name}</Label>
                                            <Input
                                                id="workerName"
                                                value={newWorker.name}
                                                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                                                placeholder="Enter worker name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="workerPhone">{t.workers.phone}</Label>
                                            <Input
                                                id="workerPhone"
                                                type="tel"
                                                value={newWorker.phone}
                                                onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                                                placeholder="9876543210 (optional)"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <StatefulButton
                                            type="submit"
                                            className="bg-emerald-600 hover:bg-emerald-700 hover:ring-emerald-500 w-32"
                                            disabled={isAdding}
                                        >
                                            {t.common.add}
                                        </StatefulButton>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setNewWorker({ name: '', phone: '' });
                                            }}
                                        >
                                            {t.common.cancel}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>All Workers ({workers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <LoaderTwo />
                                <p className="mt-6 text-gray-500 font-medium">Loading workers...</p>
                            </div>
                        ) : workers.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">{t.workers.noWorkers}</p>
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Worker
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {workers.map((worker, idx) => (
                                    <motion.div
                                        key={worker._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="hover:shadow-md transition-all border-2 border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden group">
                                            <CardContent className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40">
                                                        <span className="text-2xl font-bold text-emerald-600">
                                                            {worker.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                            {worker.name}
                                                        </h3>
                                                        {worker.phone && (
                                                            <p className="text-sm text-gray-500 font-medium">{worker.phone}</p>
                                                        )}
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Joined {new Date(worker.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

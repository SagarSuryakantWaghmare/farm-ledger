'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Filter, X, Receipt, Image as ImageIcon } from 'lucide-react';
import { LoaderTwo } from '@/components/ui/loader';
import Image from 'next/image';
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

interface Worker {
    _id: string;
    name: string;
}

interface Farm {
    _id: string;
    name: string;
}

export default function TransactionsPage() {
    const { token } = useAuth();
    const { t, language } = useLanguage();
    const router = useRouter();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filters, setFilters] = useState({
        workerId: '',
        startDate: '',
        endDate: '',
        hasBill: '',
        type: '',
    });

    const [summary, setSummary] = useState({
        totalDebit: 0,
        totalCredit: 0,
        netBalance: 0,
        count: 0,
    });

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filters.workerId) params.append('workerId', filters.workerId);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.hasBill) params.append('hasBill', filters.hasBill);
            if (filters.type) params.append('type', filters.type);

            const response = await axios.get(`/api/transactions?${params.toString()}`, {
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
            console.error('Fetch transactions error:', error);
            toast.error('Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    }, [token, filters]);

    const fetchData = useCallback(async () => {
        try {
            const [workersRes] = await Promise.all([
                axios.get('/api/workers', { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setWorkers(workersRes.data.workers || []);
            await fetchTransactions();
        } catch (error: unknown) {
            console.error('Fetch basic data error:', error);
            toast.error('Failed to load data');
        }
    }, [token, fetchTransactions]);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [token, fetchData, router]);

    useEffect(() => {
        if (token) {
            fetchTransactions();
        }
    }, [token, fetchTransactions]);

    const clearFilters = () => {
        setFilters({
            workerId: '',
            startDate: '',
            endDate: '',
            hasBill: '',
            type: '',
        });
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto w-full px-4 py-12 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {t.transactions.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Track and manage all transactions
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/dashboard/transactions/new')}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        {t.transactions.addNew}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-2 border-red-100 dark:border-red-900/20 shadow-sm bg-white dark:bg-gray-900 rounded-2xl">
                        <CardContent className="p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Total Debit</p>
                            <p className="text-3xl font-extrabold text-red-500">
                                ₹{summary.totalDebit.toLocaleString('en-IN')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-emerald-100 dark:border-emerald-900/20 shadow-sm bg-white dark:bg-gray-900 rounded-2xl">
                        <CardContent className="p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Total Credit</p>
                            <p className="text-3xl font-extrabold text-emerald-500">
                                ₹{summary.totalCredit.toLocaleString('en-IN')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-2 border-blue-100 dark:border-blue-900/20 shadow-sm bg-white dark:bg-gray-900 rounded-2xl">
                        <CardContent className="p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Net Balance</p>
                            <p className="text-3xl font-extrabold text-blue-500">
                                ₹{summary.netBalance.toLocaleString('en-IN')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8 border-0 shadow-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Filter className="h-5 w-5 text-emerald-500" />
                                    {t.transactions.filterByDate}
                                </CardTitle>
                                <CardDescription>Refine your transaction view</CardDescription>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <Label>Worker</Label>
                                <Select value={filters.workerId} onValueChange={(v) => setFilters({ ...filters, workerId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Workers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Workers</SelectItem>
                                        {workers.map(w => (
                                            <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Types</SelectItem>
                                        <SelectItem value="DEBIT">DEBIT</SelectItem>
                                        <SelectItem value="CREDIT">CREDIT</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Bill Status</Label>
                                <Select value={filters.hasBill} onValueChange={(v) => setFilters({ ...filters, hasBill: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All</SelectItem>
                                        <SelectItem value="true">With Bill</SelectItem>
                                        <SelectItem value="false">Without Bill</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All Transactions ({summary.count})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="py-20 text-center">
                                <div className="flex justify-center">
                                    <LoaderTwo />
                                </div>
                                <p className="mt-4 text-gray-500 font-medium">{language === 'en' ? 'Fetching transactions...' : 'व्यवहार मिळवत आहे...'}</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 mb-4">No transactions found</p>
                                <Button onClick={() => router.push('/dashboard/transactions/new')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add First Transaction
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Worker</TableHead>
                                            <TableHead>Farm</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Bill</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.map((txn) => (
                                            <TableRow key={txn._id}>
                                                <TableCell className="text-sm">
                                                    {new Date(txn.date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={txn.type === 'DEBIT' ? 'destructive' : 'default'}>
                                                        {txn.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{txn.workerId?.name || '-'}</TableCell>
                                                <TableCell>{txn.farmId?.name || '-'}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {txn.description}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    <span className={txn.type === 'DEBIT' ? 'text-red-600' : 'text-green-600'}>
                                                        {txn.type === 'DEBIT' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {txn.billImageUrl ? (
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <ImageIcon className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-3xl">
                                                                <DialogHeader>
                                                                    <DialogTitle>Bill Image</DialogTitle>
                                                                </DialogHeader>
                                                                <div className="relative w-full h-[60vh] mt-4">
                                                                    <Image
                                                                        src={txn.billImageUrl}
                                                                        alt="Bill"
                                                                        fill
                                                                        className="object-contain rounded-lg"
                                                                        unoptimized
                                                                    />
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">No bill</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

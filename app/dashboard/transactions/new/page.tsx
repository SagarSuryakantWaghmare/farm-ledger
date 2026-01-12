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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { LoaderOne } from '@/components/ui/loader';
import { StatefulButton } from '@/components/ui/stateful-button';
import { motion } from 'motion/react';
import axios from 'axios';
import { toast } from 'sonner';

interface Worker {
    _id: string;
    name: string;
}

interface Farm {
    _id: string;
    name: string;
}

export default function AddTransactionPage() {
    const { token } = useAuth();
    const { t, language } = useLanguage();
    const router = useRouter();

    const [workers, setWorkers] = useState<Worker[]>([]);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        type: 'DEBIT',
        workerId: '',
        farmId: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        billImageUrl: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const [workersRes, farmsRes] = await Promise.all([
                axios.get('/api/workers', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/farms', { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setWorkers(workersRes.data.workers || []);
            setFarms(farmsRes.data.farms || []);
        } catch (error: unknown) {
            console.error('Data fetch error:', error);
            toast.error('Failed to load data');
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [token, fetchData, router]);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, and WEBP images are allowed');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setFormData({ ...formData, billImageUrl: '' });
    };

    const uploadImage = async () => {
        if (!imageFile) return null;

        setIsUploading(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);

            const response = await axios.post('/api/upload', uploadFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error) ? error.response?.data?.error : 'Image upload failed';
            toast.error(message || 'Image upload failed');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.workerId) {
            toast.error('Please select a worker');
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Please enter a description');
            return;
        }

        if (formData.type === 'CREDIT' && imageFile) {
            toast.error('Credit transactions cannot have bill images');
            return;
        }

        setIsSubmitting(true);

        try {
            let billImageUrl = formData.billImageUrl;

            if (imageFile && formData.type === 'DEBIT') {
                billImageUrl = await uploadImage();
                if (!billImageUrl) {
                    setIsSubmitting(false);
                    return;
                }
            }

            await axios.post('/api/transactions', {
                type: formData.type,
                workerId: formData.workerId === 'none' ? undefined : formData.workerId,
                farmId: formData.farmId === 'none' ? undefined : formData.farmId,
                amount: Number(formData.amount),
                description: formData.description.trim(),
                date: formData.date,
                billImageUrl,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Transaction added successfully!');
            router.push('/dashboard/transactions');
        } catch (error: unknown) {
            const message = axios.isAxiosError(error) ? error.response?.data?.error : 'Failed to add transaction';
            toast.error(message || 'Failed to add transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{t.transactions.addNew}</CardTitle>
                            <CardDescription>
                                Add a new transaction to your farm ledger
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="type">{t.transactions.type}</Label>
                                        <Select
                                            value={formData.type}
                                            onValueChange={(v) => {
                                                setFormData({ ...formData, type: v });
                                                if (v === 'CREDIT') {
                                                    handleRemoveImage();
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DEBIT">{t.transactions.debit}</SelectItem>
                                                <SelectItem value="CREDIT">{t.transactions.credit}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">{t.transactions.amount}</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="1000"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="worker">{t.transactions.worker} *</Label>
                                        <Select value={formData.workerId} onValueChange={(v) => setFormData({ ...formData, workerId: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select worker" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Select worker</SelectItem>
                                                {workers.filter(w => w._id).map(w => (
                                                    <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {workers.length === 0 && (
                                            <p className="text-xs text-gray-500">
                                                No workers found.{' '}
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="p-0 h-auto text-xs"
                                                    onClick={() => router.push('/dashboard/workers')}
                                                >
                                                    Add a worker first
                                                </Button>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="farm">{t.transactions.farm}</Label>
                                        <Select value={formData.farmId} onValueChange={(v) => setFormData({ ...formData, farmId: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select farm (optional)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {farms.filter(f => f._id).map(f => (
                                                    <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">{t.transactions.date}</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">{t.transactions.description}</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter transaction details..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows={3}
                                    />
                                </div>

                                {formData.type === 'DEBIT' && (
                                    <div className="space-y-2">
                                        <Label>{t.transactions.uploadBill}</Label>

                                        {!imagePreview ? (
                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleImageSelect}
                                                    className="hidden"
                                                    id="bill-upload"
                                                />
                                                <label htmlFor="bill-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-8">
                                                    {isUploading ? (
                                                        <div className="flex flex-col items-center">
                                                            <LoaderOne />
                                                            <p className="mt-4 text-sm font-medium text-gray-500">
                                                                {language === 'en' ? 'Uploading bill...' : 'बिल अपलोड होत आहे...'}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                                                {language === 'en' ? 'Click to upload bill image' : 'बिल फोटो अपलोड करण्यासाठी क्लिक करा'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                JPG, PNG or WEBP (max 5MB)
                                                            </p>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-64">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Bill preview"
                                                    fill
                                                    className="object-contain rounded-lg border"
                                                    unoptimized
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <StatefulButton
                                        type="submit"
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 hover:ring-emerald-500 rounded-xl h-11"
                                        disabled={isSubmitting || isUploading}
                                    >
                                        {t.common.save}
                                    </StatefulButton>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        disabled={isSubmitting}
                                    >
                                        {t.common.cancel}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

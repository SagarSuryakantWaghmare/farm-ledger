'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Sprout, UserPlus, Loader2 } from 'lucide-react';

export default function SignupPage() {
    const { signup } = useAuth();
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        pin: '',
        confirmPin: '',
        accountName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [pinError, setPinError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.pin !== formData.confirmPin) {
            setPinError('PINs do not match');
            return;
        }

        if (!/^\d{4}$/.test(formData.pin)) {
            setPinError('PIN must be exactly 4 digits');
            return;
        }

        setPinError('');
        setIsLoading(true);

        try {
            await signup({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                pin: formData.pin,
                accountName: formData.accountName || `${formData.name}'s Farm`,
            });
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'pin' || field === 'confirmPin') {
            setPinError('');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 text-white mb-4"
                    >
                        <Sprout size={32} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                        FarmLedger
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400 mt-2"
                    >
                        {t.auth.signupTitle}
                    </motion.p>
                </div>

                <Card className="border-0 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t.common.signup}</CardTitle>
                        <CardDescription>
                            Create your farm account to start tracking expenses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t.auth.name}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Sagar Patil"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">{t.auth.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="sagar@farm.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">{t.auth.phone}</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountName">{t.auth.accountName}</Label>
                                <Input
                                    id="accountName"
                                    type="text"
                                    placeholder="My Farm (optional)"
                                    value={formData.accountName}
                                    onChange={(e) => handleChange('accountName', e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pin">{t.auth.pin}</Label>
                                <Input
                                    id="pin"
                                    type="password"
                                    placeholder="1234"
                                    value={formData.pin}
                                    onChange={(e) => handleChange('pin', e.target.value)}
                                    maxLength={4}
                                    pattern="\d{4}"
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPin">Confirm PIN</Label>
                                <Input
                                    id="confirmPin"
                                    type="password"
                                    placeholder="1234"
                                    value={formData.confirmPin}
                                    onChange={(e) => handleChange('confirmPin', e.target.value)}
                                    maxLength={4}
                                    pattern="\d{4}"
                                    required
                                    className="h-11"
                                />
                                {pinError && <p className="text-xs text-red-500">{pinError}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        {t.common.signup}
                                    </>
                                )}
                            </Button>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                {t.auth.haveAccount}{' '}
                                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                    {t.common.login}
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center text-xs text-gray-500 mt-8"
                >
                    Shared farm expense management for modern farmers
                </motion.p>
            </motion.div>
        </div>
    );
}

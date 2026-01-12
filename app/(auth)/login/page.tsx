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
import { Sprout, LogIn } from 'lucide-react';
import { LoaderOne } from '@/components/ui/loader';
import { StatefulButton } from '@/components/ui/stateful-button';

export default function LoginPage() {
    const { login } = useAuth();
    const { t } = useLanguage();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(emailOrPhone, pin);
        } catch (error) {
        } finally {
            setIsLoading(false);
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
                        {t.auth.loginTitle}
                    </motion.p>
                </div>

                <Card className="border-0 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">{t.common.login}</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your farm account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="emailOrPhone">{t.auth.emailOrPhone}</Label>
                                <Input
                                    id="emailOrPhone"
                                    type="text"
                                    placeholder="email@example.com or 9876543210"
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pin">{t.auth.pin}</Label>
                                <Input
                                    id="pin"
                                    type="password"
                                    placeholder="1234"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    maxLength={4}
                                    pattern="\d{4}"
                                    required
                                    className="h-11"
                                />
                                <p className="text-xs text-gray-500">{t.auth.enterPin}</p>
                            </div>

                            <StatefulButton
                                type="submit"
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 hover:ring-emerald-500 rounded-xl"
                                disabled={isLoading}
                            >
                                {t.common.login}
                            </StatefulButton>

                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                {t.auth.noAccount}{' '}
                                <Link href="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                    {t.common.signup}
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

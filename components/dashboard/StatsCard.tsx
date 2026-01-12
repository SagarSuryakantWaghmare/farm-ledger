'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    type: 'debit' | 'credit' | 'net';
    index: number;
}

export function StatsCard({ title, value, type, index }: StatsCardProps) {
    const getStyles = () => {
        switch (type) {
            case 'debit':
                return {
                    gradient: 'from-red-500 to-pink-600',
                    icon: TrendingDown,
                    bgLight: 'bg-red-50',
                    bgDark: 'bg-red-900/20',
                    textColor: 'text-red-600',
                };
            case 'credit':
                return {
                    gradient: 'from-green-500 to-emerald-600',
                    icon: TrendingUp,
                    bgLight: 'bg-green-50',
                    bgDark: 'bg-green-900/20',
                    textColor: 'text-green-600',
                };
            case 'net':
                return {
                    gradient: 'from-blue-500 to-indigo-600',
                    icon: Wallet,
                    bgLight: 'bg-blue-50',
                    bgDark: 'bg-blue-900/20',
                    textColor: 'text-blue-600',
                };
        }
    };

    const { gradient, icon: Icon, bgLight, bgDark, textColor } = getStyles();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {title}
                            </p>
                            <motion.h3
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="text-3xl font-bold text-gray-900 dark:text-white"
                            >
                                ₹{value.toLocaleString('en-IN')}
                            </motion.h3>
                        </div>
                        <div className={`${bgLight} dark:${bgDark} p-3 rounded-full`}>
                            <Icon className={`h-6 w-6 ${textColor}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

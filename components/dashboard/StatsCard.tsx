'use client';

import { motion } from 'motion/react';
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
                    color: 'bg-red-500',
                    icon: TrendingDown,
                    bgLight: 'bg-red-50',
                    bgDark: 'bg-red-900/20',
                    textColor: 'text-red-500',
                    borderColor: 'border-red-100 dark:border-red-900/10'
                };
            case 'credit':
                return {
                    color: 'bg-emerald-500',
                    icon: TrendingUp,
                    bgLight: 'bg-emerald-50',
                    bgDark: 'bg-emerald-900/20',
                    textColor: 'text-emerald-500',
                    borderColor: 'border-emerald-100 dark:border-emerald-900/10'
                };
            case 'net':
                return {
                    color: 'bg-blue-500',
                    icon: Wallet,
                    bgLight: 'bg-blue-50',
                    bgDark: 'bg-blue-900/20',
                    textColor: 'text-blue-500',
                    borderColor: 'border-blue-100 dark:border-blue-900/10'
                };
        }
    };

    const { icon: Icon, bgLight, bgDark, textColor, borderColor } = getStyles();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="flex-1"
        >
            <Card className={`overflow-hidden border-2 ${borderColor} shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900 rounded-2xl`}>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                {title}
                            </p>
                            <motion.h3
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="text-3xl font-extrabold text-gray-900 dark:text-white"
                            >
                                ₹{value.toLocaleString('en-IN')}
                            </motion.h3>
                        </div>
                        <div className={`flex items-center justify-center w-14 h-14 rounded-2xl ${bgLight} dark:${bgDark}`}>
                            <Icon className={`h-7 w-7 ${textColor}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    Sprout,
    Moon,
    Sun,
    LogOut,
    Languages,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'mr' : 'en');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg dark:bg-gray-950/80"
        >
            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white">
                            <Sprout size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            FarmLedger
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user.name}
                                </span>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleLanguage}
                            title="Switch Language"
                        >
                            <Languages size={20} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={logout}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <LogOut size={16} className="mr-2" />
                            {t.common.logout}
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t py-4 space-y-2"
                    >
                        {user && (
                            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user.name}
                                </span>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={toggleLanguage}
                        >
                            <Languages size={20} className="mr-2" />
                            {language === 'en' ? 'Switch to Marathi' : 'इंग्रजीमध्ये बदला'}
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={toggleTheme}
                        >
                            {theme === 'dark' ? <Sun size={20} className="mr-2" /> : <Moon size={20} className="mr-2" />}
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={logout}
                        >
                            <LogOut size={20} className="mr-2" />
                            {t.common.logout}
                        </Button>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
}

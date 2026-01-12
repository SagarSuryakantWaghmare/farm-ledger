'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    accountId: string;
    language: string;
    theme: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (emailOrPhone: string, pin: string) => Promise<void>;
    signup: (data: SignupData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

interface SignupData {
    name: string;
    email: string;
    phone: string;
    pin: string;
    accountName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('farmledger_token');
        const savedUser = localStorage.getItem('farmledger_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (emailOrPhone: string, pin: string) => {
        try {
            const response = await axios.post('/api/auth/login', { emailOrPhone, pin });
            const { token: newToken, user: newUser } = response.data;

            localStorage.setItem('farmledger_token', newToken);
            localStorage.setItem('farmledger_user', JSON.stringify(newUser));

            setToken(newToken);
            setUser(newUser);

            toast.success('Login successful!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Login failed');
            throw error;
        }
    };

    const signup = async (data: SignupData) => {
        try {
            const response = await axios.post('/api/auth/signup', data);
            const { token: newToken, user: newUser } = response.data;

            localStorage.setItem('farmledger_token', newToken);
            localStorage.setItem('farmledger_user', JSON.stringify(newUser));

            setToken(newToken);
            setUser(newUser);

            toast.success('Account created successfully!');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Signup failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('farmledger_token');
        localStorage.removeItem('farmledger_user');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

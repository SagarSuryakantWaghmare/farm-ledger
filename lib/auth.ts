import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
};

export const authenticateUser = async (req: NextRequest) => {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) {
            return { error: 'No token provided', status: 401 };
        }

        const decoded = verifyToken(token) as { userId: string } | null;

        if (!decoded) {
            return { error: 'Invalid token', status: 401 };
        }

        await dbConnect();
        const user = await User.findById(decoded.userId).select('-pin');

        if (!user) {
            return { error: 'User not found', status: 404 };
        }

        return { user, accountId: user.accountId };
    } catch {
        return { error: 'Authentication failed', status: 500 };
    }
};

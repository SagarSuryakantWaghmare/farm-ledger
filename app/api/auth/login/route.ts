import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { validatePin } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        const { emailOrPhone, pin } = await req.json();

        const pinValidation = validatePin(pin);
        if (!pinValidation.valid) {
            return NextResponse.json({ error: pinValidation.error }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValidPin = await user.comparePin(pin);
        if (!isValidPin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = generateToken(user._id.toString());

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                accountId: user.accountId,
                language: user.language,
                theme: user.theme,
            },
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
    }
}

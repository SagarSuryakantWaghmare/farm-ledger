import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Account from '@/models/Account';
import { generateToken } from '@/lib/auth';
import { validateEmail, validatePhone, validatePin } from '@/lib/validators';

export async function POST(req: NextRequest) {
    try {
        const { name, email, phone, pin, accountName } = await req.json();

        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return NextResponse.json({ error: emailValidation.error }, { status: 400 });
        }

        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
            return NextResponse.json({ error: phoneValidation.error }, { status: 400 });
        }

        const pinValidation = validatePin(pin);
        if (!pinValidation.valid) {
            return NextResponse.json({ error: pinValidation.error }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const account = await Account.create({ accountName: accountName || `${name}'s Farm` });

        const user = await User.create({
            name,
            email,
            phone,
            pin,
            accountId: account._id,
        });

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
        }, { status: 201 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Signup failed';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

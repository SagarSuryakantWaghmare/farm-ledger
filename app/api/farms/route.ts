import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Farm from '@/models/Farm';
import { authenticateUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        await dbConnect();
        const farms = await Farm.find({ accountId: auth.accountId }).sort({ createdAt: -1 });

        return NextResponse.json({ farms });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch farms' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { name, location, area } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Farm name is required' }, { status: 400 });
        }

        await dbConnect();

        const farm = await Farm.create({
            name: name.trim(),
            location,
            area,
            accountId: auth.accountId,
        });

        return NextResponse.json({ farm }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create farm' }, { status: 500 });
    }
}

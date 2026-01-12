import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Worker from '@/models/Worker';
import { authenticateUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        await dbConnect();
        const workers = await Worker.find({ accountId: auth.accountId }).sort({ createdAt: -1 });

        return NextResponse.json({ workers });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch workers';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { name, phone } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ error: 'Worker name is required' }, { status: 400 });
        }

        await dbConnect();

        const worker = await Worker.create({
            name: name.trim(),
            phone,
            accountId: auth.accountId,
        });

        return NextResponse.json({ worker }, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create worker';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

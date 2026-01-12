import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { authenticateUser } from '@/lib/auth';
import { validateAmount } from '@/lib/validators';

export async function GET(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { searchParams } = new URL(req.url);
        const workerId = searchParams.get('workerId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const hasBill = searchParams.get('hasBill');
        const type = searchParams.get('type');

        await dbConnect();

        type QueryType = {
            accountId: string;
            workerId?: string;
            date?: { $gte?: Date; $lte?: Date };
            billImageUrl?: { $ne: null } | null;
            type?: string;
        };
        const query: QueryType = { accountId: auth.accountId };

        if (workerId) {
            query.workerId = workerId;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate);
            }
        }

        if (hasBill === 'true') {
            query.billImageUrl = { $ne: null };
        } else if (hasBill === 'false') {
            query.billImageUrl = null;
        }

        if (type && (type === 'DEBIT' || type === 'CREDIT')) {
            query.type = type;
        }

        const transactions = await Transaction.find(query)
            .populate('workerId', 'name')
            .populate('farmId', 'name')
            .populate('createdBy', 'name')
            .sort({ date: -1, createdAt: -1 });

        interface TSummary {
            type: string;
            amount: number;
        }

        const totalDebit = (transactions as unknown as TSummary[])
            .filter((t) => t.type === 'DEBIT')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalCredit = (transactions as unknown as TSummary[])
            .filter((t) => t.type === 'CREDIT')
            .reduce((sum, t) => sum + t.amount, 0);

        const netBalance = totalCredit - totalDebit;

        return NextResponse.json({
            transactions,
            summary: {
                totalDebit,
                totalCredit,
                netBalance,
                count: transactions.length,
            },
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch transactions';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { type, amount, description, workerId, farmId, billImageUrl, date } = await req.json();

        if (!type || (type !== 'DEBIT' && type !== 'CREDIT')) {
            return NextResponse.json({ error: 'Type must be DEBIT or CREDIT' }, { status: 400 });
        }

        const amountValidation = validateAmount(amount);
        if (!amountValidation.valid) {
            return NextResponse.json({ error: amountValidation.error }, { status: 400 });
        }

        if (!description || !description.trim()) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        if (!workerId) {
            return NextResponse.json({ error: 'Worker is required' }, { status: 400 });
        }

        if (type === 'CREDIT' && billImageUrl) {
            return NextResponse.json({ error: 'Credit transactions cannot have bill images' }, { status: 400 });
        }

        await dbConnect();

        const transaction = await Transaction.create({
            type,
            amount,
            description: description.trim(),
            workerId,
            farmId,
            accountId: auth.accountId,
            billImageUrl: type === 'DEBIT' ? billImageUrl : null,
            date: date || new Date(),
            createdBy: auth.user._id,
        });

        const populatedTransaction = await Transaction.findById(transaction._id)
            .populate('workerId', 'name')
            .populate('farmId', 'name')
            .populate('createdBy', 'name');

        return NextResponse.json({ transaction: populatedTransaction }, { status: 201 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create transaction';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const auth = await authenticateUser(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.status });
        }

        const { searchParams } = new URL(req.url);
        const eraseType = searchParams.get('type');

        if (!eraseType || !['all', 'debit', 'credit'].includes(eraseType)) {
            return NextResponse.json({ error: 'Invalid erase type' }, { status: 400 });
        }

        await dbConnect();

        const query: Record<string, string | null | object> = { accountId: auth.accountId };

        if (eraseType === 'debit') {
            query.type = 'DEBIT';
        } else if (eraseType === 'credit') {
            query.type = 'CREDIT';
        }

        const result = await Transaction.deleteMany(query);

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount,
            message: `${result.deletedCount} transactions erased`,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to erase transactions';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

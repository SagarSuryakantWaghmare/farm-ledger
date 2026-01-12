import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['DEBIT', 'CREDIT'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true,
    },
    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
    },
    billImageUrl: {
        type: String,
        default: null,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

TransactionSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

TransactionSchema.index({ accountId: 1, date: -1 });
TransactionSchema.index({ accountId: 1, workerId: 1 });
TransactionSchema.index({ accountId: 1, type: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

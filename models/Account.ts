import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        required: true,
        trim: true,
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

AccountSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
